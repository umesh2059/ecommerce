import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: "p-001",
    slug: "classic-white-oversized-tee",
    name: "Classic White Oversized Tee",
    description:
      "A timeless oversized cotton t-shirt with a relaxed fit, drop shoulders, and a soft hand feel. Perfect for layering or wearing on its own.",
    price: 29,
    compareAtPrice: 39,
    category: "Clothing",
    image: "linear-gradient(135deg,#f8fafc 0%,#cbd5e1 100%)",
    images: [
      "linear-gradient(135deg,#f8fafc 0%,#cbd5e1 100%)",
      "linear-gradient(135deg,#e2e8f0 0%,#94a3b8 100%)",
      "linear-gradient(135deg,#f1f5f9 0%,#b6c2d1 100%)",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#ffffff", "#1e293b", "#7c3aed"],
    stock: 25,
    rating: 4.8,
    reviewCount: 214,
    isFeatured: true,
  },
  {
    id: "p-002",
    slug: "minimalist-leather-sneakers",
    name: "Minimalist Leather Sneakers",
    description:
      "Clean white leather sneakers with a cushioned sole and premium stitching. A wardrobe staple that pairs with everything.",
    price: 129,
    category: "Footwear",
    image: "linear-gradient(135deg,#e7e5e4 0%,#78716c 100%)",
    images: [
      "linear-gradient(135deg,#e7e5e4 0%,#78716c 100%)",
      "linear-gradient(135deg,#d6d3d1 0%,#a8a29e 100%)",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["#fafaf9", "#1c1917"],
    stock: 12,
    rating: 4.6,
    reviewCount: 98,
    isFeatured: true,
  },
  {
    id: "p-003",
    slug: "scandinavian-wool-beanie",
    name: "Scandinavian Wool Beanie",
    description:
      "Hand-finished wool beanie in a neutral palette. Warm, breathable, and made to last through the coldest months.",
    price: 45,
    category: "Accessories",
    image: "linear-gradient(135deg,#fecdd3 0%,#9f1239 100%)",
    images: [
      "linear-gradient(135deg,#fecdd3 0%,#9f1239 100%)",
      "linear-gradient(135deg,#fda4af 0%,#be123c 100%)",
    ],
    sizes: ["S", "M"],
    colors: ["#9f1239", "#1e293b", "#fafaf9"],
    stock: 40,
    rating: 4.9,
    reviewCount: 156,
  },
  {
    id: "p-004",
    slug: "linen-relaxed-fit-shirt",
    name: "Linen Relaxed-Fit Shirt",
    description:
      "Breezy pure linen shirt with a relaxed cut and natural breathability. The perfect summer layer.",
    price: 89,
    compareAtPrice: 110,
    category: "Clothing",
    image: "linear-gradient(135deg,#dbeafe 0%,#2563eb 100%)",
    images: [
      "linear-gradient(135deg,#dbeafe 0%,#2563eb 100%)",
      "linear-gradient(135deg,#bfdbfe 0%,#1d4ed8 100%)",
    ],
    sizes: ["S", "M", "L"],
    colors: ["#eff6ff", "#2563eb"],
    stock: 18,
    rating: 4.5,
    reviewCount: 73,
    isNew: true,
  },
  {
    id: "p-005",
    slug: "ceramic-minimal-vase",
    name: "Ceramic Minimal Vase",
    description:
      "Hand-thrown ceramic vase with a matte finish. Each piece is unique and adds quiet character to any space.",
    price: 59,
    category: "Home",
    image: "linear-gradient(135deg,#fef3c7 0%,#b45309 100%)",
    images: [
      "linear-gradient(135deg,#fef3c7 0%,#b45309 100%)",
      "linear-gradient(135deg,#fde68a 0%,#92400e 100%)",
    ],
    sizes: ["S", "M"],
    colors: ["#fef3c7", "#f5f5f4", "#1c1917"],
    stock: 8,
    rating: 4.7,
    reviewCount: 41,
    isFeatured: true,
  },
  {
    id: "p-006",
    slug: "silk-satin-scrunchie-set",
    name: "Silk Satin Scrunchie Set",
    description:
      "A set of four silk-touch satin scrunchies that are gentle on hair and full of polish.",
    price: 24,
    category: "Beauty",
    image: "linear-gradient(135deg,#fce7f3 0%,#db2777 100%)",
    images: [
      "linear-gradient(135deg,#fce7f3 0%,#db2777 100%)",
      "linear-gradient(135deg,#fbcfe8 0%,#be185d 100%)",
    ],
    sizes: ["M"],
    colors: ["#db2777", "#1e293b", "#0f172a"],
    stock: 60,
    rating: 4.4,
    reviewCount: 205,
    isNew: true,
  },
  {
    id: "p-007",
    slug: "organic-denim-jacket",
    name: "Organic Denim Jacket",
    description:
      "Classic denim jacket cut from organic cotton denim with a medium wash and vintage-inspired hardware.",
    price: 145,
    category: "Clothing",
    image: "linear-gradient(135deg,#a5b4fc 0%,#312e81 100%)",
    images: [
      "linear-gradient(135deg,#a5b4fc 0%,#312e81 100%)",
      "linear-gradient(135deg,#818cf8 0%,#1e1b4b 100%)",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["#312e81", "#1e1b4b"],
    stock: 10,
    rating: 4.3,
    reviewCount: 52,
  },
  {
    id: "p-008",
    slug: "canvas-tote-bag",
    name: "Heavy-Weight Canvas Tote",
    description:
      "Structured canvas tote built to carry your everyday essentials. Reinforced handles and a roomy interior.",
    price: 38,
    category: "Accessories",
    image: "linear-gradient(135deg,#e7e5e4 0%,#57534e 100%)",
    images: [
      "linear-gradient(135deg,#e7e5e4 0%,#57534e 100%)",
      "linear-gradient(135deg,#d6d3d1 0%,#44403c 100%)",
    ],
    sizes: ["M", "L"],
    colors: ["#fafaf9", "#292524", "#78716c"],
    stock: 35,
    rating: 4.8,
    reviewCount: 189,
    isFeatured: true,
  },
  {
    id: "p-009",
    slug: "wool-blend-overshirt",
    name: "Wool-Blend Overshirt",
    description:
      "A structured overshirt in a wool blend that transitions from office to weekend with ease.",
    price: 165,
    compareAtPrice: 199,
    category: "Clothing",
    image: "linear-gradient(135deg,#bbf7d0 0%,#15803d 100%)",
    images: [
      "linear-gradient(135deg,#bbf7d0 0%,#15803d 100%)",
      "linear-gradient(135deg,#86efac 0%,#166534 100%)",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["#15803d", "#3f6212", "#1c1917"],
    stock: 7,
    rating: 4.6,
    reviewCount: 34,
    isNew: true,
  },
  {
    id: "p-010",
    slug: "leather-card-wallet",
    name: "Full-Grain Leather Card Wallet",
    description:
      "Slim full-grain leather card wallet that holds up to six cards. Ages beautifully with time.",
    price: 55,
    category: "Accessories",
    image: "linear-gradient(135deg,#fed7aa 0%,#9a3412 100%)",
    images: [
      "linear-gradient(135deg,#fed7aa 0%,#9a3412 100%)",
      "linear-gradient(135deg,#fdba74 0%,#7c2d12 100%)",
    ],
    sizes: ["S", "M"],
    colors: ["#7c2d12", "#1c1917"],
    stock: 22,
    rating: 4.7,
    reviewCount: 87,
  },
  {
    id: "p-011",
    slug: "recycled-travel-backpack",
    name: "Recycled Travel Backpack",
    description:
      "Water-resistant backpack made from recycled materials with a padded laptop sleeve and expandable storage.",
    price: 98,
    category: "Accessories",
    image: "linear-gradient(135deg,#c7d2fe 0%,#4338ca 100%)",
    images: [
      "linear-gradient(135deg,#c7d2fe 0%,#4338ca 100%)",
      "linear-gradient(135deg,#a5b4fc 0%,#3730a3 100%)",
    ],
    sizes: ["M", "L"],
    colors: ["#1e293b", "#3730a3", "#0f172a"],
    stock: 15,
    rating: 4.5,
    reviewCount: 62,
  },
  {
    id: "p-012",
    slug: "scented-soy-candle",
    name: "Hand-Poured Soy Candle",
    description:
      "Small-batch soy candle with a 50-hour burn time. Notes of cedar, amber, and vanilla.",
    price: 32,
    category: "Home",
    image: "linear-gradient(135deg,#fde68a 0%,#ca8a04 100%)",
    images: [
      "linear-gradient(135deg,#fde68a 0%,#ca8a04 100%)",
      "linear-gradient(135deg,#fcd34d 0%,#a16207 100%)",
    ],
    sizes: ["S", "M"],
    colors: ["#fef3c7", "#fafaf9"],
    stock: 50,
    rating: 4.9,
    reviewCount: 312,
    isFeatured: true,
  },
];

export const categories: {
  name: string;
  slug: string;
  image: string;
}[] = [
  {
    name: "Clothing",
    slug: "clothing",
    image: "linear-gradient(135deg,#f1f5f9 0%,#64748b 100%)",
  },
  {
    name: "Footwear",
    slug: "footwear",
    image: "linear-gradient(135deg,#e7e5e4 0%,#57534e 100%)",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "linear-gradient(135deg,#fbcfe8 0%,#9d174d 100%)",
  },
  {
    name: "Home",
    slug: "home",
    image: "linear-gradient(135deg,#fef3c7 0%,#92400e 100%)",
  },
  {
    name: "Beauty",
    slug: "beauty",
    image: "linear-gradient(135deg,#cffafe 0%,#0e7490 100%)",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.isFeatured);
}

export function getNewArrivals(): Product[] {
  return products.filter((product) => product.isNew);
}

export function getRelatedProducts(product: Product): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
