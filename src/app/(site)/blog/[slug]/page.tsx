import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogBody from "@/components/BlogBody";
import BlogCard from "@/components/BlogCard";
import ContentImage from "@/components/ContentImage";
import ShareEventButton from "@/components/ShareEventButton";
import { categoryLabel, formatBlogDate, postAuthor } from "@/data/blog";
import { getPublishedPost, getPublishedPosts } from "@/lib/cms/read";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};

  return {
    metadataBase: new URL(siteConfig.url),
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
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
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
    <article className="bg-white py-8 sm:py-12">
      <div className="container-elayono">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="text-sm font-semibold text-brand-600 hover:underline">
            &larr; Blog
          </Link>
          <h1 className="mt-5 text-balance text-3xl font-bold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem]">
            {post.title}
          </h1>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate">
                {categoryLabel(post.category)} · {formatBlogDate(post.date)}
              </p>
              <p className="mt-1 text-sm font-bold text-ink">{postAuthor(post)}</p>
            </div>
            <ShareEventButton
              title={post.title}
              text={post.excerpt}
              path={`/blog/${post.slug}`}
              menuDirection="down"
              compact
            />
          </div>

          {post.image && (
            <figure className="mt-5">
              <ContentImage src={post.image} alt={post.title} fit="full" priority />
            </figure>
          )}

          <div className="mt-8">
            {post.body.length > 0 ? (
              <BlogBody blocks={post.body} />
            ) : (
              <p className="text-lg leading-[1.7] text-ink">{post.excerpt}</p>
            )}
          </div>
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
