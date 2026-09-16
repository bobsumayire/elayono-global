"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { EventItem } from "@/data/events";
import WhatsAppRegisterButton from "./WhatsAppRegisterButton";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function EventCard({ event }: { event: EventItem }) {
  const [open, setOpen] = useState(false);
  const d = new Date(event.date);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex flex-1 flex-col text-left"
          aria-haspopup="dialog"
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
        </button>
        {event.whatsapp && (
          <div className="p-5 pt-4">
            <WhatsAppRegisterButton
              phone={event.whatsapp}
              message={`Hi, I'd like to register for ${event.title}.`}
            />
          </div>
        )}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={event.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:bg-white"
            >
              <CloseIcon />
            </button>
            <div className="relative min-h-[45vh] w-full shrink-0 bg-ink/5 sm:min-h-0 sm:w-1/2">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
            <div className="flex w-full flex-col gap-3 overflow-y-auto p-6 sm:w-1/2 sm:p-8">
              <span className="w-fit rounded-full bg-brand-500 px-3 py-1 text-[11px] font-semibold text-white">
                {event.category}
              </span>
              <h3 className="text-2xl font-extrabold leading-tight text-ink">{event.title}</h3>
              <p className="text-sm leading-relaxed text-slate">{event.summary}</p>
              <div className="flex flex-col gap-2 pt-2 text-sm text-slate">
                <span className="flex items-start gap-2">
                  <ClockIcon />
                  {formatDate(event.date)}
                  {event.endDate ? ` – ${formatDate(event.endDate)}` : ""} &middot; {event.time}
                </span>
                <span className="flex items-start gap-2">
                  <PinIcon /> {event.location}
                </span>
              </div>
              {event.whatsapp && (
                <div className="pt-3">
                  <WhatsAppRegisterButton
                    phone={event.whatsapp}
                    message={`Hi, I'd like to register for ${event.title}.`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden className="mt-0.5 shrink-0">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden className="mt-0.5 shrink-0">
      <path
        d="M7 12.5s4-3.6 4-6.8A4 4 0 0 0 3 5.7c0 3.2 4 6.8 4 6.8Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="7" cy="5.7" r="1.4" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
