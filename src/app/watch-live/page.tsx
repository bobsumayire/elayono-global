import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import { altars } from "@/data/altars";

export const metadata: Metadata = {
  title: "Watch Live",
  description: "Join an Elayono Global service live, wherever you are in the world.",
};

export default function WatchLivePage() {
  return (
    <>
      <PageHero
        eyebrow="Watch Live"
        title="Join a Service, Wherever You Are"
        description="Worship with the Elayono Global family in real time — connect from any altar's live stream."
        image="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-3xl border border-line bg-ink">
              <div className="flex flex-col items-center gap-3 text-white/70">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                    <path d="M4 2.5v11l10-5.5Z" />
                  </svg>
                </span>
                <p className="text-sm">Live stream begins at the next scheduled service</p>
              </div>
              <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                OFFLINE
              </span>
            </div>
            <p className="text-sm text-slate">
              Embed your live stream here (YouTube Live, Vimeo, or a dedicated church streaming
              platform) so this player goes live automatically at service time.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-6">
            <SectionHeading eyebrow="Service Times" title="Find a Time Near You" />
            <div className="flex flex-col divide-y divide-line">
              {altars.map((a) => (
                <div key={a.slug} className="flex flex-col gap-1.5 py-4 first:pt-0 last:pb-0">
                  <p className="font-semibold text-ink">{a.country}</p>
                  {a.serviceTimes.map((t) => (
                    <p key={t.label} className="text-sm text-slate">
                      {t.label}: <span className="font-medium text-ink">{t.time}</span>
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <Button href="/altars" variant="ghost" className="mt-2 w-full justify-center">
              View All Altars
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
