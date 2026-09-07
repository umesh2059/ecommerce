import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { WishlistView } from "@/components/wishlist/wishlist-view";

export const metadata = {
  title: "Your wishlist",
};

export default async function WishlistPage() {
  const user = await getSession();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/wishlist")}`);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Your wishlist</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Products you have saved for later.
      </p>

      <WishlistView />
    </div>
  );
}
