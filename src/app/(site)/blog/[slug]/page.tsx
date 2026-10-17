import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import { articleMetadata } from "@/lib/articleMeta";
import { getPublishedPost, getPublishedPosts } from "@/lib/cms/read";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return articleMetadata(post, `/blog/${post.slug}`);
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

  return <ArticleView post={post} related={related} />;
}
