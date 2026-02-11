import Image from "next/image";
import Link from "next/link";
import type { Category } from "../../types";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className="card-surface group overflow-hidden rounded-[22px] hover:-translate-y-1 hover:shadow-lift">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-heading text-xl font-bold tracking-[-0.02em] text-white">{category.title}</h3>
          <p className="mt-1 text-sm text-white/80">{category.shortDescription}</p>
        </div>
      </div>
      <div className="p-5 pt-4">
        <p className="text-sm leading-relaxed text-slate-600">{category.description}</p>
        <Link
          href={`/category/${category.slug}`}
          className="btn-secondary mt-4 w-full opacity-100 transition duration-300 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          Explore
        </Link>
      </div>
    </article>
  );
}
