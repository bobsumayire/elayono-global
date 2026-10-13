import Link from "next/link";
import { notFound } from "next/navigation";
import EntryForm from "@/components/admin/EntryForm";
import { documentToForm, getCollection } from "@/lib/cms/schema";
import { readDocument } from "@/lib/cms/store";

export default async function EntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string; id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { collection: name, id } = await params;
  const { saved } = await searchParams;
  const schema = getCollection(name);
  if (!schema || schema.singleton) notFound();

  const doc = id === "new" ? null : await readDocument(schema.name, id);
  if (id !== "new" && !doc) notFound();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <Link href={`/admin/content/${schema.name}`} className="text-sm font-semibold text-brand-600">
          ← {schema.label}
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">
          {id === "new" ? `New ${schema.label === "Blog" ? "article" : "entry"}` : String(doc?.[schema.titleKey] ?? "Edit")}
        </h1>
      </div>
      <EntryForm schema={schema} initial={documentToForm(schema, doc)} originalId={id} saved={saved === "1"} />
    </div>
  );
}
