import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { DeleteProductButton } from "./delete-product-button";
import { AddProductModal } from "./add-product-modal";
import { EditProductModal } from "./edit-product-modal";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getSession();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const users = await prisma.user.count();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as {user.name}. Manage your catalog.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AddProductModal />
          <Link
            href="/api/products"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            API reference
          </Link>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Products" value={products.length.toString()} />
        <StatCard label="Registered users" value={users.toString()} />
        <StatCard
          label="Low stock (10 or fewer)"
          value={products.filter((p) => p.stock <= 10).length.toString()}
        />
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Product catalog
          </h2>
          <span className="text-sm text-muted-foreground">
            Admin-only CRUD
          </span>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price (cents)</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.price}
                  </td>
                  <td
                    className={
                      product.stock <= 10
                        ? "px-4 py-3 font-medium text-red-600"
                        : "px-4 py-3 text-muted-foreground"
                    }
                  >
                    {product.stock}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.slug}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <EditProductModal product={product} />
                      <DeleteProductButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No products yet. Create one with{" "}
                    <code className="rounded bg-muted px-1 py-0.5">
                      POST /api/products
                    </code>
                    .
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-8 text-xs text-muted-foreground">
        Create/update operations are available through{" "}
        <code className="rounded bg-muted px-1 py-0.5">
          POST /api/products
        </code>{" "}
        and{" "}
        <code className="rounded bg-muted px-1 py-0.5">
          PUT /api/products/:id
        </code>
        . All mutations require an authenticated admin account.
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}