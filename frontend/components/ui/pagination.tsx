type PaginationProps = {
  currentPage?: number;
  totalPages?: number;
};

export function Pagination({ currentPage = 1, totalPages = 4 }: PaginationProps) {
  return (
    <div className="mt-12 flex items-center justify-center gap-2.5">
      <button className="rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-600 transition hover:border-brand-500 hover:text-brand-700" type="button">
        Prev
      </button>
      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            className={`h-9 w-9 rounded-xl text-sm font-medium transition ${
              page === currentPage
                ? "bg-brand-500 text-white shadow-[0_8px_18px_rgba(29,79,145,0.24)]"
                : "border border-slate-300 text-slate-700 hover:border-brand-500 hover:text-brand-700"
            }`}
            type="button"
          >
            {page}
          </button>
        );
      })}
      <button className="rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-600 transition hover:border-brand-500 hover:text-brand-700" type="button">
        Next
      </button>
    </div>
  );
}
