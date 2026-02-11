import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductDetailContent } from "@/components/ui/product-detail-content";
import { ProductGallery } from "@/components/ui/product-gallery";
import { RelatedProducts } from "@/components/ui/related-products";
import { SectionReveal } from "@/components/ui/section-reveal";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);

  return (
    <>
      <section className="section-space">
        <div className="ui-container">
          <SectionReveal>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: product.name }
              ]}
            />
          </SectionReveal>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionReveal>
                <ProductGallery images={product.images} alt={product.name} />
              </SectionReveal>
            </div>

            <div className="lg:col-span-6">
              <SectionReveal>
                <ProductDetailContent product={product} />
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts products={relatedProducts} />
    </>
  );
}
