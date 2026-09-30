import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import EventsList from "@/components/EventsList";
import { events } from "@/data/events";

// Shareable link for a single event. It shows the Events page with this
// event's popup open, and gives WhatsApp, Facebook, etc. the event poster
// as the link preview image.

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);
  if (!event) return {};

  const poster = { url: event.image, alt: event.title };
  return {
    title: event.title,
    description: event.summary,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      title: event.title,
      description: event.summary,
      url: `/events/${event.slug}`,
      type: "website",
      images: [poster],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.summary,
      images: [poster],
    },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!events.some((e) => e.slug === slug)) notFound();
  await connection();

  return <EventsList openSlug={slug} />;
}
