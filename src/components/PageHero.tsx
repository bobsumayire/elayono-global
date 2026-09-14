import Image from "next/image";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
};

export default function PageHero({ eyebrow, title, description, image }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[46vh] items-end overflow-hidden bg-ink">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
      <div className="container-elayono relative z-10 flex flex-col gap-4 py-16">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-300">
            <span className="h-px w-6 bg-brand-300" aria-hidden />
            {eyebrow}
          </span>
        )}
        <h1 className="max-w-2xl text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {description && <p className="max-w-2xl text-lg text-white/80">{description}</p>}
      </div>
    </section>
  );
}
