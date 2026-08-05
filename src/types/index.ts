export type ProductSize = "XS" | "S" | "M" | "L" | "XL";

export type ProductCategory =
  | "Clothing"
  | "Footwear"
  | "Accessories"
  | "Home"
  | "Beauty";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: ProductCategory;
  image: string;
  images: string[];
  sizes: ProductSize[];
  colors: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: ProductSize;
}