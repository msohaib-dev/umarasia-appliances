import { Pagination } from "@/components/ui/pagination";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionReveal } from "@/components/ui/section-reveal";
import { ShopFilters } from "@/components/ui/shop-filters";
import { ShopToolbar } from "@/components/ui/shop-toolbar";
import { products } from "@/lib/data";

export default function ShopPage() {
  return (
    <section className="section-space">
      <div className="ui-container">
        <SectionReveal>
          <SectionHeading
            eyebrow="Shop"
            title="DC Electronics Product Catalog"
            description="Browse the complete UmarAsia-Appliances range with practical filters for category, price, and availability."
          />
        </SectionReveal>

        <div className="grid gap-7 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionReveal>
              <ShopFilters />
            </SectionReveal>
          </div>

          <div className="lg:col-span-9">
            <SectionReveal>
              <ShopToolbar productCount={products.length} />
            </SectionReveal>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product, index) => (
                <SectionReveal key={product.slug} delay={Math.min(index * 0.03, 0.2)}>
                  <ProductCard product={product} />
                </SectionReveal>
              ))}
            </div>

            <SectionReveal>
              <Pagination currentPage={1} totalPages={4} />
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

