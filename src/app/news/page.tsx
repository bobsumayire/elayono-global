import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { news } from "@/data/news";

export const metadata: Metadata = {
  title: "News & Articles",
  description: "Updates, announcements and stories from across the Elayono Global ministry.",
};

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="News & Articles"
        title="Updates From Across the Ministry"
        image="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <Link
              key={n.slug}
              href={`/news/${n.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={n.image}
                  alt={n.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-500">
                  {n.category}
                </span>
                <h3 className="text-lg font-bold leading-snug text-ink">{n.title}</h3>
                <p className="text-sm text-slate line-clamp-3">{n.excerpt}</p>
                <span className="mt-auto pt-3 text-xs text-slate">
                  {new Date(n.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
