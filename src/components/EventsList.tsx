import PageHero from "@/components/PageHero";
import EventCard from "@/components/EventCard";
import { events } from "@/data/events";

/** The Events page body. `openSlug` opens that event's poster popup on load. */
export default function EventsList({ openSlug }: { openSlug?: string }) {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <PageHero
        eyebrow="What's Happening"
        title="Upcoming Events"
        description="Join us in person at one of our altars, or online, for conferences, outreach and gatherings."
        image="/photos/hero-events.jpg"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((e) => (
            <div key={e.slug} id={e.slug}>
              <EventCard event={e} defaultOpen={e.slug === openSlug} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
