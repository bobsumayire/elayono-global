import PageHero from "@/components/PageHero";
import EventCard from "@/components/EventCard";
import SectionHeading from "@/components/SectionHeading";
import { events, isPastEvent, type EventItem } from "@/data/events";

/**
 * The Events page body: upcoming events first (soonest first), then past
 * events (most recent first). `openSlug` opens that event's poster popup on load.
 */
export default function EventsList({ openSlug }: { openSlug?: string }) {
  const now = new Date();
  const upcoming = events
    .filter((e) => !isPastEvent(e, now))
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = events
    .filter((e) => isPastEvent(e, now))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHero
        eyebrow="What's Happening"
        title="Events"
        description="Join us in person at one of our altars, or online, for conferences, outreach and gatherings."
        image="/photos/hero-events.jpg"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono flex flex-col gap-10">
          <SectionHeading eyebrow="Coming Up" title="Upcoming Events" />
          {upcoming.length > 0 ? (
            <EventGrid items={upcoming} openSlug={openSlug} />
          ) : (
            <p className="text-slate">No upcoming events right now — check back soon.</p>
          )}
        </div>
      </section>

      {past.length > 0 && (
        <section className="border-t border-line py-20 sm:py-28">
          <div className="container-elayono flex flex-col gap-10">
            <SectionHeading eyebrow="Look Back" title="Past Events" />
            <EventGrid items={past} openSlug={openSlug} past />
          </div>
        </section>
      )}
    </>
  );
}

function EventGrid({ items, openSlug, past = false }: { items: EventItem[]; openSlug?: string; past?: boolean }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((e) => (
        <div key={e.slug} id={e.slug}>
          <EventCard event={e} defaultOpen={e.slug === openSlug} past={past} />
        </div>
      ))}
    </div>
  );
}
