"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import { SectionHeading } from "../../components/ui/section-heading";
import { SectionReveal } from "../../components/ui/section-reveal";
import { API_ROUTES } from "../../lib/api";
import { useCartStore } from "../../lib/store/cart-store";
import { useToastStore } from "../../lib/store/toast-store";
import { formatPKR } from "../../lib/utils";

type CheckoutForm = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
};

const initialForm: CheckoutForm = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  address: ""
};

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const pushToast = useToastStore((state) => state.pushToast);

  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const delivery = cartItems.length > 0 ? 350 : 0;
  const total = subtotal + delivery;

  const phoneValid = useMemo(() => {
    const normalized = form.phone.replace(/[\s-]/g, "");
    return /^(?:\+92|0)3\d{9}$/.test(normalized);
  }, [form.phone]);

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()), [form.email]);

  const fieldErrors = {
    fullName: submitted && form.fullName.trim().length < 3,
    phone: submitted && !phoneValid,
    email: submitted && !emailValid,
    city: submitted && !form.city.trim(),
    address: submitted && form.address.trim().length < 8
  };

  const hasErrors = Object.values(fieldErrors).some(Boolean);

  const onFieldChange = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    setSubmitted(true);

    if (cartItems.length === 0) {
      pushToast("Your cart is empty.", "error");
      return;
    }

    if (hasErrors) {
      pushToast("Please correct checkout form errors.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        items: cartItems.map((item) => ({
          product_id: item.product.id,
          slug: item.product.slug,
          name: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price,
          line_total: item.quantity * item.product.price
        })),
        total_amount: total
      };

      const response = await fetch(API_ROUTES.orders, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Unable to place order.");
      }

      const orderId = result?.data?.id;
      const summary = {
        orderId,
        items: payload.items,
        totalAmount: total,
        createdAt: new Date().toISOString()
      };
      if (typeof window !== "undefined") {
        window.localStorage.setItem("umarasia-last-order", JSON.stringify(summary));
      }
      clearCart();
      pushToast("Order placed successfully.", "success");
      router.push(`/order-success?id=${encodeURIComponent(orderId || "")}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Order placement failed.";
      pushToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-space">
      <div className="ui-container">
        <SectionReveal>
          <SectionHeading
            eyebrow="Checkout"
            title="Cash on Delivery Checkout"
            description="Complete your delivery details. Payment collection will be done via COD only."
          />
        </SectionReveal>

        <div className="grid gap-6 lg:grid-cols-12">
          <SectionReveal className="lg:col-span-7">
            <form className="card-surface space-y-4 rounded-[22px] p-6" onSubmit={(e) => e.preventDefault()}>
              <div className="floating-group">
                <input
                  className={`floating-input ${fieldErrors.fullName ? "floating-error" : ""}`}
                  type="text"
                  placeholder=" "
                  value={form.fullName}
                  onChange={(e) => onFieldChange("fullName", e.target.value)}
                />
                <label className="floating-label">Full Name *</label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="floating-group">
                  <input
                    className={`floating-input ${fieldErrors.phone ? "floating-error" : ""}`}
                    type="tel"
                    placeholder=" "
                    value={form.phone}
                    onChange={(e) => onFieldChange("phone", e.target.value)}
                  />
                  <label className="floating-label">Phone (+92/03...) *</label>
                </div>

                <div className="floating-group">
                  <input
                    className={`floating-input ${fieldErrors.email ? "floating-error" : ""}`}
                    type="email"
                    placeholder=" "
                    value={form.email}
                    onChange={(e) => onFieldChange("email", e.target.value)}
                  />
                  <label className="floating-label">Email *</label>
                </div>
              </div>

              <div className="floating-group">
                <input
                  className={`floating-input ${fieldErrors.city ? "floating-error" : ""}`}
                  type="text"
                  placeholder=" "
                  value={form.city}
                  onChange={(e) => onFieldChange("city", e.target.value)}
                />
                <label className="floating-label">City *</label>
              </div>

              <div className="floating-group">
                <textarea
                  className={`floating-textarea min-h-[130px] ${fieldErrors.address ? "floating-error" : ""}`}
                  rows={5}
                  placeholder=" "
                  value={form.address}
                  onChange={(e) => onFieldChange("address", e.target.value)}
                />
                <label className="floating-label">Address *</label>
              </div>

              <button type="button" className="btn-primary w-full" onClick={handlePlaceOrder} disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <LoadingSpinner /> Processing Order
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>
            </form>
          </SectionReveal>

          <SectionReveal className="lg:col-span-5">
            <aside className="card-surface sticky top-28 rounded-[22px] p-6">
              <h2 className="font-heading text-xl font-bold text-slate-900">Order Summary</h2>
              <ul className="mt-4 space-y-3">
                {cartItems.map((item) => (
                  <li key={item.product.id} className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-slate-600">
                      {item.product.name} <span className="text-slate-400">x {item.quantity}</span>
                    </span>
                    <span className="font-medium text-slate-900">{formatPKR(item.product.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPKR(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Delivery</span>
                  <span>{formatPKR(delivery)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-brand-700">
                  <span>Total</span>
                  <span>{formatPKR(total)}</span>
                </div>
                <p className="pt-1 text-xs text-slate-500">Estimated delivery: 2–4 working days (Pakistan)</p>
              </div>
            </aside>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
