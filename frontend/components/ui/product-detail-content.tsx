"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Star, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { QuantitySelector } from "./quantity-selector";
import { useCartStore } from "../../lib/store/cart-store";
import { useToastStore } from "../../lib/store/toast-store";
import { formatPKR } from "../../lib/utils";
import type { Product } from "../../types";

type ProductDetailContentProps = {
  product: Product;
};

type ProductTab = "description" | "specifications" | "shipping" | "warranty";

const tabs: { key: ProductTab; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "specifications", label: "Specifications" },
  { key: "shipping", label: "Shipping & Delivery" },
  { key: "warranty", label: "Warranty" }
];

const getStockMeta = (stock: number) => {
  if (stock <= 0) {
    return {
      label: "Out of Stock",
      className: "border border-rose-200 bg-rose-50 text-rose-700"
    };
  }

  if (stock <= 10) {
    return {
      label: `Low Stock (${stock} left)`,
      className: "border border-amber-200 bg-amber-50 text-amber-700"
    };
  }

  return {
    label: "In Stock",
    className: "border border-emerald-200 bg-emerald-50 text-emerald-700"
  };
};

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const pushToast = useToastStore((state) => state.pushToast);

  const [activeTab, setActiveTab] = useState<ProductTab>("description");
  const [quantity, setQuantity] = useState(1);

  const discountPercentage = useMemo(() => {
    if (!product.oldPrice || product.oldPrice <= product.price) return null;
    return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  }, [product.oldPrice, product.price]);

  const stockMeta = getStockMeta(product.stock);
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating - fullStars >= 0.5;

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      pushToast("This product is currently out of stock.", "error");
      return;
    }

    addToCart(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        images: product.images,
        stock: product.stock
      },
      quantity
    );
    pushToast("Product added to cart.", "success");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold tracking-[-0.02em] text-slate-900 md:text-4xl">{product.name}</h1>

      <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const isFull = index < fullStars;
            const isHalf = index === fullStars && hasHalfStar;
            return (
              <Star
                key={index}
                size={16}
                strokeWidth={1.5}
                className={isFull || isHalf ? "text-amber-500" : "text-slate-300"}
                fill={isFull ? "currentColor" : isHalf ? "rgba(245,158,11,0.45)" : "transparent"}
              />
            );
          })}
        </div>
        <span className="font-medium text-slate-700">{product.rating.toFixed(1)}</span>
        <span>({product.reviewCount} reviews)</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-3xl font-semibold text-slate-900">{formatPKR(product.price)}</span>
        {product.oldPrice ? <span className="text-base text-slate-400 line-through">{formatPKR(product.oldPrice)}</span> : null}
        {discountPercentage ? (
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">-{discountPercentage}%</span>
        ) : null}
      </div>

      <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${stockMeta.className}`}>
        {stockMeta.label}
      </span>

      <div className="mt-7 rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,36,64,0.06)]">
        <div className="flex flex-wrap items-center gap-3">
          <QuantitySelector value={quantity} onChange={setQuantity} max={Math.max(product.stock, 1)} />
          <button type="button" onClick={handleAddToCart} className="btn-primary flex-1 min-w-[180px]">
            Add to Cart
          </button>
          <button type="button" onClick={handleBuyNow} className="btn-secondary flex-1 min-w-[180px]">
            Buy Now
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <p>Estimated delivery: {product.shippingDelivery}</p>
          <p className="mt-1 font-medium text-brand-700">Cash on Delivery available</p>
        </div>

        <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
          <div className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={15} strokeWidth={1.5} className="text-brand-700" /> Cash on Delivery
          </div>
          <div className="inline-flex items-center gap-1.5">
            <ShieldCheck size={15} strokeWidth={1.5} className="text-brand-700" /> 1 Year Warranty
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Truck size={15} strokeWidth={1.5} className="text-brand-700" /> Nationwide Shipping
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,36,64,0.06)]">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === tab.key ? "bg-brand-500 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="pt-4"
          >
            {activeTab === "description" ? <p className="text-base leading-relaxed text-slate-600">{product.description}</p> : null}

            {activeTab === "specifications" && product.specifications.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <ul className="divide-y divide-slate-200">
                  {product.specifications.map((spec) => (
                    <li key={spec.label} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span className="text-slate-500">{spec.label}</span>
                      <span className="font-medium text-slate-800">{spec.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {activeTab === "shipping" ? <p className="text-base leading-relaxed text-slate-600">{product.shippingDelivery}</p> : null}

            {activeTab === "warranty" ? <p className="text-base leading-relaxed text-slate-600">{product.warranty}</p> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {product.features.length > 0 ? (
        <div className="mt-8 rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,36,64,0.06)]">
          <h2 className="font-heading text-xl font-semibold tracking-[-0.01em] text-slate-900">Key Features</h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {product.features.map((feature) => (
              <li key={feature} className="inline-flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle2 size={16} strokeWidth={1.5} className="mt-0.5 text-brand-700" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
