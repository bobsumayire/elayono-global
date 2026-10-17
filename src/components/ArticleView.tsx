import Link from "next/link";
import BlogBody from "@/components/BlogBody";
import BlogCard from "@/components/BlogCard";
import ContentImage from "@/components/ContentImage";
import ShareEventButton from "@/components/ShareEventButton";
import UseShareUrl from "@/components/UseShareUrl";
import { categoryLabel, formatBlogDate, postAuthor, type BlogPost } from "@/data/blog";
import { articleShareSource, shareImageId, shareImagePath, sharePagePath } from "@/lib/share";
import { siteConfig } from "@/lib/site";

export default function ArticleView({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const sharePath = sharePagePath(post.slug);
  const shareImage = new URL(shareImagePath(shareImageId(post.slug, articleShareSource(post))), siteConfig.url).href;

  return (
    <article className="bg-white py-8 sm:py-12">
      <UseShareUrl path={sharePath} />
      <link rel="image_src" href={shareImage} />
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
            <ShareEventButton title={post.title} text={post.excerpt} path={sharePath} menuDirection="down" compact />
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
