type ShopToolbarProps = {
  productCount: number;
};

export function ShopToolbar({ productCount }: ShopToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600/90">
        Showing <span className="font-semibold text-slate-900">{productCount}</span> products
      </p>
      <div className="flex flex-wrap gap-3">
        <select className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100">
          <option>Sort: Popularity</option>
          <option>Sort: Price Low to High</option>
          <option>Sort: Price High to Low</option>
        </select>
        <select className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100">
          <option>Availability: All</option>
          <option>Availability: In Stock</option>
          <option>Availability: Out of Stock</option>
        </select>
      </div>
    </div>
  );
}
