import Image from "next/image";
import Link from "next/link";
import type { EventItem } from "@/data/events";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function EventCard({ event }: { event: EventItem }) {
  const d = new Date(event.date);
  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5">
      <Link href={`/events#${event.slug}`} className="flex flex-1 flex-col">
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-4 top-4 flex flex-col items-center rounded-xl bg-white/95 px-3 py-1.5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-600">
              {d.toLocaleDateString("en-US", { month: "short" })}
            </span>
            <span className="text-lg font-extrabold leading-none text-ink">{d.getDate()}</span>
          </div>
          <span className="absolute right-4 top-4 rounded-full bg-brand-500 px-3 py-1 text-[11px] font-semibold text-white">
            {event.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5 pb-0">
          <h3 className="text-lg font-bold leading-snug text-ink">{event.title}</h3>
          <p className="text-sm text-slate">{event.summary}</p>
          <div className="mt-auto flex flex-col gap-1 pt-3 text-xs text-slate">
            <span className="flex items-center gap-1.5">
              <ClockIcon /> {formatDate(event.date)} &middot; {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              <PinIcon /> {event.location}
            </span>
          </div>
        </div>
      </Link>
      {event.whatsapp && (
        <div className="p-5 pt-4">
          <a
            href={`https://wa.me/${event.whatsapp}?text=${encodeURIComponent(
              `Hi, I'd like to register for ${event.title}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            <WhatsAppIcon /> Register on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 1.3a6.7 6.7 0 0 0-5.7 10.2L1.3 14.7l3.3-1a6.7 6.7 0 1 0 3.4-12.4Zm0 12.1a5.4 5.4 0 0 1-2.75-.75l-.2-.12-2 .53.53-1.94-.13-.2A5.4 5.4 0 1 1 8 13.4Zm3-4a1.6 1.6 0 0 1-1 .5c-.27.05-.62.08-1.85-.4a6.5 6.5 0 0 1-2.5-2.2c-.4-.5-.65-1.1-.5-1.6.1-.35.4-.5.55-.6.13-.08.28-.08.4-.05l.35.05c.12.02.28-.02.44.33.17.4.55 1.4.6 1.5.05.1.08.22.02.35-.06.13-.1.2-.2.3l-.28.3c-.1.1-.2.2-.08.4.12.2.5.85 1.1 1.35.75.65 1.35.85 1.55.95.2.1.32.08.44-.05l.5-.6c.15-.2.3-.16.5-.1l1.2.55c.14.06.24.1.28.16.05.08.05.42-.1.8Z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 12.5s4-3.6 4-6.8A4 4 0 0 0 3 5.7c0 3.2 4 6.8 4 6.8Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="7" cy="5.7" r="1.4" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
