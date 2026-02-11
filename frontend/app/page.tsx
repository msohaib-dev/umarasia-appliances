import Link from "next/link";
import { BadgeCheck, Bolt, CircleDollarSign, Cog } from "lucide-react";
import { CategoryCard } from "@/components/ui/category-card";
import { HeroCarousel } from "@/components/ui/hero-carousel";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionReveal } from "@/components/ui/section-reveal";
import { API_ROUTES } from "@/lib/api";
import { categories, getPopularProducts, heroSlides } from "@/lib/data";
import type { HeroSlide } from "@/types";

const trustPoints = [
  {
    title: "Cash on Delivery",
    icon: CircleDollarSign,
    detail: "Across Pakistan for practical buying confidence."
  },
  { title: "1 Year Warranty", icon: BadgeCheck, detail: "Reliable warranty support on core appliance lines." },
  { title: "Energy Efficient", icon: Bolt, detail: "Lower power draw optimized for load-shedding realities." },
  { title: "Original Copper Winding", icon: Cog, detail: "Engineering-grade motor and winding quality." }
];

const getHeroSlides = async (): Promise<HeroSlide[]> => {
  try {
    const response = await fetch(API_ROUTES.heroSlides, { cache: "no-store" });
    if (!response.ok) return heroSlides;
    const payload = await response.json();
    const data = Array.isArray(payload?.data) ? payload.data : [];
    if (!data.length) return heroSlides;

    return data.map((slide: HeroSlide, index: number) => ({
      id: Number(slide.id) || index + 1,
      title: String(slide.title || ""),
      subtitle: String(slide.subtitle || ""),
      image: String(slide.image || "")
    }));
  } catch (_error) {
    return heroSlides;
  }
};

export default async function HomePage() {
  const heroSlidesData = await getHeroSlides();
  const popularProducts = getPopularProducts(8);

  return (
    <>
      <section className="section-space">
        <div className="ui-container grid items-center gap-10 lg:grid-cols-12">
          <SectionReveal className="lg:col-span-5" delay={0.05}>
            <p className="eyebrow-label mb-3.5 font-semibold">DC Electronics Appliances</p>
            <h1 className="max-w-xl font-heading text-4xl font-bold tracking-[-0.03em] leading-tight text-slate-900 md:text-5xl">
              Practical Electrical Solutions You Can Trust in Pakistan
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600">
              UmarAsia-Appliances delivers engineering-grade DC fans, motors, pumps, and energy solutions built for
              homes, workshops, and businesses managing real power conditions every day.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">
                Shop Now
              </Link>
              <Link href="/shop" className="btn-secondary">
                Browse Catalog
              </Link>
            </div>
          </SectionReveal>

          <SectionReveal className="relative lg:col-span-7" delay={0.15}>
            <div className="pointer-events-none absolute -left-8 -top-8 h-44 w-44 rounded-full bg-brand-500/15 blur-3xl" />
            <HeroCarousel slides={heroSlidesData} />
          </SectionReveal>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="ui-container">
          <SectionReveal>
            <SectionHeading
              eyebrow="Product Segments"
              title="Shop by Category"
              description="Purpose-built categories designed for practical buying decisions and long-term performance requirements."
            />
          </SectionReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <SectionReveal key={category.slug} delay={Math.min(index * 0.05, 0.25)}>
                <CategoryCard category={category} />
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="ui-container">
          <SectionReveal>
            <SectionHeading
              eyebrow="Most Bought Products"
              title="Popular Right Now"
              description="High-demand products trusted by households, shops, and workshops across Pakistan."
            />
          </SectionReveal>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {popularProducts.map((product, index) => (
              <SectionReveal key={product.slug} delay={Math.min(index * 0.05, 0.2)}>
                <ProductCard product={product} />
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="ui-container">
          <SectionReveal>
            <SectionHeading
              eyebrow="Why UmarAsia-Appliances"
              title="Built for Reliability, Not Hype"
              description="Every product category is selected around performance, durability, and practical after-sales confidence."
            />
          </SectionReveal>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {trustPoints.map((point, index) => (
              <SectionReveal key={point.title} delay={Math.min(index * 0.05, 0.2)}>
                <article className="card-surface rounded-[20px] p-6 hover:-translate-y-1 hover:shadow-lift">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <point.icon size={21} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold tracking-[-0.01em] text-slate-900">{point.title}</h3>
                  <p className="mt-2.5 text-base leading-relaxed text-slate-600">{point.detail}</p>
                </article>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

