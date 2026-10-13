import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BlogIndex from "@/components/BlogIndex";
import { publishedPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and news from Elayono Global — ministry updates, stories and teaching.",
};

export default function BlogPage() {
  const posts = publishedPosts();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Articles & News"
        description="Stories, teaching and updates from across the Elayono Global family."
        image="/photos/hero-news.jpg"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono">
          {posts.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-mist px-8 py-14 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Coming soon</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Articles and news will be published here
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate">
                This is where Elayono Global will share ministry updates and longer stories. Check back soon.
              </p>
            </div>
          ) : (
            <BlogIndex posts={posts} />
          )}
        </div>
      </section>
    </>
  );
}
