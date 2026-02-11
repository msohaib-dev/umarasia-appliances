"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

type QuantitySelectorProps = {
  initialValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

export function QuantitySelector({
  initialValue = 1,
  value,
  onChange,
  min = 1,
  max = Number.POSITIVE_INFINITY,
  className = ""
}: QuantitySelectorProps) {
  const [internalQuantity, setInternalQuantity] = useState(initialValue);

  useEffect(() => {
    if (typeof value === "number") {
      setInternalQuantity(value);
    }
  }, [value]);

  const quantity = typeof value === "number" ? value : internalQuantity;

  const updateQuantity = (nextValue: number) => {
    const normalized = Math.max(min, Math.min(max, nextValue));

    if (typeof value !== "number") {
      setInternalQuantity(normalized);
    }

    onChange?.(normalized);
  };

  return (
    <div className={`inline-flex items-center rounded-xl border border-slate-300 bg-white p-1 shadow-sm ${className}`}>
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-700"
        onClick={() => updateQuantity(quantity - 1)}
        disabled={quantity <= min}
      >
        <Minus size={17} strokeWidth={1.5} />
      </button>
      <span className="min-w-10 px-2 text-center text-sm font-semibold text-slate-800">{quantity}</span>
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-700"
        onClick={() => updateQuantity(quantity + 1)}
        disabled={quantity >= max}
      >
        <Plus size={17} strokeWidth={1.5} />
      </button>
    </div>
  );
}
