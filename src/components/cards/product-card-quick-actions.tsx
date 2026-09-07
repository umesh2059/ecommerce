"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCartWishlist } from "@/providers/cart-wishlist-provider";
import type { Product } from "@/types";

export function ProductCardQuickActions({ product }: { product: Product }) {
  const router = useRouter();
  const { wishlistIds, toggleWishlist, addToCart } = useCartWishlist();
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isWishlisted = wishlistIds.has(product.id);

  async function handleToggleWishlist(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (isTogglingWishlist) {
      return;
    }

    setIsTogglingWishlist(true);
    const result = await toggleWishlist(product.id);
    setIsTogglingWishlist(false);

    if (!result.success && result.message === "Unauthorized. Please log in.") {
      router.push(`/login?next=${encodeURIComponent("/shop")}`);
    }
  }

  async function handleAddToCart(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (isAddingToCart) {
      return;
    }

    setIsAddingToCart(true);
    const result = await addToCart({ productId: product.id, size: product.sizes[0] });
    setIsAddingToCart(false);

    if (!result.success && result.message === "Unauthorized. Please log in.") {
      router.push(`/login?next=${encodeURIComponent("/shop")}`);
    }
  }

  return (
    <div className="absolute right-3 top-3 flex flex-col gap-2">
      <button
        type="button"
        onClick={handleToggleWishlist}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={isWishlisted}
        disabled={isTogglingWishlist}
        className={cn(
          "flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background disabled:opacity-60",
          isWishlisted && "text-rose-600"
        )}
      >
        {isTogglingWishlist ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Heart className={cn("size-4", isWishlisted && "fill-rose-600")} />
        )}
      </button>
      <button
        type="button"
        onClick={handleAddToCart}
        aria-label="Add to cart"
        disabled={isAddingToCart}
        className="flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background disabled:opacity-60"
      >
        {isAddingToCart ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ShoppingCart className="size-4" />
        )}
      </button>
    </div>
  );
}
