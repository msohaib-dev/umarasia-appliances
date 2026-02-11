type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-10 md:mb-12">
      {eyebrow ? (
        <p className="eyebrow-label mb-2.5 font-semibold">{eyebrow}</p>
      ) : null}
      <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-slate-900 md:text-3xl">{title}</h2>
      {description ? <p className="mt-3.5 max-w-3xl text-base leading-relaxed text-slate-600">{description}</p> : null}
    </div>
  );
}
