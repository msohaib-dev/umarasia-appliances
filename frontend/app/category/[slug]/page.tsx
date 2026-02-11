import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductCard } from "@/components/ui/product-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/data";

type CategoryPageProps = {
  params: {
    slug: string;
  };
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = getProductsByCategory(category.slug);

  return (
    <section className="section-space">
      <div className="ui-container">
        <SectionReveal>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: category.title }
            ]}
          />

          <h1 className="font-heading text-3xl font-extrabold text-slate-900 md:text-4xl">{category.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">{category.description}</p>
        </SectionReveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {categoryProducts.map((product, index) => (
            <SectionReveal key={product.slug} delay={Math.min(index * 0.05, 0.2)}>
              <ProductCard product={product} />
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
