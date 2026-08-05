import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

import { products, categories } from "@/constants/products";
import { ProductCard } from "@/components/cards/product-card";
import { SortSelect } from "./sort-select";
import { cn } from "@/lib/utils";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const category = getParam(params.category);
  const filter = getParam(params.filter);
  const sort = getParam(params.sort);

  let visible = [...products];

  if (category) {
    visible = visible.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (filter === "new") {
    visible = visible.filter((p) => p.isNew);
  }
  if (filter === "sale") {
    visible = visible.filter((p) => p.compareAtPrice);
  }

  if (sort === "price-asc") {
    visible.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    visible.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    visible.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {filter === "new"
            ? "New arrivals"
            : filter === "sale"
              ? "Sale"
              : category
                ? category.charAt(0).toUpperCase() + category.slice(1)
                : "All products"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {visible.length} {visible.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <div className="flex items-center gap-2 lg:mb-4">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold lg:hidden">Filters</h2>
            <h2 className="hidden text-sm font-semibold lg:block">Filters</h2>
          </div>
          <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            <FilterLink
              href="/shop"
              active={!category && !filter}
              label="All"
            />
            {categories.map((c) => (
              <FilterLink
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                active={category === c.slug}
                label={c.name}
              />
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground lg:hidden">
              {visible.length} items
            </p>
            <label className="ml-auto text-sm">
              <span className="sr-only">Sort by</span>
              <SortSelect
                defaultValue={sort}
                category={category}
                filter={filter}
              />
            </label>
          </div>

          {visible.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters.
              </p>
              <Link
                href="/shop"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-foreground font-medium text-background"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}