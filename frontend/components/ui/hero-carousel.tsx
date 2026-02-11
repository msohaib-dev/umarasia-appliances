"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { HeroSlide } from "@/types";

type HeroCarouselProps = {
  slides: HeroSlide[];
};

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative h-[420px] overflow-hidden rounded-[26px] border border-slate-200/90 bg-slate-100 shadow-[0_18px_42px_rgba(15,36,64,0.14)] md:h-[520px]"
    >
      <div className="pointer-events-none absolute -left-24 -top-28 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl" />
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[activeIndex].id}
          initial={{ opacity: 0.3, x: 18, scale: 1.02 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0.25, x: -12, scale: 1.01 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[activeIndex].image}
            alt={slides[activeIndex].title}
            fill
            className="object-cover transition duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-900/36 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-10">
            <p className="eyebrow-label mb-2 font-semibold text-white/80">Engineering-grade solutions</p>
            <h3 className="max-w-xl font-heading text-2xl font-bold tracking-[-0.02em] leading-tight md:text-4xl">{slides[activeIndex].title}</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">{slides[activeIndex].subtitle}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/88 px-3 py-2 backdrop-blur">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-2 rounded-full transition ${index === activeIndex ? "w-5 bg-brand-700" : "bg-slate-300"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
