import type { Ministry } from "@/data/ministries";
import MinistryIcon from "./MinistryIcon";

export default function MinistryCard({ ministry }: { ministry: Ministry }) {
  return (
    <div className="group flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-ink/5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
        <MinistryIcon icon={ministry.icon} className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-ink">{ministry.name}</h3>
      <p className="text-sm leading-relaxed text-slate">{ministry.summary}</p>
    </div>
  );
}
