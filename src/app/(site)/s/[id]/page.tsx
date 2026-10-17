import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/ArticleView";
import { articleMetadata } from "@/lib/articleMeta";
import { getPublishedPostBySharePage, getPublishedPosts } from "@/lib/cms/read";
import { sharePagePath } from "@/lib/share";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPublishedPostBySharePage(id);
  if (!post) return {};
  return articleMetadata(post, sharePagePath(post.slug));
}

export default async function ShareArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPublishedPostBySharePage(id);
  if (!post) notFound();

  const related = (await getPublishedPosts())
    .filter((item) => item.slug !== post.slug && item.category === post.category)
    .slice(0, 3);

  return <ArticleView post={post} related={related} />;
}
