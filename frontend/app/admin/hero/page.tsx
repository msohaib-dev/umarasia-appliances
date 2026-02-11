"use client";

import { useEffect, useState } from "react";
import { ADMIN_API, adminFetch } from "@/lib/admin-api";
import type { AdminHeroSlide } from "@/types/admin";

type SlideForm = {
  title: string;
  subtitle: string;
  image: string;
};

const emptySlide = (): SlideForm => ({ title: "", subtitle: "", image: "" });

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<SlideForm[]>([emptySlide(), emptySlide(), emptySlide()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadSlides = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminFetch<AdminHeroSlide[]>(ADMIN_API.heroSlides, { cache: "no-store" });
      if (Array.isArray(data) && data.length > 0) {
        setSlides(
          data
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((slide) => ({ title: slide.title, subtitle: slide.subtitle, image: slide.image }))
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load hero slides.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSlides();
  }, []);

  const updateSlide = (index: number, field: keyof SlideForm, value: string) => {
    setSlides((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addSlide = () => {
    setSlides((prev) => [...prev, emptySlide()]);
  };

  const removeSlide = (index: number) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await adminFetch(ADMIN_API.heroSlides, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides })
      });
      await loadSlides();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save hero slides.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-600">Loading hero slides...</p>;
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Hero Slides</h1>
          <p className="mt-1 text-sm text-slate-600">Homepage hero content now managed from admin panel.</p>
        </div>
        <button
          type="button"
          onClick={addSlide}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Add Slide
        </button>
      </div>

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <section key={`hero-slide-${index}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Slide {index + 1}</h2>
              {slides.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeSlide(index)}
                  className="rounded-md border border-rose-200 px-3 py-1 text-xs font-medium text-rose-700"
                >
                  Remove
                </button>
              ) : null}
            </div>

            <div className="grid gap-3">
              <input
                value={slide.title}
                onChange={(e) => updateSlide(index, "title", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Title"
                required
              />
              <textarea
                value={slide.subtitle}
                onChange={(e) => updateSlide(index, "subtitle", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Subtitle"
                rows={3}
                required
              />
              <input
                value={slide.image}
                onChange={(e) => updateSlide(index, "image", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Image URL"
                required
              />
            </div>
          </section>
        ))}
      </div>

      {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}

      <div className="mt-5">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Hero Slides"}
        </button>
      </div>
    </div>
  );
}
