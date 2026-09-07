"use client";

import Link from "next/link";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/constants/products";
import { useCartWishlist } from "@/providers/cart-wishlist-provider";
import { useState } from "react";

export function CartView() {
  const { cartItems, isLoading, updateCartItemQuantity, removeCartItem } = useCartWishlist();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  async function handleQuantityChange(itemId: string, quantity: number) {
    if (quantity < 1) {
      return;
    }

    setPendingId(itemId);
    await updateCartItemQuantity(itemId, quantity);
    setPendingId(null);
  }

  async function handleRemove(itemId: string) {
    setPendingId(itemId);
    await removeCartItem(itemId);
    setPendingId(null);
  }

  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center py-12 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">Your cart is empty.</p>
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
    <div className="mt-8 overflow-hidden rounded-2xl border border-border">
      <ul>
        {cartItems.map((item) => (
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
              <p className="text-sm text-muted-foreground">Size: {item.size}</p>
              <div className="mt-1 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={pendingId === item.id}
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  <Minus className="size-3.5" />
                </Button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={pendingId === item.id}
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  <Plus className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={pendingId === item.id}
                  onClick={() => handleRemove(item.id)}
                  aria-label="Remove item"
                  className="ml-2 text-muted-foreground hover:text-destructive"
                >
                  {pendingId === item.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-semibold">
                {formatPrice(item.product.price * item.quantity)}
              </span>
              <Link
                href={`/checkout?product=${encodeURIComponent(item.product.slug)}&size=${encodeURIComponent(item.size)}`}
                className="text-xs font-medium text-foreground underline underline-offset-4"
              >
                Checkout this item
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-border bg-muted/40 px-5 py-4">
        <span className="text-sm text-muted-foreground">Subtotal</span>
        <span className="text-base font-semibold">{formatPrice(subtotal)}</span>
      </div>
    </div>
  );
}
