"use client";

import { useEffect, useState } from "react";
import { AdminProductForm } from "../../../../components/admin/product-form";
import { ADMIN_API, adminFetch } from "../../../../lib/admin-api";
import type { AdminCategory } from "../../../../types/admin";

export default function AdminNewProductPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminFetch<AdminCategory[]>(ADMIN_API.categories, { cache: "no-store" });
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load categories.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) return <p className="text-sm text-slate-600">Loading form...</p>;
  if (error) return <p className="text-sm text-rose-700">{error}</p>;

  return <AdminProductForm categories={categories} />;
}
