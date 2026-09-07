"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { heroSlides, type HeroSlide } from "@/constants/hero-slides";

const AUTOPLAY_MS = 5000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((next: number) => {
    setIndex(((next % heroSlides.length) + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        className="relative min-h-[420px] overflow-hidden rounded-3xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {heroSlides.map((slide) => (
            <Slide key={slide.id} slide={slide} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25 sm:left-5"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25 sm:right-5"
        >
          <ChevronRight className="size-5" />
        </button>

        <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-2">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Slide({ slide }: { slide: HeroSlide }) {
  return (
    <div className="relative min-h-[420px] w-full shrink-0 basis-full">
      <img
        src={slide.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: slide.gradient }} />
      <div className="relative flex min-h-[420px] flex-col items-center justify-center gap-5 px-6 py-16 text-center sm:px-12 sm:py-24 lg:px-16">
        <span className="rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur">
          {slide.eyebrow}
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
          {slide.heading}
        </h1>
        <p className="max-w-xl text-base text-white/85 sm:text-lg">
          {slide.subheading}
        </p>
        <Button render={<Link href={slide.ctaHref} />} size="lg">
          {slide.ctaLabel}
        </Button>
      </div>
    </div>
  );
}
