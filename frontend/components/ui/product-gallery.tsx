"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative h-[360px] overflow-hidden rounded-[22px] border border-slate-200 bg-white md:h-[500px]">
        <motion.div
          key={images[active]}
          initial={{ opacity: 0.45 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="group absolute inset-0"
        >
          <Image
            src={images[active]}
            alt={alt}
            fill
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
            className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0" onContextMenu={(event) => event.preventDefault()} />
          <div className="pointer-events-none absolute bottom-3 left-3 rounded bg-black/35 px-2 py-1 text-[10px] font-medium text-white/90">
            UmarAsia-Appliances
          </div>
        </motion.div>

        <div className="absolute bottom-3 right-3 rounded-full bg-slate-900/72 px-3 py-1 text-xs font-medium text-white">
          {active + 1} / {images.length}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            className={`relative h-24 overflow-hidden rounded-xl border transition ${
              active === index
                ? "border-brand-500 ring-2 ring-brand-100"
                : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => setActive(index)}
          >
            <Image
              src={image}
              alt={`${alt} ${index + 1}`}
              fill
              draggable={false}
              onContextMenu={(event) => event.preventDefault()}
              className="object-cover"
            />
            <div className="absolute inset-0" onContextMenu={(event) => event.preventDefault()} />
          </button>
        ))}
      </div>
    </div>
  );
}

