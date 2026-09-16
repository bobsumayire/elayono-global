"use client";

import { useState } from "react";
import Image from "next/image";
import type { TestimonyVideo } from "@/data/testimonyVideos";

export default function TestimonyVideoCard({ video }: { video: TestimonyVideo }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white">
      <div className="relative aspect-video w-full overflow-hidden bg-ink">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full"
            aria-label={`Play ${video.title}`}
          >
            <Image
              src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt={video.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/25 transition-colors duration-300 group-hover:bg-ink/35">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-600 shadow-lg">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <path d="M4 2.5v11l10-5.5Z" />
                </svg>
              </span>
            </div>
          </button>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-sm font-semibold leading-snug text-ink line-clamp-3">{video.title}</h3>
        <p className="mt-2 text-xs text-slate">Rev Prophet Ernest NYIRINDEKWE</p>
      </div>
    </div>
  );
}
