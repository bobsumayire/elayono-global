import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogBody from "@/components/BlogBody";
import BlogCard from "@/components/BlogCard";
import ContentImage from "@/components/ContentImage";
import ShareEventButton from "@/components/ShareEventButton";
import { categoryLabel, formatBlogDate, postAuthor, readingMinutes } from "@/data/blog";
import { getPublishedPost, getPublishedPosts } from "@/lib/cms/read";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};

  const image = post.image ? [{ url: post.image, alt: post.title }] : undefined;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [postAuthor(post)],
      images: image,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const related = (await getPublishedPosts())
    .filter((item) => item.slug !== post.slug && item.category === post.category)
    .slice(0, 3);

  return (
    <article className="py-16 sm:py-24">
      <div className="container-elayono max-w-3xl">
        <Link href="/blog" className="text-sm font-semibold text-brand-600 hover:underline">
          &larr; Back to the blog
        </Link>
        <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
          {categoryLabel(post.category)}
        </span>
        <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-slate">
          {postAuthor(post)} · {formatBlogDate(post.date)} · {readingMinutes(post)} min read
        </p>
        <div className="mt-6 w-fit">
          <ShareEventButton
            title={post.title}
            text={post.excerpt}
            path={`/blog/${post.slug}`}
            menuDirection="down"
          />
        </div>

        {post.image && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-3xl">
            <ContentImage src={post.image} alt="" sizes="(min-width: 1024px) 768px, 100vw" className="object-cover" priority />
          </div>
        )}

        <p className="mt-10 text-xl leading-relaxed text-ink">{post.excerpt}</p>
        <div className="mt-8">
          <BlogBody blocks={post.body} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-elayono mt-20 border-t border-line pt-16">
          <h2 className="text-2xl font-bold tracking-tight text-ink">More {post.category === "Article" ? "articles" : "news"}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <BlogCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
