# myshoop — Project Log

Running record of what has been built, how it's wired together, and why —
kept up to date so future work (by you or by Claude) can pick up without
re-deriving context. Update this file whenever a feature area is added or
changed significantly; don't let it silently go stale.

## Stack

- **Next.js 16.3.0** (App Router, Turbopack) + **React 19.2.8**
- **Prisma 6.19** on **PostgreSQL (Neon)** — schema at `prisma/schema.prisma`
- **Auth**: custom JWT (`jsonwebtoken`) in an httpOnly `token` cookie, backed
  by a `Session` table so logout/revocation is real (not just cookie deletion)
- **Payments**: Razorpay (test mode) — order creation + signature verification
- **Images**: Cloudinary, uploaded via `/api/upload`
- **UI**: Tailwind v4, `@base-ui/react` primitives wrapped in
  `src/components/ui/button.tsx` (cva-based variants), lucide-react icons

## Conventions established in this codebase

- **Mutations go through Route Handlers** (`src/app/api/**/route.ts`), not
  Server Actions. Client components call them with `fetch(...)`. Follow this
  pattern for consistency — don't introduce `"use server"` actions alongside it.
- Every route handler follows the same shape:
  ```ts
  export async function POST(request: Request) {
    try {
      const { user, response } = await requireAuth(); // or requireAdmin()
      if (response) return response;
      // ...validate, do the DB call...
      return NextResponse.json({ success: true, ... });
    } catch (error) {
      console.error("SOME LABEL ERROR:", error);
      return NextResponse.json({ success: false, message: "..." }, { status: 500 });
    }
  }
  ```
  `success`/`message` on every JSON response; auth guards live in `src/lib/auth.ts`.
- Prices are stored as **integers in paise** (1/100 rupee) everywhere —
  `formatPrice()` in `src/constants/products.ts` divides by 100 for display.
- Dynamic route params are `Promise`-typed and must be `await`ed
  (`{ params }: { params: Promise<{ id: string }> }`) — this is the Next 16
  convention, don't destructure params synchronously.
- Unused handler args (e.g. `request` in a `DELETE` that only needs `params`)
  are prefixed `_request` rather than omitted, per existing routes in
  `src/app/api/products/[id]/route.ts`.
- `getCurrentUser()` returns the raw JWT payload (`{userId, role, jti}`);
  `getSession()` re-reads the full `User` row from the DB so role/name are
  never stale for the cookie's 7-day lifetime. Use `getSession()` in pages,
  `getCurrentUser()` where you only need the id/role cheaply.

## Feature areas

### Auth (`src/lib/auth.ts`, `src/app/api/auth/*`)
Register/login/logout via bcrypt + JWT + a `Session` table (so a stolen token
can be revoked server-side, not just by deleting the cookie). `requireAuth()` /
`requireAdmin()` are the two guards every protected route uses.

### Products & admin (`src/lib/products.ts`, `src/app/admin/*`)
CRUD lives under `/admin` (admin-only), reads happen through
`getProducts()`/`getProductBySlug()`/etc. Category/size are Postgres enums;
`src/lib/products.ts` maps enum values to the display strings the frontend
`Product` type expects.

### Image uploads (`src/lib/cloudinary.ts`, `/api/upload`)
Admin product images upload straight to Cloudinary; the returned secure URL is
what's stored on `Product.image` / `Product.images`.

### Payments (`src/app/api/payment/*`, `src/components/checkout/place-order-button.tsx`)
Razorpay checkout.js loaded client-side. Flow: `create-order` (server creates
a Razorpay order + a `PENDING` `Order`+`OrderItem` row) → Razorpay modal →
`verify` (checks the signature, flips `paymentStatus`). **This flow is
single-product, "buy now" style** — it takes `productSlug` + `size` +
`quantity` from the checkout page's query string, not from a cart. See the
Cart section below for how the two currently coexist.

### Cart & Wishlist — added 2026-09-07

These didn't exist before (the navbar had Heart/ShoppingCart icon *buttons*
that were purely decorative — no handlers, no API, no `CartItem`/`WishlistItem`
reads or writes anywhere in the app, even though both models were already in
`schema.prisma`). This session wired them up end to end.

**Data model** (already in schema, unchanged):
- `CartItem` — unique on `(userId, productId, size)`; `size` is a
  non-nullable `ProductSize` enum, `quantity` defaults to 1.
- `WishlistItem` — unique on `(userId, productId)`.

**API routes** (all behind `requireAuth()`, 401 JSON if not logged in):
- `GET /api/cart` — list current user's cart items with `product` included,
  plus `count` (sum of quantities).
- `POST /api/cart` — body `{ productId, size?, quantity? }`. Upserts: if a
  `(userId, productId, size)` row exists, increments quantity instead of
  erroring. If the product has no configured `sizes`, `size` is optional and
  defaults to `M` purely so the non-nullable DB column has *something* — see
  "Known limitations" below.
- `PATCH /api/cart/[id]` — body `{ quantity }`, must be a positive integer.
  Ownership is checked (`item.userId === user.id`) before updating.
- `DELETE /api/cart/[id]` — same ownership check, then delete.
- `GET /api/wishlist` — list current user's wishlist with `product` included,
  plus a flat `productIds` array for quick lookup.
- `POST /api/wishlist` — body `{ productId }`. Idempotent: adding an already-
  wishlisted product just returns the existing row (200, not a 409).
- `DELETE /api/wishlist/[productId]` — `deleteMany` so removing something
  that isn't there is a no-op success, not a 404.

**Client state** (`src/providers/cart-wishlist-provider.tsx`):
A single `CartWishlistProvider`, mounted once in `src/app/layout.tsx` around
the whole app, exposes `useCartWishlist()`:
`cartItems`, `cartCount`, `wishlistItems`, `wishlistIds` (a `Set<string>` of
product ids, for O(1) "is this wishlisted" checks in cards),
`addToCart`, `updateCartItemQuantity`, `removeCartItem`, `toggleWishlist`,
`refresh`. It fetches both `/api/cart` and `/api/wishlist` on mount; for a
logged-out visitor those 401 and the provider just treats that as empty
state (no error thrown, no redirect from inside the provider itself —
redirects on click are handled by the calling component, since only *that*
component knows the right `next=` URL to send the user back to).

Mutation calls re-fetch (`refresh()`) after a successful write rather than
optimistically patching local state — simpler to reason about, and cart/
wishlist writes are infrequent low-latency actions where a round trip isn't
noticeable.

> **eslint note**: the mount-time `useEffect` in this provider has a
> `// eslint-disable-next-line react-hooks/set-state-in-effect` on it. That
> rule (part of the React Compiler–era `eslint-plugin-react-hooks` v9 shipped
> with Next 16) statically flags *any* effect that transitively reaches a
> `setState` call, even through an `await`ed fetch — it can't distinguish a
> synchronous render-loop hazard from a normal "load data when this mounts"
> effect. This is a deliberate, narrow suppression, not an oversight.

**Where it's surfaced in the UI:**
- `src/components/navbar/cart-wishlist-icons.tsx` — replaces the old dead
  Heart/ShoppingCart buttons in the navbar with real `Link`s to `/wishlist`
  and `/cart`, each with a live count badge from the provider.
- `src/components/cards/product-card-quick-actions.tsx` — a heart + cart
  button overlaid on every `ProductCard` (shop grid, related products, etc.)
  so users can wishlist/add-to-cart without opening the product page.
  `event.preventDefault()`/`stopPropagation()` stop the click from following
  the card's outer `<Link>` to the product page.
- `src/components/products/product-detail-interactive.tsx` — the wishlist
  heart button (previously local `useState`, didn't persist anything) now
  reads/writes through the provider; a new "Add to cart" button sits next to
  the existing "Buy now" button and uses the currently-selected size.
- `src/app/(shop)/cart/page.tsx` + `src/components/cart/cart-view.tsx` — new
  `/cart` page: quantity +/-, remove, subtotal. Redirects to
  `/login?next=/cart` if not signed in.
- `src/app/(shop)/wishlist/page.tsx` + `src/components/wishlist/wishlist-view.tsx`
  — new `/wishlist` page: remove, or add straight to cart. Same login redirect.

**Known limitations / deliberately not done yet:**
- **Checkout still doesn't read from the cart.** It's still the pre-existing
  single-item `/checkout?product=<slug>&size=<size>` flow tied to Razorpay
  order creation. The cart page's per-line "Checkout this item" link reuses
  that same single-item flow rather than a real multi-item checkout, so a
  cart with 3 different products currently has to be checked out one line at
  a time. Building a real multi-item checkout means changing
  `create-order`/`verify` to accept a list of cart item ids (and clearing
  those `CartItem` rows on successful payment) — that's a bigger, separate
  change and hasn't been done.
- Products with an empty `sizes[]` (some `HOME`/`BEAUTY` category items might
  have none) fall back to `ProductSize.M` when added to cart from anywhere
  that doesn't ask for a size (product card quick-add, wishlist "add to
  cart"). This is a workaround for `CartItem.size` being non-nullable in the
  schema, not a real merchandising decision — worth revisiting if those
  categories start actually varying by size.
- No stock-quantity clamping on cart mutations (you can set quantity higher
  than `Product.stock`); `create-order` does check stock at checkout time, so
  this isn't exploitable for overselling, just a UX gap.

## Verification done for the cart/wishlist work (2026-09-07)

- `npx tsc --noEmit` — clean.
- `npx eslint` over every new/changed file — clean except the pre-existing
  `<img>`-vs-`next/image` warning style already present elsewhere in the repo.
- Ran `next dev`, registered a throwaway user, and exercised every endpoint
  with `curl` (add/list/update-quantity/remove for cart; add/list/idempotent-
  re-add/remove for wishlist) — all matched expected status codes and bodies.
  Rendered `/shop`, `/cart`, `/wishlist`, and a product detail page while
  authenticated — all `200`, no server errors. Cleaned up the throwaway user
  afterward (cascade-deleted its cart/wishlist rows too).
- Did **not** get a visual/click-through browser check — the Chrome
  extension wasn't installed this session. If something looks off visually
  (badge alignment, the quick-action buttons on the card image), that's the
  first place to look with `/chrome` in a future session.

### Delivery addresses + direct "Buy now" on cards — added 2026-09-07

**Schema fix (migration `20260907171547_drop_order_shipping_address_unique`):**
`Order.shippingAddressId` was `@unique`, making `Address ↔ Order` a strict
one-to-one — a saved address could only ever be attached to *one* order,
ever. Any attempt to reuse a saved address for a second order would have
hit a unique-constraint violation. Dropped the `@unique` (now a plain
one-to-many: `Address.orders` is `Order[]`). Verified by creating two orders
against the same address id in the same test run — both succeeded.

**API** (`src/app/api/addresses/route.ts`, `src/app/api/addresses/[id]/route.ts`,
both behind `requireAuth()`):
- `GET /api/addresses` — list, `isDefault` first.
- `POST /api/addresses` — body `{ street, city, state, zip, country, isDefault? }`.
  The first address a user ever adds is auto-made default; setting `isDefault`
  on any add/update unsets it on every other address for that user inside a
  `$transaction`, so there's always at most one default.
- `PATCH /api/addresses/[id]` — partial update, ownership-checked.
- `DELETE /api/addresses/[id]` — ownership-checked; if the deleted address was
  the default, the most-recently-created remaining one is promoted so there's
  always a default to preselect at checkout.

**`create-order` now requires `shippingAddressId`** (`src/app/api/payment/create-order/route.ts`):
400s with "A delivery address is required" if missing, 404s if the address
doesn't belong to the caller. This is a breaking change to that endpoint's
contract — anything calling it must now send a saved address id.

**UI:**
- `src/components/checkout/address-selector.tsx` — radio-select over saved
  addresses + an inline "Add new address" form (auto-opens if the user has
  none yet).
- `src/components/checkout/checkout-client.tsx` — client wrapper around
  `AddressSelector` + `PlaceOrderButton` (the checkout page itself is a
  Server Component, so this is where `selectedAddressId` state lives).
  Preselects the default address, or the first one, on mount.
- `PlaceOrderButton` now takes `shippingAddressId` and refuses to place the
  order without one ("Add a delivery address" button state).
- `/checkout` (used by both the cart's "Checkout this item" links and every
  "Buy now" button) fetches the signed-in user's addresses server-side and
  passes them to `CheckoutClient` — so address selection is live on **both**
  checkout entry points automatically, not something bolted onto just one.
- Also fixed a pre-existing bug on this page while touching it: the order
  summary thumbnail was `style={{ background: product.image }}` (a bare URL
  isn't valid CSS for `background`, so it silently rendered nothing) — now a
  real `<img>`.
- Product cards (`src/components/cards/product-card-quick-actions.tsx`) got a
  third quick-action button — a lightning-bolt "Buy now" that jumps straight
  to `/checkout?product=<slug>&size=<firstSize>`, alongside the existing
  wishlist and add-to-cart buttons. This is the literal "direct click buy"
  path the shop grid was missing — previously "Buy now" only existed on the
  product detail page.

**Known limitation carried over:** checkout is still single-item (see the
Cart & Wishlist section above) — address selection was added to that same
single-item flow, not to a new multi-item one. A cart with several different
products still needs one "Checkout this item" per line.

**Verification:** `tsc`/`eslint` clean. Full `curl` run against a throwaway
user: address CRUD (add, list, default-switch on add and on PATCH,
delete-promotes-next-default), `create-order` rejecting a missing address
(400) and accepting + reusing one across two orders, and rendered
`/checkout` and `/shop` HTML to confirm the address form and all three
card quick-action buttons are present. No visual browser check (same
Chrome-extension caveat as above).
