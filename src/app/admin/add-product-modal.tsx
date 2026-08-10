"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { ProductForm, type ProductFormValues } from "./product-form";

export function AddProductModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(values: ProductFormValues) {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Failed to create product");
      return false;
    }

    setIsOpen(false);
    router.refresh();
    return true;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
      >
        <Plus className="size-4" />
        Add Product
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
              Add New Product
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add details for the new product catalog item. Images are
              automatically processed by Cloudinary.
            </p>

            <ProductForm
              submitLabel="Create Product"
              onSubmit={handleSubmit}
              onCancel={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}