import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Heart, Star, Truck, RefreshCcw, ShieldCheck } from "lucide-react";

import {
  formatPrice,
  getProductBySlug,
  getRelatedProducts,
} from "@/constants/products";
import { ProductCard } from "@/components/cards/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link
          href="/shop"
          className="transition-colors hover:text-foreground"
        >
          Shop
        </Link>
        <span aria-hidden>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-4">
          <div
            className="aspect-square w-full rounded-2xl border border-border"
            style={{ background: product.image }}
          />
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={cn(
                  "aspect-square rounded-xl border",
                  index === 0 ? "border-foreground" : "border-border"
                )}
                style={{ background: image }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {product.category}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white">
                  Save{" "}
                  {formatPrice(product.compareAtPrice! - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="text-sm leading-7 text-muted-foreground">
            {product.description}
          </p>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">
              Size{" "}
              <span className="ml-1 font-normal text-muted-foreground">
                {product.sizes.join(" / ")}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:border-foreground focus-visible:outline-none"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">
              Color{" "}
              <span className="ml-1 font-normal text-muted-foreground">
                {product.colors.length} options
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  aria-label="Select color"
                  className="size-8 rounded-full border border-border transition-transform hover:scale-110 focus-visible:outline-none"
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1">
              Add to cart
            </Button>
            <Button size="lg" variant="outline" className="sm:w-14">
              <Heart className="size-5" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-4 text-sm">
            <Perk icon={<Truck className="size-4" />} title="Free shipping">
              On all orders over $75.
            </Perk>
            <Perk icon={<RefreshCcw className="size-4" />} title="Free returns">
              30-day hassle-free returns.
            </Perk>
            <Perk icon={<ShieldCheck className="size-4" />} title="Secure checkout">
              Protected payments.
            </Perk>
          </div>

          <p className="text-sm text-muted-foreground">
            <Check className="mr-1 inline size-4 text-emerald-600" />
            In stock — ships within 24 hours.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-semibold tracking-tight">
            You might also like
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
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
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-foreground">
        {icon}
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}