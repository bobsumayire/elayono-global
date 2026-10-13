import Link from "next/link";
import ContentImage from "@/components/ContentImage";
import { categoryLabel, formatBlogDate, readingMinutes, type BlogPost } from "@/data/blog";

type BlogCardProps = {
  post: BlogPost;
  featured?: boolean;
};

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex overflow-hidden rounded-3xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5 ${
        featured ? "flex-col lg:min-h-[22rem] lg:flex-row" : "flex-col"
      }`}
    >
      <Cover post={post} featured={featured} />
      <div className={`flex flex-1 flex-col gap-3 ${featured ? "p-7 sm:p-10" : "p-6"}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="font-semibold uppercase tracking-[0.15em] text-brand-500">
            {categoryLabel(post.category)}
          </span>
          <span className="text-slate">{formatBlogDate(post.date)}</span>
          <span className="text-slate">{readingMinutes(post)} min read</span>
        </div>
        <h3
          className={`font-bold leading-snug text-ink ${
            featured ? "text-2xl sm:text-3xl" : "text-lg"
          }`}
        >
          {post.title}
        </h3>
        <p className={`text-slate ${featured ? "text-base sm:text-lg" : "line-clamp-3 text-sm"}`}>
          {post.excerpt}
        </p>
        <span className="mt-auto pt-2 text-sm font-semibold text-brand-600">Read {post.category === "Article" ? "article" : "story"}</span>
      </div>
    </Link>
  );
}

function Cover({ post, featured }: { post: BlogPost; featured: boolean }) {
  const frame = featured
    ? "relative min-h-64 w-full overflow-hidden lg:min-h-full lg:w-1/2"
    : "relative h-48 w-full overflow-hidden";

  if (!post.image) {
    return (
      <div className={`${frame} bg-gradient-to-br from-brand-700 to-ink`}>
        <span className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
          {categoryLabel(post.category)}
        </span>
      </div>
    );
  }

  return (
    <div className={frame}>
      <ContentImage
        src={post.image}
        alt=""
        sizes={featured ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}
