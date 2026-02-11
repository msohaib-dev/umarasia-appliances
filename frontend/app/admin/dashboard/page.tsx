"use client";

import { useEffect, useState } from "react";
import { ADMIN_API, adminFetch } from "@/lib/admin-api";
import type { AdminStats } from "@/types/admin";

const statCards = [
  { key: "productCount", label: "Products" },
  { key: "categoryCount", label: "Categories" },
  { key: "orderCount", label: "Orders" },
  { key: "pendingOrders", label: "Pending Orders" }
] as const;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminFetch<AdminStats>(ADMIN_API.dashboard, { cache: "no-store" });
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load dashboard.");
      }
    };
    void load();
  }, []);

  if (error) return <p className="text-sm text-rose-700">{error}</p>;
  if (!stats) return <p className="text-sm text-slate-600">Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">Store overview and pending workload.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <article key={card.key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stats[card.key]}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
