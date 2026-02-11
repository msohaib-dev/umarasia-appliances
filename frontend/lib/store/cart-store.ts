"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../../types";

export type CartProduct = Pick<Product, "id" | "slug" | "name" | "price" | "images" | "stock">;

export type CartLineItem = {
  product: CartProduct;
  quantity: number;
};

type CartStore = {
  items: CartLineItem[];
  addToCart: (product: CartProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  calculateTotals: () => { totalItems: number; subtotal: number };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity: Math.min(item.quantity + quantity, Math.max(product.stock, 1))
                    }
                  : item
              )
            };
          }

          return {
            items: [...state.items, { product, quantity: Math.max(1, quantity) }]
          };
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId)
        }));
      },
      increaseQuantity: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity: Math.min(item.quantity + 1, Math.max(item.product.stock, 1))
                }
              : item
          )
        }));
      },
      decreaseQuantity: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity: Math.max(1, item.quantity - 1)
                }
              : item
          )
        }));
      },
      clearCart: () => set({ items: [] }),
      calculateTotals: () => {
        const items = get().items;
        return {
          totalItems: items.reduce((acc, item) => acc + item.quantity, 0),
          subtotal: items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
        };
      }
    }),
    {
      name: "umarasia-cart-store"
    }
  )
);
