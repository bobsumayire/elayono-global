import MediaLibrary from "@/components/admin/MediaLibrary";
import { listMedia } from "@/lib/cms/media";

export default async function MediaAdminPage() {
  const files = await listMedia();
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Media library</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
          Upload a photo, then copy its link into an article, event, sermon or gallery item. Removing a file here does not erase it from entries that already use it.
        </p>
      </div>
      <MediaLibrary files={files} />
    </div>
  );
}
