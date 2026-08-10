"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  name: string;
  href: string;
};

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden shrink-0 hover:bg-muted/80 rounded-xl"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex w-full max-w-xs flex-col bg-background p-6 shadow-2xl animate-in slide-in-from-left duration-300 ease-out border-r border-border">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold tracking-tight"
              >
                myshoop
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                >
                  {item.name}
                  <ArrowRight className="size-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
