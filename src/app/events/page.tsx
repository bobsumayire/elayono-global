import type { Metadata } from "next";
import { connection } from "next/server";
import EventsList from "@/components/EventsList";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming conferences, services, outreach and gatherings across Elayono Global.",
};

export default async function EventsPage() {
  // Render per request so events move from Upcoming to Past on their own.
  await connection();
  return <EventsList />;
}
