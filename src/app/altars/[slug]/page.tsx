import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import EventCard from "@/components/EventCard";
import { altars } from "@/data/altars";
import { events } from "@/data/events";

export function generateStaticParams() {
  return altars.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const altar = altars.find((a) => a.slug === slug);
  if (!altar) return {};
  return {
    title: `${altar.country} Altar`,
    description: altar.summary,
  };
}

export default async function AltarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const altar = altars.find((a) => a.slug === slug);
  if (!altar) notFound();

  const altarEvents = events.filter((e) => e.altarSlug === altar.slug);

  return (
    <>
      <section className="relative flex min-h-[50vh] items-end overflow-hidden bg-ink">
        <Image src={altar.heroImage} alt={`${altar.country} altar`} fill priority sizes="100vw" className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="container-elayono relative z-10 flex flex-col gap-4 py-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-300">
            <span className="h-px w-6 bg-brand-300" aria-hidden />
            {altar.region}
          </span>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {altar.country} Altar
          </h1>
          <p className="max-w-2xl text-lg text-white/80">{altar.summary}</p>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-elayono grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Service Times" title={`Join Us in ${altar.cities[0]}`} />
            <div className="grid gap-4 sm:grid-cols-2">
              {altar.serviceTimes.map((t) => (
                <div key={t.label} className="rounded-2xl border border-line bg-white p-5">
                  <p className="text-sm font-semibold text-brand-600">{t.label}</p>
                  <p className="mt-1 text-lg font-bold text-ink">{t.time}</p>
                </div>
              ))}
            </div>

            {altarEvents.length > 0 && (
              <div className="flex flex-col gap-6 pt-6">
                <SectionHeading eyebrow="Upcoming" title="Events at This Altar" />
                <div className="grid gap-6 sm:grid-cols-2">
                  {altarEvents.map((e) => (
                    <EventCard key={e.slug} event={e} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 h-fit">
            <h3 className="font-display text-lg font-bold text-ink">Connect With This Altar</h3>
            <p className="text-sm text-slate">
              For address details, directions, or to speak with someone from this altar&apos;s team,
              reach out to our ministry office and we&apos;ll connect you directly.
            </p>
            <Button href="/contact" variant="primary" className="w-full justify-center">
              Contact This Altar
            </Button>
            <Button href="/prayer-request" variant="ghost" className="w-full justify-center">
              Submit a Prayer Request
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
