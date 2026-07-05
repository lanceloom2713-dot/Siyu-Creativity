type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.24em] text-ink/45">{eyebrow}</p> : null}
      <h2 className="mt-2 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-ink/65">{description}</p> : null}
    </div>
  );
}
