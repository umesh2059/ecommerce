import Link from "next/link";

const shopLinks = [
  { name: "New Arrivals", href: "/shop?filter=new" },
  { name: "Sale", href: "/shop?filter=sale" },
  { name: "Gift Cards", href: "/gift-cards" },
];

const categoryLinks = [
  { name: "Clothing", href: "/shop?category=clothing" },
  { name: "Footwear", href: "/shop?category=footwear" },
  { name: "Accessories", href: "/shop?category=accessories" },
  { name: "Home", href: "/shop?category=home" },
  { name: "Beauty", href: "/shop?category=beauty" },
];

const supportLinks = [
  { name: "Help Center", href: "#" },
  { name: "Shipping & Returns", href: "#" },
  { name: "Order Tracking", href: "#" },
  { name: "Contact Us", href: "/contact" },
];

const aboutLinks = [
  { name: "About Us", href: "/about" },
  { name: "Sustainability", href: "#" },
  { name: "Careers", href: "#" },
  { name: "Stores", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              myshoop
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Considered goods for everyday living. Thoughtfully sourced,
              honestly priced, built to last.
            </p>
          </div>

          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Categories" links={categoryLinks} />
          <FooterColumn title="Support" links={supportLinks} />
          <FooterColumn title="Company" links={aboutLinks} />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} myshoop. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}