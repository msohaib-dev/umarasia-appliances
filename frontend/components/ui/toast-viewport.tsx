"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useToastStore } from "@/lib/store/toast-store";

export function ToastViewport() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[80] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg ${
              toast.variant === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p>{toast.message}</p>
              <button type="button" onClick={() => removeToast(toast.id)} className="opacity-70 transition hover:opacity-100">
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
