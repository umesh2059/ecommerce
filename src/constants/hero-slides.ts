export type HeroSlide = {
  id: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  gradient: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "festive-sale",
    eyebrow: "Festive Season Sale",
    heading: "Celebrate in style — up to 50% off",
    subheading:
      "Light up the festival season with curated picks across clothing, footwear, and home.",
    ctaLabel: "Shop the sale",
    ctaHref: "/shop?filter=sale",
    image:
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1600&auto=format&fit=crop&q=80",
    gradient:
      "linear-gradient(120deg, rgba(120,53,15,0.85) 0%, rgba(146,64,14,0.55) 55%, rgba(217,119,6,0.25) 100%)",
  },
  {
    id: "new-arrivals",
    eyebrow: "Just landed",
    heading: "New arrivals for the new season",
    subheading: "Fresh drops across every category, restocked weekly.",
    ctaLabel: "Explore new arrivals",
    ctaHref: "/shop?filter=new",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80",
    gradient:
      "linear-gradient(120deg, rgba(30,41,59,0.9) 0%, rgba(71,85,105,0.5) 55%, rgba(148,163,184,0.3) 100%)",
  },
  {
    id: "footwear-festival",
    eyebrow: "Limited time",
    heading: "Step into the season",
    subheading: "Footwear favorites, now with festival pricing.",
    ctaLabel: "Shop footwear",
    ctaHref: "/shop?category=footwear",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&auto=format&fit=crop&q=80",
    gradient:
      "linear-gradient(120deg, rgba(15,23,42,0.9) 0%, rgba(30,64,175,0.45) 55%, rgba(96,165,250,0.25) 100%)",
  },
  {
    id: "free-shipping",
    eyebrow: "Everyday value",
    heading: "Free shipping on orders over ₹75",
    subheading: "Plus easy 30-day returns on everything, all year round.",
    ctaLabel: "Start shopping",
    ctaHref: "/shop",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80",
    gradient:
      "linear-gradient(120deg, rgba(20,83,45,0.85) 0%, rgba(21,128,61,0.5) 55%, rgba(74,222,128,0.25) 100%)",
  },
];
