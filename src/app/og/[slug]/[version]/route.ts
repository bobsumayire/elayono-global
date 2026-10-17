import { getPublishedPost } from "@/lib/cms/read";
import { ensureShareJpeg } from "@/lib/shareCard";
import { articleShareSource, shareVersion } from "@/lib/share";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string; version: string }> }) {
  const { slug, version } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return new Response("Not found", { status: 404 });

  const source = articleShareSource(post);
  if (version !== shareVersion(source)) return new Response("Not found", { status: 404 });

  const { bytes } = await ensureShareJpeg(slug, source);
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
