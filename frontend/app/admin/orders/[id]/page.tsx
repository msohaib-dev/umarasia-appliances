"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ADMIN_API, adminFetch } from "@/lib/admin-api";
import type { AdminOrder } from "@/types/admin";

const statuses: AdminOrder["status"][] = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrder = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await adminFetch<AdminOrder>(`${ADMIN_API.orders}/${id}`, { cache: "no-store" });
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrder();
  }, [id]);

  const updateStatus = async (status: AdminOrder["status"]) => {
    if (!order) return;
    try {
      await adminFetch(`${ADMIN_API.orders}/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      await loadOrder();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Status update failed.");
    }
  };

  if (loading) return <p className="text-sm text-slate-600">Loading order...</p>;
  if (error || !order) return <p className="text-sm text-rose-700">{error || "Order not found."}</p>;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Order Detail</h1>
      <p className="mt-1 text-sm text-slate-600">Order ID: {order.id}</p>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Customer</h2>
          <p className="mt-2 text-sm text-slate-800">{order.customer_name}</p>
          <p className="text-sm text-slate-600">{order.email}</p>
          <p className="text-sm text-slate-600">{order.phone}</p>
          <p className="text-sm text-slate-600">
            {order.city}, {order.address}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Status</h2>
          <select
            value={order.status}
            onChange={(event) => updateStatus(event.target.value as AdminOrder["status"])}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-500">Created: {new Date(order.created_at).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Products</h2>
        <ul className="mt-3 space-y-2">
          {order.items.map((item, index) => (
            <li key={`${item.name}-${index}`} className="flex justify-between gap-2 text-sm">
              <span className="text-slate-700">
                {item.name} x {item.quantity}
              </span>
              <span className="font-medium text-slate-900">PKR {Number(item.line_total).toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-slate-200 pt-3 text-sm font-semibold text-slate-900">
          Total: PKR {Number(order.total_amount).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
