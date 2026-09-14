import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import PortraitPlaceholder from "@/components/PortraitPlaceholder";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import GlobalPresenceMap from "@/components/GlobalPresenceMap";
import MinistryCard from "@/components/MinistryCard";
import SermonCard from "@/components/SermonCard";
import EventCard from "@/components/EventCard";
import TestimonyCard from "@/components/TestimonyCard";
import CTASection from "@/components/CTASection";
import NewsletterForm from "@/components/NewsletterForm";
import { ministries } from "@/data/ministries";
import { sermons } from "@/data/sermons";
import { events } from "@/data/events";
import { testimonies } from "@/data/testimonies";
import { founder } from "@/data/founder";
import { news } from "@/data/news";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Welcome */}
      <section className="swoop-divider py-20 sm:py-28">
        <div className="container-elayono grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Welcome to Elayono Global"
            title="A global church family, rooted in one faith"
            description="Elayono Global is an international Christian ministry with altars across the USA & Canada, Belgium, France and Sweden — and a vision that continues to grow into more nations. Wherever you find us, you'll find the same heart: proclaiming the Gospel, transforming lives, and building a community of faith that feels like home."
          />
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Faith", desc: "Christ-centered worship and discipleship" },
              { label: "Excellence", desc: "Ministry carried out with care and quality" },
              { label: "Global Reach", desc: "Altars across nations, one family" },
              { label: "Transformation", desc: "Lives renewed by the Gospel" },
            ].map((v) => (
              <div key={v.label} className="rounded-2xl border border-line bg-white p-5">
                <p className="font-display text-lg font-bold text-brand-600">{v.label}</p>
                <p className="mt-1 text-sm text-slate">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-mist py-20 sm:py-28">
        <div className="container-elayono grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border-4 border-white shadow-xl shadow-ink/10">
            <PortraitPlaceholder initials={founder.initials} className="absolute inset-0 h-full w-full" />
          </div>
          <div className="flex flex-col gap-5">
            <SectionHeading
              eyebrow="Founder & Visionary"
              title={founder.name}
              description={founder.shortBio}
            />
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">{founder.title}</p>
            <div>
              <Button href="/founder" variant="secondary">
                Read Full Biography
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Global presence */}
      <section className="py-20 sm:py-28">
        <div className="container-elayono flex flex-col gap-10">
          <SectionHeading
            eyebrow="Where We Are"
            title="A Global Family, United by Faith"
            description="From North America to Europe, Elayono Global is planting altars of worship, discipleship and transformation — with room to grow into every nation."
          />
          <GlobalPresenceMap />
        </div>
      </section>

      {/* Ministries */}
      <section className="bg-mist py-20 sm:py-28">
        <div className="container-elayono flex flex-col gap-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Get Involved"
              title="Ministries Serving the Body of Christ"
              description="Every believer has a place to grow, serve and belong at Elayono Global."
            />
            <Button href="/ministries" variant="ghost" className="shrink-0">
              View All Ministries
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ministries.slice(0, 4).map((m) => (
              <MinistryCard key={m.slug} ministry={m} />
            ))}
          </div>
        </div>
      </section>

      {/* Sermons */}
      <section className="py-20 sm:py-28">
        <div className="container-elayono flex flex-col gap-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Sermons & Teachings"
              title="Recent Messages"
              description="Grow in the Word wherever you are — new teachings from Elayono Global, ready to watch on demand."
            />
            <div className="flex gap-3">
              <Button href="/watch-live" variant="primary" className="shrink-0">
                Watch Live
              </Button>
              <Button href="/sermons" variant="ghost" className="shrink-0">
                All Sermons
              </Button>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.slice(0, 3).map((s) => (
              <SermonCard key={s.slug} sermon={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="bg-mist py-20 sm:py-28">
        <div className="container-elayono flex flex-col gap-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="What's Happening"
              title="Upcoming Events"
              description="Join us in person or online for conferences, outreach and gatherings across the Elayono Global family."
            />
            <Button href="/events" variant="ghost" className="shrink-0">
              View All Events
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonies */}
      <section className="py-20 sm:py-28">
        <div className="container-elayono flex flex-col gap-10">
          <SectionHeading
            eyebrow="Testimonies"
            title="Lives Being Transformed"
            align="center"
            description="Stories from across our global family of what God is doing through Elayono Global."
            className="mx-auto text-center"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonies.map((t, i) => (
              <TestimonyCard key={i} testimony={t} />
            ))}
          </div>
          <div className="mx-auto">
            <Button href="/testimonies" variant="ghost">
              Read More Testimonies
            </Button>
          </div>
        </div>
      </section>

      {/* Give CTA */}
      <CTASection
        eyebrow="Partner With Us"
        title="Support the Vision of Elayono Global"
        description="Your generosity fuels the Gospel across nations — sustaining altars, reaching communities, and raising a generation for God's purpose."
        primary={{ label: "Give Now", href: "/give" }}
        secondary={{ label: "Learn How We Steward Giving", href: "/give#stewardship" }}
        image="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2000&auto=format&fit=crop"
      />

      {/* News */}
      <section className="py-20 sm:py-28">
        <div className="container-elayono flex flex-col gap-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="News & Articles"
              title="Updates From Across the Ministry"
            />
            <Button href="/news" variant="ghost" className="shrink-0">
              View All News
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <Link
                key={n.slug}
                href={`/news/${n.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={n.image}
                    alt={n.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-500">
                    {n.category}
                  </span>
                  <h3 className="text-base font-bold leading-snug text-ink">{n.title}</h3>
                  <p className="text-sm text-slate line-clamp-2">{n.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-line bg-brand-50 py-16">
        <div className="container-elayono flex flex-col items-center gap-6 text-center">
          <SectionHeading
            title="Stay Connected to Elayono Global"
            description="Sermon releases, event announcements and ministry news — delivered to your inbox."
            align="center"
            className="mx-auto"
          />
          <div className="w-full max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
