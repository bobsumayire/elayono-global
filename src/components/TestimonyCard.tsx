import type { Testimony } from "@/data/testimonies";

export default function TestimonyCard({ testimony }: { testimony: Testimony }) {
  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-line bg-white p-7">
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="text-brand-300" aria-hidden>
        <path
          d="M0 20V11.6C0 5.2 4.2.6 11 0v4.4C7.4 5 5.6 7 5.6 10h5.2v10H0Zm16.8 0V11.6c0-6.4 4.2-11 11-11.6v4.4c-3.6.6-5.4 2.6-5.4 5.6h5.2v10H16.8Z"
          fill="currentColor"
        />
      </svg>
      <p className="text-base leading-relaxed text-ink/85">{testimony.quote}</p>
      <div>
        <p className="text-sm font-semibold text-ink">{testimony.name}</p>
        <p className="text-xs text-slate">{testimony.altar}</p>
      </div>
    </div>
  );
}
