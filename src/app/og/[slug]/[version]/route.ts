import { getPublishedPost } from "@/lib/cms/read";
import { ensureShareJpeg } from "@/lib/shareCard";
import { articleShareSource, shareImagePath, shareImageId, shareVersion } from "@/lib/share";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string; version: string }> }) {
  const { slug, version } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return new Response("Not found", { status: 404 });

  const source = articleShareSource(post);
  if (version !== shareVersion(source)) return new Response("Not found", { status: 404 });

  await ensureShareJpeg(slug, source);
  return Response.redirect(new URL(shareImagePath(shareImageId(slug, source)), siteConfig.url), 301);
}
