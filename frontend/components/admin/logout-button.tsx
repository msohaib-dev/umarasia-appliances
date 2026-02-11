"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_API } from "../../lib/admin-api";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch(ADMIN_API.logout, {
        method: "POST",
        credentials: "include"
      });
    } finally {
      setLoading(false);
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="mt-4 block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
