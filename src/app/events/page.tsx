import type { Metadata } from "next";
import EventsList from "@/components/EventsList";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming conferences, services, outreach and gatherings across Elayono Global.",
};

export default function EventsPage() {
  return <EventsList />;
}
