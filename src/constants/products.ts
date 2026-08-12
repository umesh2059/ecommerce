export const categories: {
  name: string;
  slug: string;
  image: string;
}[] = [
  {
    name: "Clothing",
    slug: "clothing",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Footwear",
    slug: "footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Home",
    slug: "home",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Beauty",
    slug: "beauty",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&auto=format&fit=crop&q=80",
  },
];

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(priceInCents / 100);
}
