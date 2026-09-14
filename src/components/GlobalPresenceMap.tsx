"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { altars, type Altar } from "@/data/altars";

const HUB = { x: 50, y: 54 };

function arcPath(from: { x: number; y: number }, to: { x: number; y: number }) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2 - 10;
  return `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
}

export default function GlobalPresenceMap() {
  const [active, setActive] = useState<Altar | null>(null);
  const gridId = useId();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] border border-line bg-gradient-to-b from-mist to-white">
        <svg viewBox="0 0 100 62" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id={gridId} width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill="var(--color-brand-800)" opacity="0.08" />
            </pattern>
          </defs>
          <rect width="100" height="62" fill={`url(#${gridId})`} />

          <ellipse cx="50" cy="31" rx="46" ry="24" fill="none" stroke="var(--color-brand-300)" strokeOpacity="0.35" strokeWidth="0.3" />
          <ellipse cx="50" cy="31" rx="32" ry="24" fill="none" stroke="var(--color-brand-300)" strokeOpacity="0.35" strokeWidth="0.3" />
          <ellipse cx="50" cy="31" rx="46" ry="14" fill="none" stroke="var(--color-brand-300)" strokeOpacity="0.35" strokeWidth="0.3" />

          {altars.map((a) => (
            <path
              key={a.slug}
              d={arcPath(HUB, a.map)}
              fill="none"
              stroke="var(--color-brand-500)"
              strokeWidth={active?.slug === a.slug ? 0.5 : 0.25}
              strokeOpacity={active && active.slug !== a.slug ? 0.15 : 0.55}
              strokeDasharray="1.4 1.4"
              className="transition-all duration-300"
            />
          ))}

          <circle cx={HUB.x} cy={HUB.y} r="1.4" fill="var(--color-brand-900)" />
          <circle cx={HUB.x} cy={HUB.y} r="2.6" fill="var(--color-brand-500)" opacity="0.18" />
        </svg>

        {altars.map((a) => (
          <Link
            key={a.slug}
            href={`/altars/${a.slug}`}
            onMouseEnter={() => setActive(a)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(a)}
            onBlur={() => setActive(null)}
            className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            style={{ left: `${a.map.x}%`, top: `${a.map.y}%` }}
          >
            <span className="relative flex h-4 w-4 items-center justify-center">
              <span className="absolute h-4 w-4 rounded-full bg-brand-400/40 animate-ping [animation-duration:2.5s] group-hover:bg-brand-400/60" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-brand-500 ring-4 ring-white shadow-sm transition-transform group-hover:scale-125" />
            </span>
            <span className="pointer-events-none absolute left-1/2 top-full mt-2 w-max -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              {a.country}
            </span>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {altars.map((a) => (
          <Link
            key={a.slug}
            href={`/altars/${a.slug}`}
            onMouseEnter={() => setActive(a)}
            onMouseLeave={() => setActive(null)}
            className={`flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 transition-colors ${
              active?.slug === a.slug
                ? "border-brand-400 bg-brand-50"
                : "border-line bg-white hover:border-brand-200"
            }`}
          >
            <div>
              <p className="font-semibold text-ink">{a.country}</p>
              <p className="text-xs text-slate">{a.cities.join(", ")}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-brand-500" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
        <p className="pt-1 text-xs text-slate">
          Elayono Global continues to expand — new altars are added to this map as they launch.
        </p>
      </div>
    </div>
  );
}
