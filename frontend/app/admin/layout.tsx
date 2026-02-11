"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/logout-button";
import { ADMIN_API, adminFetch } from "@/lib/admin-api";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/hero", label: "Hero Slides" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" }
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    const verify = async () => {
      if (isLoginRoute) {
        setChecking(false);
        return;
      }

      try {
        await adminFetch(ADMIN_API.session, { cache: "no-store" });
      } catch (_error) {
        router.replace("/admin/login");
      } finally {
        setChecking(false);
      }
    };

    void verify();
  }, [isLoginRoute, router]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-600">Checking admin session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="bg-slate-900 text-white">
          <div className="border-b border-slate-700 px-6 py-6">
            <p className="text-lg font-semibold">Admin Panel</p>
            <p className="text-xs text-slate-300">UmarAsia-Appliances</p>
          </div>
          <nav className="space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <AdminLogoutButton />
          </nav>
        </aside>

        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}

