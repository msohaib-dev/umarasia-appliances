import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="section-space">
      <div className="ui-container text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">404</p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600">The page you are looking for is not available in this catalog.</p>
        <Link href="/" className="btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
