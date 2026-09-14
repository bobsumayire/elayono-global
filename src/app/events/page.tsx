import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import EventCard from "@/components/EventCard";
import { events } from "@/data/events";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming conferences, services, outreach and gatherings across Elayono Global.",
};

export default function EventsPage() {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <PageHero
        eyebrow="What's Happening"
        title="Upcoming Events"
        description="Join us in person at one of our altars, or online, for conferences, outreach and gatherings."
        image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((e) => (
            <div key={e.slug} id={e.slug}>
              <EventCard event={e} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
