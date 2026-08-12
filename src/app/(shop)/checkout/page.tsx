import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, Lock } from "lucide-react";

import { formatPrice } from "@/constants/products";
import { getProductBySlug } from "@/lib/products";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const user = await getSession();

  if (!user) {
    const { product } = await searchParams;
    const next = product
      ? `/checkout?product=${encodeURIComponent(product)}`
      : "/checkout";

    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  const { product: slug } = await searchParams;
  const product = slug ? await getProductBySlug(slug) : undefined;

  const subtotal = product?.price ?? 0;
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 9.99;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Signed in as {user.name}. Confirm your order below.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border">
        <div className="flex items-center justify-between gap-4 border-b border-border bg-muted/40 px-5 py-4">
          <p className="text-sm font-medium">Order summary</p>
          <Link
            href="/shop"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Continue shopping
          </Link>
        </div>

        {product ? (
          <div className="flex items-center gap-4 px-5 py-4">
            <div
              className="size-20 shrink-0 rounded-lg border border-border"
              style={{ background: product.image }}
            />
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                {product.category} · {product.sizes[0]}
              </p>
            </div>
            <span className="font-semibold">
              {formatPrice(product.price)}
            </span>
          </div>
        ) : (
          <p className="px-5 py-6 text-sm text-muted-foreground">
            Your cart appears to be empty.{" "}
            <Link href="/shop" className="text-foreground underline underline-offset-4">
              Browse products
            </Link>{" "}
            to get started.
          </p>
        )}

        <dl className="space-y-2 border-t border-border px-5 py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(subtotal + shipping)}</dd>
          </div>
        </dl>

        <div className="border-t border-border px-5 py-4">
          <Button size="lg" className="w-full" disabled={!product}>
            {product ? "Place order" : "Add an item to checkout"}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5" />
            Secure checkout · Protected payments <Check className="size-3.5 text-emerald-600" />
          </p>
        </div>
      </div>
    </div>
  );
}