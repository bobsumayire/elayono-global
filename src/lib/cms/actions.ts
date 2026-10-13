"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { isAdmin, loginAdmin, logoutAdmin } from "@/lib/cms/auth";
import { deleteMedia, saveMedia } from "@/lib/cms/media";
import { getCollection, parseEntry } from "@/lib/cms/schema";
import { ensureSeeded, openStore } from "@/lib/cms/store";

async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

function rethrowRedirect(error: unknown) {
  if (isRedirectError(error)) throw error;
}

export async function signIn(_state: { error: string } | undefined, formData: FormData) {
  const error = await loginAdmin(String(formData.get("password") ?? ""));
  if (error) return { error };
  redirect("/admin");
}

export async function signOut() {
  await logoutAdmin();
  redirect("/admin/login");
}

export async function saveEntry(collection: string, originalId: string, values: Record<string, string>) {
  await requireAdmin();
  const schema = getCollection(collection);
  if (!schema) return { error: "That section does not exist." };
  try {
    const parsed = parseEntry(schema, values, originalId);
    const store = await openStore();
    await ensureSeeded(store, collection);
    if (originalId && originalId !== "new" && originalId !== parsed.id) await store.remove(collection, originalId);
    await store.put(collection, parsed.id, parsed.data);
    revalidatePath("/", "layout");
    redirect(schema.singleton ? `/admin/content/${collection}?saved=1` : `/admin/content/${collection}/${parsed.id}?saved=1`);
  } catch (error) {
    rethrowRedirect(error);
    return { error: error instanceof Error ? error.message : "The entry could not be saved." };
  }
}

export async function removeEntry(collection: string, id: string) {
  await requireAdmin();
  const schema = getCollection(collection);
  if (!schema || schema.singleton) return { error: "That entry cannot be deleted." };
  const store = await openStore();
  await store.remove(collection, id);
  revalidatePath("/", "layout");
  redirect(`/admin/content/${collection}`);
}

export async function uploadImage(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image to upload." };
  try {
    const saved = await saveMedia(file);
    return { url: saved.url };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The image could not be uploaded." };
  }
}

export async function removeImage(key: string) {
  await requireAdmin();
  try {
    await deleteMedia(key);
    revalidatePath("/admin/media");
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The image could not be removed." };
  }
}
