"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminProductForm } from "@/components/admin/product-form";
import { ADMIN_API, adminFetch } from "@/lib/admin-api";
import type { AdminCategory, AdminProduct } from "@/types/admin";

export default function AdminEditProductPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const [cats, prod] = await Promise.all([
          adminFetch<AdminCategory[]>(ADMIN_API.categories, { cache: "no-store" }),
          adminFetch<AdminProduct>(`${ADMIN_API.products}/${id}`, { cache: "no-store" })
        ]);
        setCategories(cats);
        setProduct(prod);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load product.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  if (loading) return <p className="text-sm text-slate-600">Loading form...</p>;
  if (error || !product) return <p className="text-sm text-rose-700">{error || "Product not found."}</p>;

  return <AdminProductForm categories={categories} initial={product} />;
}
