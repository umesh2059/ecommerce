import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { categories } from "@/constants/products";
import {
  getFeaturedProducts,
  getNewArrivals,
} from "@/lib/products";
import { ProductCard } from "@/components/cards/product-card";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/home/hero-carousel";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      <HeroCarousel />

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Shop by category
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Find exactly what you&apos;re looking for.
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category.slug} {...category} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Featured products
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hand-picked favorites from our collection.
            </p>
          </div>
          <Button render={<Link href="/shop" />} variant="ghost" className="shrink-0">
              View all <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              New arrivals
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fresh drops, just landed.
            </p>
          </div>
          <Button render={<Link href="/shop?filter=new" />} variant="ghost" className="shrink-0">
              View all <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CategoryCard({
  name,
  slug,
  image,
}: {
  name: string;
  slug: string;
  image: string;
}) {
  return (
    <Link
      href={`/shop?category=${slug}`}
      className="group relative flex aspect-[4/5] items-end overflow-hidden rounded-xl border border-border"
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <span className="relative p-4 text-sm font-medium text-white">
        {name}
      </span>
    </Link>
  );
}