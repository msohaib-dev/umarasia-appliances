"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ADMIN_API, adminFetch } from "@/lib/admin-api";
import type { AdminProduct } from "@/types/admin";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminFetch<AdminProduct[]>(ADMIN_API.products, { cache: "no-store" });
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await adminFetch<{ success: boolean }>(`${ADMIN_API.products}/${id}`, {
        method: "DELETE"
      });
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-600">Manage product catalog and stock.</p>
        </div>
        <Link href="/admin/products/new" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          Add Product
        </Link>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-4 text-sm text-slate-600">Loading products...</p>
        ) : error ? (
          <p className="p-4 text-sm text-rose-700">{error}</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-800">{product.name}</td>
                  <td className="px-4 py-3 text-slate-700">PKR {product.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-700">{product.stock}</td>
                  <td className="px-4 py-3 text-slate-700">{product.is_featured ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
