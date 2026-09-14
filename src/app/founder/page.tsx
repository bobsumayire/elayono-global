import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import PortraitPlaceholder from "@/components/PortraitPlaceholder";
import { founder } from "@/data/founder";

export const metadata: Metadata = {
  title: "Our Founder",
  description: `Meet ${founder.name}, Founder and Visionary of Elayono Global.`,
};

export default function FounderPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink">
        <div className="container-elayono grid gap-10 py-20 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border-4 border-white/10 shadow-2xl">
            <PortraitPlaceholder initials={founder.initials} className="absolute inset-0 h-full w-full" />
          </div>
          <div className="flex flex-col gap-5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-300">
              <span className="h-px w-6 bg-brand-300" aria-hidden />
              Founder &amp; Visionary
            </span>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {founder.name}
            </h1>
            <p className="text-lg text-white/80">{founder.title}</p>
            <p className="text-base leading-relaxed text-white/70">{founder.shortBio}</p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-elayono grid gap-12 lg:grid-cols-[0.35fr_0.65fr]">
          <SectionHeading eyebrow="Biography" title="A Life Devoted to the Call" />
          <div className="flex flex-col gap-6 text-base leading-relaxed text-slate">
            {founder.bioParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-28">
        <div className="container-elayono grid gap-6 sm:grid-cols-3">
          {[
            { title: "Calling", body: "A clear, unwavering call to preach the Gospel and see lives transformed." },
            { title: "Leadership", body: "Leading Elayono Global's altars across four nations with vision and care." },
            { title: "Global Mission", body: "Carrying the vision of one global family, united by faith, beyond every border." },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-line bg-white p-8">
              <h3 className="font-display text-lg font-bold text-brand-600">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Hear the Message"
        title="Listen to Teachings From Rev Prophet Ernest NYIRINDEKWE"
        description="Explore sermons and teachings from our founder, available to watch on demand."
        primary={{ label: "Watch Sermons", href: "/sermons" }}
        secondary={{ label: "Watch Live", href: "/watch-live" }}
        image="https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2000&auto=format&fit=crop"
      />
    </>
  );
}
