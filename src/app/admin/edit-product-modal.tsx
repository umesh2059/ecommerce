"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, X } from "lucide-react";
import {
  ProductForm,
  type ProductFormInitial,
  type ProductFormValues,
} from "./product-form";

export function EditProductModal({
  product,
}: {
  product: ProductFormInitial & { id: string };
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(values: ProductFormValues) {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Failed to update product");
      return false;
    }

    setIsOpen(false);
    router.refresh();
    return true;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md border border-border px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Pencil className="size-3.5 inline-block mr-1 -mt-0.5" />
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Edit Product
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Update the details for{" "}
              <span className="font-medium text-foreground">{product.name}</span>
              .
            </p>

            <ProductForm
              initial={{
                name: product.name,
                slug: product.slug,
                description: product.description,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                category: product.category,
                image: product.image,
                images: product.images,
                sizes: product.sizes,
                colors: product.colors,
                stock: product.stock,
                isFeatured: product.isFeatured,
                isNew: product.isNew,
              }}
              submitLabel="Save Changes"
              onSubmit={handleSubmit}
              onCancel={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}