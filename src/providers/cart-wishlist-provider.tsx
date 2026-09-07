"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product, WishlistItem } from "@prisma/client";

export type CartLine = CartItem & { product: Product };
export type WishlistLine = WishlistItem & { product: Product };

type MutationResult = { success: boolean; message?: string };

export type AddedToCartNotification = {
  id: number;
  productName: string;
  productSlug: string;
  size: string;
};

type CartWishlistContextValue = {
  isLoading: boolean;
  cartItems: CartLine[];
  cartCount: number;
  wishlistItems: WishlistLine[];
  wishlistIds: Set<string>;
  lastAddedToCart: AddedToCartNotification | null;
  dismissLastAddedToCart: () => void;
  addToCart: (input: {
    productId: string;
    size?: string;
    quantity?: number;
  }) => Promise<MutationResult>;
  updateCartItemQuantity: (
    itemId: string,
    quantity: number
  ) => Promise<MutationResult>;
  removeCartItem: (itemId: string) => Promise<MutationResult>;
  toggleWishlist: (productId: string) => Promise<MutationResult>;
  refresh: () => Promise<void>;
};

const CartWishlistContext = createContext<CartWishlistContextValue | null>(null);

export function CartWishlistProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistLine[]>([]);
  const [lastAddedToCart, setLastAddedToCart] = useState<AddedToCartNotification | null>(
    null
  );

  const dismissLastAddedToCart = useCallback(() => {
    setLastAddedToCart(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const [cartRes, wishlistRes] = await Promise.all([
        fetch("/api/cart"),
        fetch("/api/wishlist"),
      ]);

      const cartData = cartRes.ok ? await cartRes.json() : null;
      const wishlistData = wishlistRes.ok ? await wishlistRes.json() : null;

      setCartItems(cartData?.success ? cartData.items : []);
      setWishlistItems(wishlistData?.success ? wishlistData.items : []);
    } catch (error) {
      console.error("REFRESH CART/WISHLIST ERROR:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // react-hooks/set-state-in-effect flags this call because `refresh`
    // eventually calls setState, but that happens after an awaited fetch —
    // not synchronously during this effect — so it's a legitimate initial
    // sync with the server, not a render-loop hazard.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const addToCart = useCallback(
    async ({
      productId,
      size,
      quantity = 1,
    }: {
      productId: string;
      size?: string;
      quantity?: number;
    }): Promise<MutationResult> => {
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, size, quantity }),
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          return { success: false, message: data.message ?? "Unable to add to cart" };
        }

        await refresh();

        if (data.item?.product) {
          setLastAddedToCart({
            id: Date.now(),
            productName: data.item.product.name,
            productSlug: data.item.product.slug,
            size: data.item.size,
          });
        }

        return { success: true, message: data.message };
      } catch (error) {
        console.error("ADD TO CART ERROR:", error);
        return { success: false, message: "Unable to add to cart" };
      }
    },
    [refresh]
  );

  const updateCartItemQuantity = useCallback(
    async (itemId: string, quantity: number): Promise<MutationResult> => {
      try {
        const res = await fetch(`/api/cart/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          return { success: false, message: data.message ?? "Unable to update cart" };
        }

        await refresh();
        return { success: true };
      } catch (error) {
        console.error("UPDATE CART ITEM ERROR:", error);
        return { success: false, message: "Unable to update cart" };
      }
    },
    [refresh]
  );

  const removeCartItem = useCallback(
    async (itemId: string): Promise<MutationResult> => {
      try {
        const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
        const data = await res.json();

        if (!res.ok || !data.success) {
          return { success: false, message: data.message ?? "Unable to remove item" };
        }

        await refresh();
        return { success: true };
      } catch (error) {
        console.error("REMOVE CART ITEM ERROR:", error);
        return { success: false, message: "Unable to remove item" };
      }
    },
    [refresh]
  );

  const toggleWishlist = useCallback(
    async (productId: string): Promise<MutationResult> => {
      const isWishlisted = wishlistItems.some((item) => item.productId === productId);

      try {
        const res = isWishlisted
          ? await fetch(`/api/wishlist/${productId}`, { method: "DELETE" })
          : await fetch("/api/wishlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId }),
            });

        const data = await res.json();

        if (!res.ok || !data.success) {
          return { success: false, message: data.message ?? "Unable to update wishlist" };
        }

        await refresh();
        return { success: true, message: data.message };
      } catch (error) {
        console.error("TOGGLE WISHLIST ERROR:", error);
        return { success: false, message: "Unable to update wishlist" };
      }
    },
    [wishlistItems, refresh]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const wishlistIds = useMemo(
    () => new Set(wishlistItems.map((item) => item.productId)),
    [wishlistItems]
  );

  const value = useMemo<CartWishlistContextValue>(
    () => ({
      isLoading,
      cartItems,
      cartCount,
      wishlistItems,
      wishlistIds,
      lastAddedToCart,
      dismissLastAddedToCart,
      addToCart,
      updateCartItemQuantity,
      removeCartItem,
      toggleWishlist,
      refresh,
    }),
    [
      isLoading,
      cartItems,
      cartCount,
      wishlistItems,
      wishlistIds,
      lastAddedToCart,
      dismissLastAddedToCart,
      addToCart,
      updateCartItemQuantity,
      removeCartItem,
      toggleWishlist,
      refresh,
    ]
  );

  return (
    <CartWishlistContext.Provider value={value}>{children}</CartWishlistContext.Provider>
  );
}

export function useCartWishlist() {
  const context = useContext(CartWishlistContext);

  if (!context) {
    throw new Error("useCartWishlist must be used within a CartWishlistProvider");
  }

  return context;
}
