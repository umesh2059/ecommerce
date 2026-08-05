import Link from "next/link";
import { Star } from "lucide-react";

import type { Product } from "@/types";
import { formatPrice } from "@/constants/products";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-border bg-background transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <div
          className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
          style={{ background: product.image }}
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="rounded-full bg-foreground px-2.5 py-1 text-xs font-medium text-background">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-medium text-white">
              Sale
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span>{product.rating}</span>
          <span aria-hidden>({product.reviewCount})</span>
        </div>
        <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-sm font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}