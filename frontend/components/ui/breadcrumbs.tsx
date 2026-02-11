import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link className="hover:text-brand-700" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-slate-700" : ""}>{item.label}</span>
              )}
              {!isLast ? <span>›</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
