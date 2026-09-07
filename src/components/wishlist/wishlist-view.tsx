"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ShoppingCart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/constants/products";
import { useCartWishlist } from "@/providers/cart-wishlist-provider";

export function WishlistView() {
  const { wishlistItems, isLoading, toggleWishlist, addToCart } = useCartWishlist();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleRemove(productId: string) {
    setPendingId(productId);
    await toggleWishlist(productId);
    setPendingId(null);
  }

  async function handleAddToCart(productId: string, size?: string) {
    setPendingId(productId);
    await addToCart({ productId, size });
    setPendingId(null);
  }

  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center py-12 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">Your wishlist is empty.</p>
        <Link
          href="/shop"
          className="mt-3 inline-block text-sm font-medium text-foreground underline underline-offset-4"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-8 overflow-hidden rounded-2xl border border-border">
      {wishlistItems.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
        >
          <img
            src={item.product.image}
            alt={item.product.name}
            className="size-20 shrink-0 rounded-lg border border-border object-cover"
          />
          <div className="flex flex-1 flex-col gap-1">
            <Link
              href={`/shop/product/${item.product.slug}`}
              className="font-medium hover:underline"
            >
              {item.product.name}
            </Link>
            <span className="text-sm font-semibold text-foreground">
              {formatPrice(item.product.price)}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={pendingId === item.productId}
            onClick={() => handleAddToCart(item.productId, item.product.sizes[0])}
            aria-label="Add to cart"
          >
            {pendingId === item.productId ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <ShoppingCart className="size-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={pendingId === item.productId}
            onClick={() => handleRemove(item.productId)}
            aria-label="Remove from wishlist"
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="size-3.5" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
