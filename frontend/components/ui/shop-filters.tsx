import { categories as fallbackCategories } from "../../lib/data";
import type { Category } from "../../types";

type ShopFiltersProps = {
  categories?: Category[];
};

export function ShopFilters({ categories = fallbackCategories }: ShopFiltersProps) {
  return (
    <aside className="space-y-7 rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,36,64,0.06)]">
      <div>
        <h3 className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-slate-900">Category</h3>
        <div className="mt-3 space-y-2">
          {categories.map((category) => (
            <label key={category.slug} className="flex items-center gap-2.5 text-sm text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
              />
              {category.title}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-slate-900">Price Range</h3>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2.5 text-sm text-slate-600">
            <input type="radio" name="price-range" className="h-4 w-4 border-slate-300 text-brand-600 focus:ring-brand-400" /> Under PKR 20,000
          </label>
          <label className="flex items-center gap-2.5 text-sm text-slate-600">
            <input type="radio" name="price-range" className="h-4 w-4 border-slate-300 text-brand-600 focus:ring-brand-400" /> PKR 20,000 - 50,000
          </label>
          <label className="flex items-center gap-2.5 text-sm text-slate-600">
            <input type="radio" name="price-range" className="h-4 w-4 border-slate-300 text-brand-600 focus:ring-brand-400" /> Above PKR 50,000
          </label>
        </div>
      </div>

      <div>
        <h3 className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-slate-900">Availability</h3>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2.5 text-sm text-slate-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
            /> In Stock
          </label>
          <label className="flex items-center gap-2.5 text-sm text-slate-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
            /> Out of Stock
          </label>
        </div>
      </div>
    </aside>
  );
}
