import { readShareJpeg } from "@/lib/cms/media";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const id = file.toLowerCase().replace(/\.jpg$/, "");
  if (!/^[a-f0-9]+$/.test(id)) return new Response("Not found", { status: 404 });

  const bytes = await readShareJpeg(id);
  if (!bytes) return new Response("Not found", { status: 404 });

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
