"use client";

import { FormEvent, useEffect, useState } from "react";
import { ADMIN_API, adminFetch } from "@/lib/admin-api";
import type { AdminCategory } from "@/types/admin";

type CategoryForm = {
  id?: string;
  name: string;
  description: string;
  image: string;
};

const initialForm: CategoryForm = {
  name: "",
  description: "",
  image: ""
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState<CategoryForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminFetch<AdminCategory[]>(ADMIN_API.categories, { cache: "no-store" });
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const method = form.id ? "PUT" : "POST";
      const url = form.id ? `${ADMIN_API.categories}/${form.id}` : ADMIN_API.categories;

      await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      setForm(initialForm);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const edit = (category: AdminCategory) => {
    setForm({
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image
    });
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await adminFetch(`${ADMIN_API.categories}/${id}`, { method: "DELETE" });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  const uploadImage = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("image", file);

      const response = await fetch(ADMIN_API.uploadImage, {
        method: "POST",
        body,
        credentials: "include"
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Upload failed.");

      setForm((prev) => ({ ...prev, image: payload.data.value }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">{form.id ? "Edit Category" : "Add Category"}</h1>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Category name"
            required
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Description"
            rows={4}
            required
          />
          <input
            value={form.image}
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Image URL or upload:value"
            required
          />
          <label className="inline-flex w-fit cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700">
            Upload image
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => uploadImage(e.target.files?.[0] || null)}
            />
          </label>
          {uploading ? <p className="text-xs text-slate-500">Uploading image...</p> : null}
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : form.id ? "Update" : "Create"}
            </button>
            {form.id ? (
              <button
                type="button"
                onClick={() => setForm(initialForm)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Categories</h2>
        {loading ? (
          <p className="mt-3 text-sm text-slate-600">Loading categories...</p>
        ) : (
          <div className="mt-4 space-y-3">
            {categories.map((category) => (
              <article key={category.id} className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-slate-800">{category.name}</p>
                <p className="mt-1 text-xs text-slate-500">/{category.slug}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => edit(category)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(category.id)}
                    className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
