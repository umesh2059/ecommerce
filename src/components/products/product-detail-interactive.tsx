"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Heart, Check, Truck, RefreshCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/constants/products";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type TokenPayload = {
  userId: string;
  role: "USER" | "ADMIN";
  jti: string;
} | null;

export function ProductDetailInteractive({
  product,
  user,
}: {
  product: Product;
  user: TokenPayload;
}) {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  const checkoutUrl = `/checkout?product=${encodeURIComponent(
    product.slug
  )}&size=${encodeURIComponent(selectedSize)}&color=${encodeURIComponent(
    selectedColor
  )}`;

  const buyHref = user
    ? checkoutUrl
    : `/login?next=${encodeURIComponent(checkoutUrl)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Product Images Gallery */}
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted">
          <img
            src={selectedImage}
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {product.images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border bg-muted transition-all hover:opacity-90",
                selectedImage === img
                  ? "border-foreground ring-2 ring-foreground/20 scale-[0.98]"
                  : "border-border"
              )}
            >
              <img src={img} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Product Details Column */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {product.category}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{product.rating}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground font-medium">
              {product.reviewCount} verified reviews
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-foreground">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg text-muted-foreground line-through decoration-muted-foreground/60 font-medium">
                {formatPrice(product.compareAtPrice!)}
              </span>
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600">
                Save {formatPrice(product.compareAtPrice! - product.price)}
              </span>
            </>
          )}
        </div>

        <div className="h-px bg-border" />

        <p className="text-sm leading-7 text-muted-foreground/90 font-normal">
          {product.description}
        </p>

        {/* Sizes Selector */}
        {product.sizes.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              Select Size
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "min-w-12 h-10 rounded-xl border text-sm font-semibold transition-all duration-200 focus-visible:outline-none hover:border-foreground",
                    selectedSize === size
                      ? "border-foreground bg-foreground text-background shadow-md shadow-foreground/10"
                      : "border-border text-foreground hover:bg-muted/40"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colors Selector */}
        {product.colors.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">
              Select Color
            </p>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select color ${color}`}
                  className={cn(
                    "size-8 rounded-full border border-black/10 transition-all duration-200 hover:scale-110 focus-visible:outline-none relative flex items-center justify-center",
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-foreground"
                      : "hover:ring-1 hover:ring-offset-1 hover:ring-muted-foreground"
                  )}
                  style={{ background: color }}
                >
                  {selectedColor === color && (
                    <span
                      className="size-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          color.toLowerCase() === "#ffffff" ? "#000000" : "#ffffff",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Checkout Actions */}
        <div className="flex flex-col gap-3 sm:flex-row mt-2">
          {user ? (
            <Button render={<Link href={buyHref} />} size="lg" className="flex-1 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
              Buy now
            </Button>
          ) : (
            <Button
              render={<Link href={buyHref} />}
              size="lg"
              className="flex-1 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
            >
              Buy now · Sign in to checkout
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={cn("sm:w-14 rounded-xl border border-border transition-colors duration-300", 
              isWishlisted && "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300")}
          >
            <Heart className={cn("size-5 transition-transform duration-300", isWishlisted && "fill-rose-600 scale-110 text-rose-600")} />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>

        {/* Perks Grid */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/30 p-5 text-sm">
          <Perk icon={<Truck className="size-4 text-primary" />} title="Free shipping">
            On all orders over $75.
          </Perk>
          <Perk icon={<RefreshCcw className="size-4 text-primary" />} title="Free returns">
            30-day hassle-free returns.
          </Perk>
          <Perk icon={<ShieldCheck className="size-4 text-primary" />} title="Secure checkout">
            Protected payments.
          </Perk>
        </div>

        <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          <Check className="size-4 text-emerald-600 stroke-[3]" />
          In stock — ships within 24 hours.
        </p>
      </div>
    </div>
  );
}

function Perk({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-background border border-border shadow-sm text-foreground">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-foreground text-sm">{title}</p>
        <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
