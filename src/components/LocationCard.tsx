import Image from "next/image";
import Link from "next/link";
import type { Altar } from "@/data/altars";

export default function LocationCard({ altar }: { altar: Altar }) {
  return (
    <Link
      href={`/altars/${altar.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={altar.heroImage}
          alt={`${altar.country} altar`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent" />
        <span className="absolute bottom-3 left-4 text-lg font-bold text-white">{altar.country}</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-sm leading-relaxed text-slate line-clamp-3">{altar.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
          View Altar
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-1" aria-hidden>
            <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
