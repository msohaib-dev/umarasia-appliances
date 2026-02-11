"use client";

import { useEffect, useMemo, useState } from "react";
import { ADMIN_API, adminFetch } from "../../../lib/admin-api";
import type { AdminOrder } from "../../../types/admin";

const statuses: AdminOrder["status"][] = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | AdminOrder["status"]>("");
  const [activeOrder, setActiveOrder] = useState<AdminOrder | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const data = await adminFetch<AdminOrder[]>(`${ADMIN_API.orders}${query}`, { cache: "no-store" });
      setOrders(data);
      if (activeOrder) {
        const fresh = data.find((item) => item.id === activeOrder.id);
        setActiveOrder(fresh || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [statusFilter]);

  const totalItems = useMemo(
    () => (activeOrder?.items || []).reduce((acc, item) => acc + Number(item.quantity || 0), 0),
    [activeOrder]
  );

  const updateStatus = async (orderId: string, status: AdminOrder["status"]) => {
    try {
      await adminFetch<AdminOrder>(`${ADMIN_API.orders}/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Status update failed.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Orders</h1>
            <p className="mt-1 text-sm text-slate-600">Review and update order statuses.</p>
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "" | AdminOrder["status"])}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-slate-600">Loading orders...</p>
        ) : error ? (
          <p className="mt-4 text-sm text-rose-700">{error}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {orders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => setActiveOrder(order)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  activeOrder?.id === order.id ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-800">{order.customer_name}</p>
                  <span className="text-xs text-slate-500">{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Order ID: {order.id}</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-700">PKR {Number(order.total_amount).toLocaleString()}</span>
                  <span className="rounded-full border border-slate-300 px-2 py-0.5 text-xs text-slate-700">{order.status}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Order Details</h2>
        {!activeOrder ? (
          <p className="mt-3 text-sm text-slate-600">Select an order to view details.</p>
        ) : (
          <div className="mt-4 space-y-3 text-sm">
            <p className="font-medium text-slate-800">{activeOrder.customer_name}</p>
            <p className="text-slate-600">{activeOrder.email}</p>
            <p className="text-slate-600">{activeOrder.phone}</p>
            <p className="text-slate-600">
              {activeOrder.city}, {activeOrder.address}
            </p>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="font-medium text-slate-800">Items ({totalItems})</p>
              <ul className="mt-2 space-y-2">
                {(activeOrder.items || []).map((item, index) => (
                  <li key={`${item.name}-${index}`} className="flex justify-between gap-2">
                    <span className="text-slate-700">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-slate-900">PKR {Number(item.line_total).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-slate-200 pt-2 font-semibold text-slate-900">
                Total: PKR {Number(activeOrder.total_amount).toLocaleString()}
              </p>
            </div>

            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Update Status</label>
            <select
              value={activeOrder.status}
              onChange={(event) => updateStatus(activeOrder.id, event.target.value as AdminOrder["status"])}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>
    </div>
  );
}
