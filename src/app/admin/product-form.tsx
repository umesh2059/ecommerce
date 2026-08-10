"use client";

import { useState } from "react";
import { X, Upload, Loader2, Plus } from "lucide-react";

export type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
};

export type ProductFormInitial = {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
};

export function ProductForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: ProductFormInitial;
  submitLabel: string;
  onSubmit: (values: ProductFormValues) => Promise<boolean>;
  onCancel: () => void;
}) {
  // Form states
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priceUsd, setPriceUsd] = useState(
    initial ? (initial.price / 100).toFixed(2) : ""
  );
  const [compareAtPriceUsd, setCompareAtPriceUsd] = useState(
    initial?.compareAtPrice != null
      ? (initial.compareAtPrice / 100).toFixed(2)
      : ""
  );
  const [category, setCategory] = useState(initial?.category ?? "CLOTHING");
  const [stock, setStock] = useState(initial ? String(initial.stock) : "10");
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [isNew, setIsNew] = useState(initial?.isNew ?? true);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initial?.sizes ?? []
  );
  const [colors, setColors] = useState<string[]>(initial?.colors ?? []);
  const [colorInput, setColorInput] = useState("");

  // Image states
  const [imageUrl, setImageUrl] = useState(initial?.image ?? "");
  const [additionalImages, setAdditionalImages] = useState<string[]>(
    initial ? initial.images.slice(1) : []
  );

  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Automatically generate slug from name
  function handleNameChange(val: string) {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  }

  // Handle image upload
  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    isMain: boolean
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      if (isMain) {
        setImageUrl(data.url);
      } else {
        setAdditionalImages((prev) => [...prev, data.url]);
      }
    } catch (err) {
      alert("Error uploading image");
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  // Handle color tags
  function addColor() {
    if (!colorInput || colors.includes(colorInput)) return;
    setColors((prev) => [...prev, colorInput]);
    setColorInput("");
  }

  function removeColor(c: string) {
    setColors((prev) => prev.filter((item) => item !== c));
  }

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please upload a main product image first.");
      return;
    }

    setPending(true);

    try {
      const priceCents = Math.round(parseFloat(priceUsd) * 100);
      const comparePriceCents = compareAtPriceUsd
        ? Math.round(parseFloat(compareAtPriceUsd) * 100)
        : null;

      await onSubmit({
        name,
        slug,
        description,
        price: priceCents,
        compareAtPrice: comparePriceCents,
        category,
        image: imageUrl,
        images: [imageUrl, ...additionalImages],
        sizes: selectedSizes,
        colors: colors.length > 0 ? colors : ["#000000"],
        stock: parseInt(stock) || 0,
        isFeatured,
        isNew,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Minimalist Cotton Tee"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Slug
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. minimalist-cotton-tee"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Description
        </label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell a story about this premium product..."
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none resize-none"
        />
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Price (USD)
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={priceUsd}
            onChange={(e) => setPriceUsd(e.target.value)}
            placeholder="29.99"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Compare Price
          </label>
          <input
            type="number"
            step="0.01"
            value={compareAtPriceUsd}
            onChange={(e) => setCompareAtPriceUsd(e.target.value)}
            placeholder="39.99"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
          >
            <option value="CLOTHING">Clothing</option>
            <option value="FOOTWEAR">Footwear</option>
            <option value="ACCESSORIES">Accessories</option>
            <option value="HOME">Home</option>
            <option value="BEAUTY">Beauty</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Stock
          </label>
          <input
            type="number"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="10"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* Sizes Selection */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
          Available Sizes
        </label>
        <div className="flex flex-wrap gap-2">
          {["XS", "S", "M", "L", "XL"].map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => toggleSize(size)}
              className={`h-9 w-12 rounded-lg border text-sm font-semibold transition-colors duration-200 ${
                selectedSizes.includes(size)
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground text-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Tags */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
          Color Options (Hex Code)
        </label>
        <div className="flex items-center gap-2 mt-1.5">
          <input
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            placeholder="e.g. #7c3aed or #ffffff"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none max-w-[200px]"
          />
          <button
            type="button"
            onClick={addColor}
            className="rounded-lg bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
          >
            Add Color
          </button>
        </div>
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {colors.map((c) => (
              <span
                key={c}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium bg-muted"
              >
                <span
                  className="size-2 rounded-full border border-black/10"
                  style={{ backgroundColor: c }}
                />
                {c}
                <button
                  type="button"
                  onClick={() => removeColor(c)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image upload area */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
            Main Product Image
          </label>
          {imageUrl ? (
            <div className="group relative aspect-square w-full max-w-[200px] overflow-hidden rounded-xl border border-border">
              <img
                src={imageUrl}
                alt="Uploaded preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <label className="flex aspect-square w-full max-w-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border hover:border-foreground transition-colors duration-200">
              {uploading ? (
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="size-6 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Upload image
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                className="hidden"
                onChange={(e) => handleImageUpload(e, true)}
              />
            </label>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
            Additional Gallery Images
          </label>
          <div className="grid grid-cols-2 gap-2 max-w-[200px]">
            {additionalImages.map((img, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border"
              >
                <img
                  src={img}
                  alt="Gallery preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setAdditionalImages((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            {additionalImages.length < 3 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border hover:border-foreground transition-colors duration-200">
                {uploading ? (
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                ) : (
                  <Plus className="size-5 text-muted-foreground" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, false)}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Status toggles */}
      <div className="flex gap-6 border-t border-border pt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="rounded border-border focus:ring-foreground size-4"
          />
          <span className="text-sm font-medium">Featured product</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
            className="rounded border-border focus:ring-foreground size-4"
          />
          <span className="text-sm font-medium">New arrival badge</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending || uploading}
          className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}