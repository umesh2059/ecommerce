import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: "p-001",
    slug: "classic-white-oversized-tee",
    name: "Classic White Oversized Tee",
    description:
      "A timeless oversized cotton t-shirt with a relaxed fit, drop shoulders, and a soft hand feel. Perfect for layering or wearing on its own.",
    price: 2900, // stored in cents
    compareAtPrice: 3900,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["#ffffff", "#1e293b", "#7c3aed"],
    stock: 25,
    rating: 4.8,
    reviewCount: 214,
    isFeatured: true,
    isNew: false
  },
  {
    id: "p-002",
    slug: "minimalist-leather-sneakers",
    name: "Minimalist Leather Sneakers",
    description:
      "Clean white leather sneakers with a cushioned sole and premium stitching. A wardrobe staple that pairs with everything.",
    price: 12900,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["#fafaf9", "#1c1917"],
    stock: 12,
    rating: 4.6,
    reviewCount: 98,
    isFeatured: true,
    isNew: false
  },
  {
    id: "p-003",
    slug: "scandinavian-wool-beanie",
    name: "Scandinavian Wool Beanie",
    description:
      "Hand-finished wool beanie in a neutral palette. Warm, breathable, and made to last through the coldest months.",
    price: 4500,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["S", "M"],
    colors: ["#9f1239", "#1e293b", "#fafaf9"],
    stock: 40,
    rating: 4.9,
    reviewCount: 156,
    isFeatured: false,
    isNew: false
  },
  {
    id: "p-004",
    slug: "linen-relaxed-fit-shirt",
    name: "Linen Relaxed-Fit Shirt",
    description:
      "Breezy pure linen shirt with a relaxed cut and natural breathability. The perfect summer layer.",
    price: 8900,
    compareAtPrice: 11000,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1621072156002-e2fcc103e86e?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["S", "M", "L"],
    colors: ["#eff6ff", "#2563eb"],
    stock: 18,
    rating: 4.5,
    reviewCount: 73,
    isNew: true,
    isFeatured: false
  },
  {
    id: "p-005",
    slug: "ceramic-minimal-vase",
    name: "Ceramic Minimal Vase",
    description:
      "Hand-thrown ceramic vase with a matte finish. Each piece is unique and adds quiet character to any space.",
    price: 5900,
    category: "Home",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["S", "M"],
    colors: ["#fef3c7", "#f5f5f4", "#1c1917"],
    stock: 8,
    rating: 4.7,
    reviewCount: 41,
    isFeatured: true,
    isNew: false
  },
  {
    id: "p-006",
    slug: "silk-satin-scrunchie-set",
    name: "Silk Satin Scrunchie Set",
    description:
      "A set of four silk-touch satin scrunchies that are gentle on hair and full of polish.",
    price: 2400,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1628144547900-b6b553488f28?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1628144547900-b6b553488f28?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["M"],
    colors: ["#db2777", "#1e293b", "#0f172a"],
    stock: 60,
    rating: 4.4,
    reviewCount: 205,
    isNew: true,
    isFeatured: false
  },
  {
    id: "p-007",
    slug: "organic-denim-jacket",
    name: "Organic Denim Jacket",
    description:
      "Classic denim jacket cut from organic cotton denim with a medium wash and vintage-inspired hardware.",
    price: 14500,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["#312e81", "#1e1b4b"],
    stock: 10,
    rating: 4.3,
    reviewCount: 52,
    isFeatured: false,
    isNew: false
  },
  {
    id: "p-008",
    slug: "canvas-tote-bag",
    name: "Heavy-Weight Canvas Tote",
    description:
      "Structured canvas tote built to carry your everyday essentials. Reinforced handles and a roomy interior.",
    price: 3800,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["M", "L"],
    colors: ["#fafaf9", "#292524", "#78716c"],
    stock: 35,
    rating: 4.8,
    reviewCount: 189,
    isFeatured: true,
    isNew: false
  },
  {
    id: "p-009",
    slug: "wool-blend-overshirt",
    name: "Wool-Blend Overshirt",
    description:
      "A structured overshirt in a wool blend that transitions from office to weekend with ease.",
    price: 16500,
    compareAtPrice: 19900,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["#15803d", "#3f6212", "#1c1917"],
    stock: 7,
    rating: 4.6,
    reviewCount: 34,
    isNew: true,
    isFeatured: false
  },
  {
    id: "p-010",
    slug: "leather-card-wallet",
    name: "Full-Grain Leather Card Wallet",
    description:
      "Slim full-grain leather card wallet that holds up to six cards. Ages beautifully with time.",
    price: 5500,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588444839799-eaa434d879ad?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["S", "M"],
    colors: ["#7c2d12", "#1c1917"],
    stock: 22,
    rating: 4.7,
    reviewCount: 87,
    isFeatured: false,
    isNew: false
  },
  {
    id: "p-011",
    slug: "recycled-travel-backpack",
    name: "Recycled Travel Backpack",
    description:
      "Water-resistant backpack made from recycled materials with a padded laptop sleeve and expandable storage.",
    price: 9800,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["M", "L"],
    colors: ["#1e293b", "#3730a3", "#0f172a"],
    stock: 15,
    rating: 4.5,
    reviewCount: 62,
    isFeatured: false,
    isNew: false
  },
  {
    id: "p-012",
    slug: "scented-soy-candle",
    name: "Hand-Poured Soy Candle",
    description:
      "Small-batch soy candle with a 50-hour burn time. Notes of cedar, amber, and vanilla.",
    price: 3200,
    category: "Home",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602872030219-c189b67484d2?w=800&auto=format&fit=crop&q=80",
    ],
    sizes: ["S", "M"],
    colors: ["#fef3c7", "#fafaf9"],
    stock: 50,
    rating: 4.9,
    reviewCount: 312,
    isFeatured: true,
    isNew: false
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

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(priceInCents / 100);
}
