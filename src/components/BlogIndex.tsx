"use client";

import { useState } from "react";
import BlogCard from "@/components/BlogCard";
import { blogCategories, type BlogPost } from "@/data/blog";

const filters = ["All", ...blogCategories] as const;
type Filter = (typeof filters)[number];

export default function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = filter === "All" ? posts : posts.filter((post) => post.category === filter);
  const featured = filter === "All" ? visible[0] : undefined;
  const rest = featured ? visible.slice(1) : visible;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter posts">
        {filters.map((item) => {
          const selected = filter === item;
          const label = item === "Article" ? "Articles" : item;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                selected ? "bg-ink text-white" : "bg-mist text-ink hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="text-slate">
          No {filter === "Article" ? "articles" : "news"} published in this category yet.
        </p>
      ) : (
        <>
          {featured && <BlogCard post={featured} featured />}
          {rest.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
