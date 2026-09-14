type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";
  const titleColor = tone === "dark" ? "text-white" : "text-ink";
  const descColor = tone === "dark" ? "text-white/75" : "text-slate";

  return (
    <div className={`flex flex-col gap-3 max-w-2xl ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
          <span className="h-px w-6 bg-brand-500" aria-hidden />
          {eyebrow}
        </span>
      )}
      <h2 className={`text-balance text-3xl sm:text-4xl font-bold tracking-tight ${titleColor}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-base sm:text-lg leading-relaxed ${descColor}`}>{description}</p>
      )}
    </div>
  );
}
