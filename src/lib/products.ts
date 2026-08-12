import type { Category } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { Product, ProductCategory, ProductSize } from "@/types";

const categoryLabels: Record<Category, ProductCategory> = {
  CLOTHING: "Clothing",
  FOOTWEAR: "Footwear",
  ACCESSORIES: "Accessories",
  HOME: "Home",
  BEAUTY: "Beauty",
};

const categoryByLabel: Record<ProductCategory, Category> = {
  Clothing: "CLOTHING",
  Footwear: "FOOTWEAR",
  Accessories: "ACCESSORIES",
  Home: "HOME",
  Beauty: "BEAUTY",
};

type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: Category;
  image: string;
  images: string[];
  sizes: ProductSize[];
  colors: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
};

function toProduct(product: ProductRecord): Product {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? undefined,
    category: categoryLabels[product.category],
    image: product.image,
    images: product.images,
    sizes: product.sizes,
    colors: product.colors,
    stock: product.stock,
    rating: product.rating,
    reviewCount: product.reviewCount,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
  };
}

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return products.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({ where: { slug } });
  return product ? toProduct(product) : null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(toProduct);
}

export async function getNewArrivals(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isNew: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(toProduct);
}

export async function getRelatedProducts(
  product: Product
): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      category: categoryByLabel[product.category],
      NOT: { id: product.id },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toProduct);
}
