import Image from "next/image";
import type { Sermon } from "@/data/sermons";

export default function SermonCard({ sermon }: { sermon: Sermon }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={sermon.thumbnail}
          alt={sermon.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-ink/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-600 shadow-lg">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M4 2.5v11l10-5.5Z" />
            </svg>
          </span>
        </div>
        <span className="absolute bottom-3 right-3 rounded-md bg-ink/80 px-2 py-0.5 text-[11px] font-semibold text-white">
          {sermon.duration}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {sermon.series && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-500">
            {sermon.series}
          </span>
        )}
        <h3 className="text-lg font-bold leading-snug text-ink">{sermon.title}</h3>
        <p className="text-sm text-slate line-clamp-2">{sermon.summary}</p>
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-slate">
          <span>{sermon.speaker}</span>
          <span>
            {new Date(sermon.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>
    </article>
  );
}
