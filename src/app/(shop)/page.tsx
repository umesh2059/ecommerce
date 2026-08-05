import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  categories,
  getFeaturedProducts,
  getNewArrivals,
} from "@/constants/products";
import { ProductCard } from "@/components/cards/product-card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const newArrivals = getNewArrivals();

  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      <Hero />

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

function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative flex min-h-[420px] flex-col justify-center overflow-hidden rounded-3xl bg-muted px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              "linear-gradient(120deg, rgba(30,41,59,0.9) 0%, rgba(71,85,105,0.5) 55%, rgba(148,163,184,0.3) 100%)",
          }}
        />
        <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Considered goods for everyday living
          </h1>
          <p className="max-w-xl text-base text-white/80 sm:text-lg">
            Discover thoughtfully curated products that blend form, function,
            and durability. Free shipping on orders over $75.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
                        <Button render={<Link href="/shop" />} size="lg">
              Shop now
            </Button>
            <Button
              render={<Link href="/shop?filter=new" />}
              size="lg"
              variant="secondary"
            >
              New arrivals
            </Button>
          </div>
        </div>
      </div>
    </section>
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
      <div
        className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
        style={{ background: image }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <span className="relative p-4 text-sm font-medium text-white">
        {name}
      </span>
    </Link>
  );
}