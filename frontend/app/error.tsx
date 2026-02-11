"use client";

import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  return (
    <section className="section-space">
      <div className="ui-container max-w-2xl text-center">
        <p className="eyebrow-label font-semibold text-rose-600">Something went wrong</p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.02em] text-slate-900 md:text-4xl">
          We could not load this page right now
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          Please try again. If the issue continues, return to home and continue browsing the catalog.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>

        {process.env.NODE_ENV === "development" ? (
          <p className="mt-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-left text-xs text-rose-700">
            {error.message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
