"use client";

import { useRouter } from "next/navigation";

export function SortSelect({
  defaultValue,
  category,
  filter,
}: {
  defaultValue: string;
  category?: string;
  filter?: string;
}) {
  const router = useRouter();

  return (
    <select
      className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      defaultValue={defaultValue}
      onChange={(event) => {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (filter) params.set("filter", filter);
        if (event.target.value) params.set("sort", event.target.value);
        router.push(`/shop${params.size ? `?${params}` : ""}`);
      }}
    >
      <option value="">Sort by: Featured</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating">Top Rated</option>
    </select>
  );
}