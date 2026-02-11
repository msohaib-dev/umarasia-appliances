"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_API, adminFetch } from "../../lib/admin-api";
import type { AdminCategory, AdminProduct } from "../../types/admin";

type ProductFormProps = {
  categories: AdminCategory[];
  initial?: AdminProduct;
};

type FormState = {
  name: string;
  slug: string;
  description: string;
  price: string;
  old_price: string;
  stock: string;
  category_id: string;
  is_featured: boolean;
  tags: string[];
  images: string[];
  features: string[];
  specifications: Array<{ label: string; value: string }>;
};

const buildInitialState = (initial?: AdminProduct): FormState => {
  if (!initial) {
    return {
      name: "",
      slug: "",
      description: "",
      price: "",
      old_price: "",
      stock: "0",
      category_id: "",
      is_featured: false,
      tags: [""],
      images: [""],
      features: [""],
      specifications: [{ label: "", value: "" }]
    };
  }

  return {
    name: initial.name,
    slug: initial.slug,
    description: initial.description,
    price: String(initial.price),
    old_price: initial.old_price !== null ? String(initial.old_price) : "",
    stock: String(initial.stock),
    category_id: initial.category_id,
    is_featured: initial.is_featured,
    tags: initial.tags.length ? initial.tags : [""],
    images: initial.images.length ? initial.images : [""],
    features: initial.features.length ? initial.features : [""],
    specifications: initial.specifications.length ? initial.specifications : [{ label: "", value: "" }]
  };
};

export function AdminProductForm({ categories, initial }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => buildInitialState(initial));
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  const title = initial ? "Edit Product" : "Add Product";

  const canSubmit = useMemo(
    () => Boolean(form.name.trim() && form.description.trim() && form.price.trim() && form.category_id.trim()),
    [form]
  );

  const updateArrayField = (field: "images" | "features" | "tags", index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, idx) => (idx === index ? value : item))
    }));
  };

  const addArrayField = (field: "images" | "features" | "tags") => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayField = (field: "images" | "features" | "tags", index: number) => {
    setForm((prev) => {
      const next = prev[field].filter((_, idx) => idx !== index);
      return {
        ...prev,
        [field]: next.length ? next : [""]
      };
    });
  };

  const updateSpecField = (index: number, key: "label" | "value", value: string) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, idx) => (idx === index ? { ...spec, [key]: value } : spec))
    }));
  };

  const addSpec = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }]
    }));
  };

  const removeSpec = (index: number) => {
    setForm((prev) => {
      const next = prev.specifications.filter((_, idx) => idx !== index);
      return {
        ...prev,
        specifications: next.length ? next : [{ label: "", value: "" }]
      };
    });
  };

  const handleUpload = async (index: number, file: File | null) => {
    if (!file) return;

    setUploadingIndex(index);
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

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Upload failed.");
      }

      updateArrayField("images", index, payload.data.value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploadingIndex(null);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("Please complete all required fields.");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      old_price: form.old_price.trim() ? Number(form.old_price) : null,
      stock: Number(form.stock),
      images: form.images.map((item) => item.trim()).filter(Boolean),
      features: form.features.map((item) => item.trim()).filter(Boolean),
      tags: form.tags.map((item) => item.trim()).filter(Boolean),
      specifications: form.specifications
        .map((spec) => ({ label: spec.label.trim(), value: spec.value.trim() }))
        .filter((spec) => spec.label && spec.value)
    };

    setSaving(true);
    try {
      const url = initial ? `${ADMIN_API.products}/${initial.id}` : ADMIN_API.products;
      const method = initial ? "PUT" : "POST";
      await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-600">Manage product content, pricing, stock, and media.</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Price"
          type="number"
          min={0}
          value={form.price}
          onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
          required
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Old Price"
          type="number"
          min={0}
          value={form.old_price}
          onChange={(e) => setForm((prev) => ({ ...prev, old_price: e.target.value }))}
        />
        <input
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Stock"
          type="number"
          min={0}
          value={form.stock}
          onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
          required
        />
        <select
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={form.category_id}
          onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))}
          required
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        placeholder="Description"
        rows={4}
        value={form.description}
        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        required
      />

      <label className="mt-4 inline-flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.is_featured}
          onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
        />
        Featured product
      </label>

      <section className="mt-5 rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Images (Upload + URL)</h2>
          <button type="button" onClick={() => addArrayField("images")} className="text-xs font-medium text-slate-700">
            + Add image
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {form.images.map((image, index) => (
            <div key={`image-${index}`} className="space-y-2 rounded-md border border-slate-200 p-3">
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="External image URL or upload:value"
                value={image}
                onChange={(e) => updateArrayField("images", index, e.target.value)}
              />
              <div className="flex flex-wrap items-center gap-2">
                <label className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700">
                  Upload file
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => handleUpload(index, e.target.files?.[0] || null)}
                  />
                </label>
                {uploadingIndex === index ? <span className="text-xs text-slate-500">Uploading...</span> : null}
                <button
                  type="button"
                  onClick={() => removeArrayField("images", index)}
                  className="text-xs font-medium text-rose-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Features</h2>
          <button type="button" onClick={() => addArrayField("features")} className="text-xs font-medium text-slate-700">
            + Add feature
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {form.features.map((feature, index) => (
            <div key={`feature-${index}`} className="flex items-center gap-2">
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={feature}
                onChange={(e) => updateArrayField("features", index, e.target.value)}
                placeholder="Feature"
              />
              <button type="button" onClick={() => removeArrayField("features", index)} className="text-xs text-rose-700">
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Specifications</h2>
          <button type="button" onClick={addSpec} className="text-xs font-medium text-slate-700">
            + Add specification
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {form.specifications.map((spec, index) => (
            <div key={`spec-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={spec.label}
                onChange={(e) => updateSpecField(index, "label", e.target.value)}
                placeholder="Label"
              />
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={spec.value}
                onChange={(e) => updateSpecField(index, "value", e.target.value)}
                placeholder="Value"
              />
              <button type="button" onClick={() => removeSpec(index)} className="text-xs text-rose-700">
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Tags</h2>
          <button type="button" onClick={() => addArrayField("tags")} className="text-xs font-medium text-slate-700">
            + Add tag
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {form.tags.map((tag, index) => (
            <div key={`tag-${index}`} className="flex items-center gap-2">
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={tag}
                onChange={(e) => updateArrayField("tags", index, e.target.value)}
                placeholder="Tag"
              />
              <button type="button" onClick={() => removeArrayField("tags", index)} className="text-xs text-rose-700">
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={saving || !canSubmit}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
