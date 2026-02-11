import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../components/ui/breadcrumbs";
import { ProductDetailContent } from "../../../components/ui/product-detail-content";
import { ProductGallery } from "../../../components/ui/product-gallery";
import { RelatedProducts } from "../../../components/ui/related-products";
import { SectionReveal } from "../../../components/ui/section-reveal";
import { getProductBySlug, products as fallbackProducts } from "../../../lib/data";
import { getStorefrontProducts as fetchStorefrontProducts } from "../../../lib/server/storefront";
import type { Product } from "../../../types";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

const loadStorefrontProducts = async (): Promise<Product[]> => {
  try {
    return await fetchStorefrontProducts();
  } catch (_error) {
    return fallbackProducts;
  }
};

export default async function ProductPage({ params }: ProductPageProps) {
  const products = await loadStorefrontProducts();
  const product = products.find((item) => item.slug === params.slug) ?? getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const sameCategory = products.filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug);
  const fallback = products.filter((item) => item.slug !== product.slug && item.categorySlug !== product.categorySlug);
  const relatedProducts = [...sameCategory, ...fallback].slice(0, 4);

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
