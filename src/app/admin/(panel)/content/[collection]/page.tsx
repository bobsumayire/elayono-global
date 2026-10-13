import Link from "next/link";
import { notFound } from "next/navigation";
import EntryForm from "@/components/admin/EntryForm";
import { documentToForm, getCollection } from "@/lib/cms/schema";
import { readCollection, readDocument } from "@/lib/cms/store";

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { collection: name } = await params;
  const { saved } = await searchParams;
  const schema = getCollection(name);
  if (!schema) notFound();

  if (schema.singleton) {
    const doc = await readDocument(schema.name, "main");
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">{schema.label}</h1>
          <p className="mt-2 text-sm text-slate">{schema.description}</p>
        </div>
        <EntryForm schema={schema} initial={documentToForm(schema, doc)} originalId="main" saved={saved === "1"} />
      </div>
    );
  }

  const entries = await readCollection(schema.name);
  const sorted = [...entries].sort((a, b) => String(b.data.date ?? "").localeCompare(String(a.data.date ?? "")));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">{schema.label}</h1>
          <p className="mt-2 text-sm text-slate">{schema.description}</p>
        </div>
        <Link href={`/admin/content/${schema.name}/new`} className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
          Add {schema.label === "Blog" ? "article" : "entry"}
        </Link>
      </div>
      {sorted.length === 0 ? (
        <p className="rounded-3xl border border-line bg-white px-6 py-10 text-sm text-slate">Nothing here yet.</p>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-line bg-white">
          {sorted.map((entry) => (
            <Link
              key={entry.id}
              href={`/admin/content/${schema.name}/${entry.id}`}
              className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 last:border-b-0 hover:bg-mist"
            >
              <span>
                <span className="block font-semibold text-ink">{String(entry.data[schema.titleKey] ?? entry.id)}</span>
                {schema.summaryKey && entry.data[schema.summaryKey] ? (
                  <span className="text-xs text-slate">{String(entry.data[schema.summaryKey])}</span>
                ) : null}
              </span>
              <span className="text-sm font-semibold text-brand-600">Edit</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
