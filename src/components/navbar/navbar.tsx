import Link from "next/link";
import { Heart, Menu, Search, ShoppingCart, User } from "lucide-react";

import { categories } from "@/constants/products";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";
import { getSession } from "@/lib/auth";
import { MobileMenu } from "./mobile-menu";

const mainNav = [
  { name: "New Arrivals", href: "/shop?filter=new" },
  ...categories.map((category) => ({
    name: category.name,
    href: `/shop?category=${category.slug}`,
  })),
  { name: "Sale", href: "/shop?filter=sale" },
];

export async function Navbar() {
  const user = await getSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <MobileMenu items={mainNav} />
          <Link href="/" className="text-lg font-semibold tracking-tight">
            myshoop
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="size-5" />
          </Button>

          {user ? (
            <>
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/"}
                className="hidden max-w-32 truncate rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:block"
              >
                {user.role === "ADMIN" ? "Admin" : user.name}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:block"
              >
                Sign up
              </Link>
              <Link href="/login" aria-label="Sign in">
                <Button variant="ghost" size="icon">
                  <User className="size-5" />
                </Button>
              </Link>
            </>
          )}

          <Button variant="ghost" size="icon" aria-label="Wishlist">
            <Heart className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingCart className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}