import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SermonCard from "@/components/SermonCard";
import Button from "@/components/Button";
import { sermons } from "@/data/sermons";

export const metadata: Metadata = {
  title: "Sermons & Teachings",
  description: "Watch and listen to sermons and teachings from Elayono Global, on demand.",
};

export default function SermonsPage() {
  const series = Array.from(new Set(sermons.map((s) => s.series).filter(Boolean)));

  return (
    <>
      <PageHero
        eyebrow="Media"
        title="Sermons & Teachings"
        description="Grow in the Word with messages from across the Elayono Global family."
        image="https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono flex flex-col gap-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
                All Messages
              </span>
              {series.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line px-4 py-2 text-sm font-medium text-slate"
                >
                  {s}
                </span>
              ))}
            </div>
            <Button href="/watch-live" variant="primary">
              Watch Live
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.map((s) => (
              <SermonCard key={s.slug} sermon={s} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
