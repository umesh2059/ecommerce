"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartWishlist } from "@/providers/cart-wishlist-provider";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) {
    return null;
  }

  return (
    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function CartWishlistIcons() {
  const { cartCount, wishlistItems } = useCartWishlist();

  return (
    <>
      <Link href="/wishlist" aria-label="Wishlist" className="relative">
        <Button variant="ghost" size="icon">
          <Heart className="size-5" />
        </Button>
        <CountBadge count={wishlistItems.length} />
      </Link>
      <Link href="/cart" aria-label="Cart" className="relative">
        <Button variant="ghost" size="icon">
          <ShoppingCart className="size-5" />
        </Button>
        <CountBadge count={cartCount} />
      </Link>
    </>
  );
}
