"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useCartStore } from "@/lib/store/cart-store";
import { useToastStore } from "@/lib/store/toast-store";
import { formatPKR } from "@/lib/utils";

export default function CartPage() {
  const cartItems = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const pushToast = useToastStore((state) => state.pushToast);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 350 : 0;
  const total = subtotal + shipping;

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    pushToast("Product removed from cart.", "success");
  };

  return (
    <section className="section-space">
      <div className="ui-container">
        <SectionReveal>
          <SectionHeading
            eyebrow="Cart"
            title="Review Your Selected Products"
            description="Adjust quantities, remove items, and proceed to checkout when ready."
          />
        </SectionReveal>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            {cartItems.length === 0 ? (
              <SectionReveal>
                <article className="card-surface rounded-[20px] p-8 text-center">
                  <h3 className="font-heading text-xl font-semibold text-slate-900">Your cart is empty</h3>
                  <p className="mt-2 text-sm text-slate-600">Browse products and add items to continue.</p>
                  <Link href="/shop" className="btn-primary mt-5">
                    Go to Shop
                  </Link>
                </article>
              </SectionReveal>
            ) : null}

            {cartItems.map((item) => (
              <SectionReveal key={item.product.id}>
                <article className="card-surface flex flex-col gap-4 rounded-[20px] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading text-base font-bold tracking-[-0.01em] text-slate-900">{item.product.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">Unit Price: {formatPKR(item.product.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="inline-flex items-center rounded-xl border border-slate-300 bg-white p-1">
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-700"
                        type="button"
                        onClick={() => decreaseQuantity(item.product.id)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} strokeWidth={1.5} />
                      </button>
                      <span className="px-3 text-sm font-semibold text-slate-800">{item.quantity}</span>
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 hover:text-brand-700"
                        type="button"
                        onClick={() => increaseQuantity(item.product.id)}
                      >
                        <Plus size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                    <span className="min-w-24 text-right text-sm font-semibold text-slate-900">
                      {formatPKR(item.product.price * item.quantity)}
                    </span>
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-700 transition hover:bg-rose-50"
                      type="button"
                      aria-label="Remove item"
                      onClick={() => handleRemove(item.product.id)}
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </article>
              </SectionReveal>
            ))}
          </div>

          <div className="lg:col-span-4">
            <SectionReveal>
              <aside className="card-surface sticky top-28 rounded-[22px] p-6">
                <h2 className="font-heading text-xl font-bold text-slate-900">Price Summary</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">{formatPKR(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="font-medium text-slate-900">{formatPKR(shipping)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Total</span>
                      <span className="text-xl font-bold text-brand-700">{formatPKR(total)}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Estimated delivery: 2–4 working days (Pakistan)</p>
                  </div>
                </div>
                <Link
                  href={cartItems.length === 0 ? "/shop" : "/checkout"}
                  className={`btn-primary mt-5 w-full ${cartItems.length === 0 ? "pointer-events-none opacity-60" : ""}`}
                  aria-disabled={cartItems.length === 0}
                >
                  Proceed to checkout
                </Link>
                {cartItems.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      pushToast("Cart cleared successfully.", "success");
                    }}
                    className="btn-secondary mt-2 w-full"
                  >
                    Clear cart
                  </button>
                ) : null}
              </aside>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
