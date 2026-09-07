"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Check, ShoppingCart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartWishlist } from "@/providers/cart-wishlist-provider";

const AUTO_DISMISS_MS = 6000;

export function AddedToCartToast() {
  const { lastAddedToCart, dismissLastAddedToCart } = useCartWishlist();

  useEffect(() => {
    if (!lastAddedToCart) {
      return;
    }

    const timer = setTimeout(() => {
      dismissLastAddedToCart();
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(timer);
  }, [lastAddedToCart, dismissLastAddedToCart]);

  if (!lastAddedToCart) {
    return null;
  }

  const checkoutHref = `/checkout?product=${encodeURIComponent(
    lastAddedToCart.productSlug
  )}&size=${encodeURIComponent(lastAddedToCart.size)}`;

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-border bg-background p-4 shadow-lg sm:right-4 sm:left-auto sm:bottom-6"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check className="size-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Added to cart</p>
          <p className="text-sm text-muted-foreground">
            {lastAddedToCart.productName}
            {lastAddedToCart.size ? ` · Size ${lastAddedToCart.size}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={dismissLastAddedToCart}
          aria-label="Dismiss"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex gap-2">
        <Button
          render={<Link href="/cart" />}
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={dismissLastAddedToCart}
        >
          <ShoppingCart className="size-3.5" />
          View cart
        </Button>
        <Button
          render={<Link href={checkoutHref} />}
          size="sm"
          className="flex-1"
          onClick={dismissLastAddedToCart}
        >
          Proceed to buy
        </Button>
      </div>
    </div>
  );
}
