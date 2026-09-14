import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { news } from "@/data/news";

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = news.find((n) => n.slug === slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = news.find((n) => n.slug === slug);
  if (!article) notFound();

  return (
    <article className="py-16 sm:py-24">
      <div className="container-elayono max-w-3xl">
        <Link href="/news" className="text-sm font-semibold text-brand-600 hover:underline">
          &larr; Back to News
        </Link>
        <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
          {article.category}
        </span>
        <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-slate">
          {new Date(article.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-3xl">
          <Image src={article.image} alt={article.title} fill sizes="(min-width: 1024px) 768px, 100vw" className="object-cover" />
        </div>

        <div className="mt-10 flex flex-col gap-5 text-base leading-relaxed text-ink/80 sm:text-lg">
          <p>{article.excerpt}</p>
          <p>
            This is placeholder article content. Replace it with the full story once ready —
            each news entry lives in <code className="rounded bg-mist px-1.5 py-0.5 text-sm">src/data/news.ts</code> and
            can include as much detail as needed.
          </p>
        </div>
      </div>
    </article>
  );
}
