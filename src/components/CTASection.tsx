import Image from "next/image";
import Button from "./Button";

type CTASectionProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  image?: string;
};

export default function CTASection({ eyebrow, title, description, primary, secondary, image }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-ink">
      {image && (
        <>
          <Image src={image} alt="" fill sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />
        </>
      )}
      <div className="container-elayono relative z-10 flex flex-col items-start gap-6 py-20 sm:py-24">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
            <span className="h-px w-6 bg-brand-300" aria-hidden />
            {eyebrow}
          </span>
        )}
        <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{description}</p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Button href={primary.href} variant="primary" size="lg">
            {primary.label}
          </Button>
          {secondary && (
            <Button href={secondary.href} variant="outline-white" size="lg">
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
