"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../../lib/store/cart-store";
import { useToastStore } from "../../lib/store/toast-store";
import { formatPKR } from "../../lib/utils";
import type { Product } from "../../types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const pushToast = useToastStore((state) => state.pushToast);

  const stockMeta =
    product.stock <= 0
      ? { label: "Out of Stock", className: "border border-rose-200 bg-rose-50 text-rose-700" }
      : product.stock <= 10
        ? { label: `Low Stock (${product.stock})`, className: "border border-amber-200 bg-amber-50 text-amber-700" }
        : { label: "In Stock", className: "border border-emerald-200 bg-emerald-50 text-emerald-700" };

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
      1
    );
    pushToast("Product added to cart.", "success");
  };

  return (
    <article className="card-surface group overflow-hidden rounded-[20px] hover:-translate-y-1 hover:shadow-lift">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative h-56 overflow-hidden bg-slate-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-auto absolute inset-0" onContextMenu={(event) => event.preventDefault()} />
          <div className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/35 px-2 py-1 text-[10px] font-medium text-white/90">
            UmarAsia-Appliances
          </div>
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <h3 className="line-clamp-2 min-h-[3.2rem] font-heading text-[1.03rem] font-bold tracking-[-0.01em] text-slate-900">
          {product.name}
        </h3>
        <div className="flex items-end gap-2">
          <span className="text-xl font-semibold text-slate-900">{formatPKR(product.price)}</span>
          {product.oldPrice ? (
            <span className="pb-0.5 text-xs text-slate-500/50 line-through">{formatPKR(product.oldPrice)}</span>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${stockMeta.className}`}>{stockMeta.label}</span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-brand-700"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

