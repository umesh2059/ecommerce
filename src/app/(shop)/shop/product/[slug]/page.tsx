import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getProductBySlug,
  getRelatedProducts,
} from "@/constants/products";
import { ProductCard } from "@/components/cards/product-card";
import { ProductDetailInteractive } from "@/components/products/product-detail-interactive";
import { getCurrentUser } from "@/lib/auth";

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

  const user = await getCurrentUser();

  const checkoutUrl = `/checkout?product=${encodeURIComponent(product.slug)}`;

  // Guests are asked to log in or register before they can buy, then
  // redirected straight back here to continue checkout.
  const buyHref = user
    ? checkoutUrl
    : `/login?next=${encodeURIComponent(checkoutUrl)}`;

  const related = getRelatedProducts(product);

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

      <ProductDetailInteractive product={product} user={user} />

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