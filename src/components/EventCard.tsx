import Image from "next/image";
import Link from "next/link";
import type { EventItem } from "@/data/events";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function EventCard({ event }: { event: EventItem }) {
  const d = new Date(event.date);
  return (
    <Link
      href={`/events#${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5"
    >
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
      <div className="flex flex-1 flex-col gap-2 p-5">
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
