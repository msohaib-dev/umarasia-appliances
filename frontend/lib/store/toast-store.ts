"use client";

import { create } from "zustand";

export type ToastVariant = "success" | "error";

export type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastStore = {
  toasts: ToastItem[];
  pushToast: (message: string, variant: ToastVariant) => void;
  removeToast: (id: number) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  pushToast: (message, variant) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    set((state) => ({
      toasts: [...state.toasts, { id, message, variant }]
    }));

    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }));
  }
}));
