import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="ui-container grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h3 className="font-heading text-xl font-bold text-brand-900">UmarAsia-Appliances</h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
            Engineering-grade DC electronics appliances for homes, workshops, shops, and practical buyers across
            Pakistan. Built for reliability, energy efficiency, and long-term use.
          </p>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate-900">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-slate-900">Contact</h4>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p className="font-medium text-slate-800">Umair Nazeer</p>
            <p>+92-317-3725024</p>
            <p>Pakistan</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Â© {new Date().getFullYear()} UmarAsia-Appliances. All rights reserved.
      </div>
    </footer>
  );
}

