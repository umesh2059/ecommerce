import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { CartView } from "@/components/cart/cart-view";

export const metadata = {
  title: "Your cart",
};

export default async function CartPage() {
  const user = await getSession();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/cart")}`);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Review your items before checking out.
      </p>

      <CartView />
    </div>
  );
}
