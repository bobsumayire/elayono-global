export type EventItem = {
  slug: string;
  title: string;
  date: string; // ISO date
  endDate?: string;
  time: string;
  location: string;
  altarSlug?: string;
  category: "Conference" | "Service" | "Outreach" | "Prayer" | "Youth";
  summary: string;
  image: string;
  /** Phone number (with country code, digits only) for WhatsApp registration/RSVP. */
  whatsapp?: string;
};

/**
 * Sample upcoming events across the ministry. Add or edit entries here — the
 * homepage, Events page and altar pages read from this single source.
 */
export const events: EventItem[] = [
  {
    slug: "injira-mu-gihe-cyawe-maine-2026",
    title: "Injira Mugihe Cyawe (Edition 5)",
    date: "2026-10-23",
    endDate: "2026-10-25",
    time: "1:00 PM - 9:00 PM daily",
    location: "DoubleTree by Hilton, 363 Maine Mall Road, Portland, Maine, USA",
    altarSlug: "usa-canada",
    category: "Prayer",
    summary:
      "Get In Your Season — three days of prayer live in Maine, hosted by Rev. Prophet Ernest Nyirindekwe with worshipers Willy, Aime Frank and pianist Nzungu.",
    image: "/events/injira-mugihe-cyawe-maine-2026.jpeg",
    whatsapp: "12679399460",
  },
];

/** True once the event's last day (`endDate`, or `date`) has passed. */
export function isPastEvent(event: EventItem, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  return (event.endDate ?? event.date) < today;
}
