import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Give",
  description: "Partner with Elayono Global through giving — supporting the mission across every altar and nation.",
};

const ways = [
  {
    title: "Give Online",
    body: "Give securely online in a few taps, in your local currency. Connect your preferred giving platform (e.g. Tithe.ly, Pushpay, or your payment processor of choice) to enable this button.",
    action: "Give Online",
  },
  {
    title: "Bank Transfer",
    body: "Give directly via bank transfer. Contact your local altar or our finance team for account details specific to your country.",
    action: "Request Bank Details",
  },
  {
    title: "In Person",
    body: "Give during a service at any Elayono Global altar near you.",
    action: "Find an Altar",
  },
];

export default function GivePage() {
  return (
    <>
      <PageHero
        eyebrow="Partner With Us"
        title="Give to Elayono Global"
        description="Your generosity fuels the Gospel across nations, sustaining altars and raising a generation for God's purpose."
        image="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Why We Give"
            title="Generosity That Builds the Kingdom"
            description="Giving is an act of worship and partnership. Every gift to Elayono Global supports the work of the Gospel — sustaining our altars, funding outreach, training leaders and extending the ministry's reach into new nations."
          />
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Ministry & Missions", desc: "Reaching new communities and nations" },
              { label: "Altars & Facilities", desc: "Sustaining places of worship worldwide" },
              { label: "Media & Outreach", desc: "Carrying the Gospel to a global audience" },
              { label: "Next Generation", desc: "Discipling youth and children" },
            ].map((v) => (
              <div key={v.label} className="rounded-2xl border border-line bg-white p-5">
                <p className="font-display font-bold text-brand-600">{v.label}</p>
                <p className="mt-1 text-sm text-slate">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-28">
        <div className="container-elayono flex flex-col gap-10">
          <SectionHeading eyebrow="Ways to Give" title="Choose the Option That Works for You" />
          <div className="grid gap-6 sm:grid-cols-3">
            {ways.map((w) => (
              <div key={w.title} className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-8">
                <h3 className="font-display text-lg font-bold text-ink">{w.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-slate">{w.body}</p>
                <Button href="/contact" variant="ghost" className="w-full justify-center">
                  {w.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stewardship" className="py-20 sm:py-28">
        <div className="container-elayono grid gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Stewardship"
            title="Faithful, Transparent Stewardship"
            description="Elayono Global is committed to handling every gift with integrity and accountability, ensuring resources are used faithfully to advance the ministry's mission across every altar and nation."
          />
          <div className="flex flex-col gap-4 text-sm leading-relaxed text-slate">
            <p>
              Have questions about giving, tax receipts, or how funds are used in your country?
              Reach out to your local altar or our ministry office — we&apos;re glad to help.
            </p>
            <Button href="/contact" variant="secondary" className="w-fit">
              Contact the Ministry Office
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
