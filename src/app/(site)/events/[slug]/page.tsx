import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EventsList from "@/components/EventsList";
import { getEvents } from "@/lib/cms/read";

// Shareable link for a single event. It shows the Events page with this
// event's popup open, and gives WhatsApp, Facebook, etc. the event poster
// as the link preview image.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = (await getEvents()).find((e) => e.slug === slug);
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
  if (!(await getEvents()).some((e) => e.slug === slug)) notFound();

  return <EventsList openSlug={slug} />;
}
