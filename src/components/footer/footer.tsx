"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

const linkGroups = [
  {
    title: "Shop",
    links: [
      { name: "New Arrivals", href: "/shop?filter=new" },
      { name: "Sale", href: "/shop?filter=sale" },
      { name: "Gift Cards", href: "/gift-cards" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "#" },
      { name: "Shipping & Returns", href: "#" },
      { name: "Order Tracking", href: "#" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Sustainability", href: "#" },
      { name: "Stores", href: "#" },
    ],
  },
];

const socials = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              myshoop
            </Link>
            <p className="mt-2 max-w-xs text-sm text-background/60">
              Considered goods for everyday living.
            </p>
            <div className="mt-4 flex items-center gap-2">
              {socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="flex size-8 items-center justify-center rounded-full border border-background/15 text-background/70 transition-colors hover:border-background/40 hover:text-background"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/60 transition-colors hover:text-background"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-background/10 pt-6 text-sm text-background/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} myshoop. All rights reserved.</p>
          <div className="flex items-center gap-x-5">
            <Link href="#" className="transition-colors hover:text-background">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-background">
              Terms
            </Link>
            <Link href="#" className="transition-colors hover:text-background">
              Cookies
            </Link>
            <Link
              href="mailto:hello@myshoop.com"
              className="flex items-center gap-1 transition-colors hover:text-background"
            >
              <Mail className="size-4" />
              hello@myshoop.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}