import { ProductCard } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionReveal } from "@/components/ui/section-reveal";
import type { Product } from "@/types";

type RelatedProductsProps = {
  products: Product[];
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products.length) return null;

  return (
    <section className="section-space border-t border-slate-200/80">
      <div className="ui-container">
        <SectionReveal>
          <SectionHeading
            eyebrow="Recommended"
            title="Related Products"
            description="Explore similar products frequently chosen with this model."
          />
        </SectionReveal>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product, index) => (
            <SectionReveal key={product.slug} delay={Math.min(index * 0.05, 0.2)}>
              <ProductCard product={product} />
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
