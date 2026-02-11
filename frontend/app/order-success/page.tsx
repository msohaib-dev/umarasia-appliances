"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SectionReveal } from "../../components/ui/section-reveal";
import { formatPKR } from "../../lib/utils";

type OrderSummaryItem = {
  name: string;
  quantity: number;
  line_total: number;
};

type LastOrderSummary = {
  orderId?: string;
  items?: OrderSummaryItem[];
  totalAmount?: number;
};

export default function OrderSuccessPage() {
  const [lastOrder, setLastOrder] = useState<LastOrderSummary | null>(null);
  const [orderIdFromQuery, setOrderIdFromQuery] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("umarasia-last-order");
      if (!raw) return;
      const parsed = JSON.parse(raw) as LastOrderSummary;
      setLastOrder(parsed);
    } catch {
      setLastOrder(null);
    }

    try {
      const params = new URLSearchParams(window.location.search);
      setOrderIdFromQuery(params.get("id") || "");
    } catch {
      setOrderIdFromQuery("");
    }
  }, []);

  const orderId = useMemo(() => {
    if (orderIdFromQuery) return orderIdFromQuery;
    return lastOrder?.orderId || "";
  }, [orderIdFromQuery, lastOrder?.orderId]);

  return (
    <section className="section-space">
      <div className="ui-container max-w-3xl">
        <SectionReveal>
          <div className="card-surface rounded-[24px] p-8 text-center">
            <p className="eyebrow-label text-brand-700">Order Confirmed</p>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-[-0.02em] text-slate-900">Thank you for your order</h1>
            <p className="mt-3 text-slate-600">
              Your order has been placed successfully. Our team will contact you shortly for confirmation and dispatch details.
            </p>
            {orderId ? (
              <p className="mt-4 text-sm font-medium text-slate-700">
                Order ID: <span className="font-semibold text-brand-700">{orderId}</span>
              </p>
            ) : null}

            {lastOrder?.items?.length ? (
              <div className="mx-auto mt-6 max-w-xl rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-600">Order Summary</h2>
                <ul className="mt-3 space-y-2">
                  {lastOrder.items.map((item, index) => (
                    <li key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-700">
                        {item.name} <span className="text-slate-500">x {item.quantity}</span>
                      </span>
                      <span className="font-medium text-slate-900">{formatPKR(item.line_total)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t border-slate-200 pt-3 text-sm font-semibold text-slate-900">
                  Total: {formatPKR(lastOrder.totalAmount || 0)}
                </div>
              </div>
            ) : null}

            <p className="mt-4 text-sm text-slate-600">Confirmation has been recorded. Our team will contact you shortly.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/shop" className="btn-primary">
                Continue Shopping
              </Link>
              <Link href="/" className="btn-secondary">
                Back to Home
              </Link>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
