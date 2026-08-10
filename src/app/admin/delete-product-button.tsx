"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Delete this product? This cannot be undone.")) {
      return;
    }

    setPending(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        window.alert(data.message || "Failed to delete product");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Failed to delete product");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="rounded-md border border-red-400/40 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}