import Link from "next/link";
import { collections } from "@/lib/cms/schema";
import { readCollection } from "@/lib/cms/store";

export default async function AdminHome() {
  const counts = await Promise.all(
    collections.map(async (collection) => ({
      ...collection,
      count: collection.singleton ? null : (await readCollection(collection.name)).length,
    })),
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Overview</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
          Add a blog article, upload photos, or update events, sermons, testimonies, altars and the rest of the site. Saved changes appear on the website right away.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/media" className="rounded-3xl border border-line bg-white p-6 transition-shadow hover:shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Library</p>
          <h2 className="mt-2 text-xl font-bold text-ink">Media</h2>
          <p className="mt-2 text-sm text-slate">Upload photos to use in articles, events and the gallery.</p>
        </Link>
        {counts.map((collection) => (
          <Link
            key={collection.name}
            href={`/admin/content/${collection.name}`}
            className="rounded-3xl border border-line bg-white p-6 transition-shadow hover:shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              {collection.singleton ? "Settings" : `${collection.count} ${collection.count === 1 ? "entry" : "entries"}`}
            </p>
            <h2 className="mt-2 text-xl font-bold text-ink">{collection.label}</h2>
            <p className="mt-2 text-sm text-slate">{collection.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
