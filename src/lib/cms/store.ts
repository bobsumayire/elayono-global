import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { seedDocuments } from "@/lib/cms/seed";
import type { CmsEnv, ContentDatabase } from "@/lib/cms/types";

type Row = { id: string; data: string };

export type Store = {
  list(collection: string): Promise<{ id: string; data: Record<string, unknown> }[]>;
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  put(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  remove(collection: string, id: string): Promise<void>;
};

const FILE = path.join(process.cwd(), ".data", "cms.json");

type FileDb = Record<string, Record<string, Record<string, unknown>>>;

let fileQueue: Promise<void> = Promise.resolve();

function locked<T>(task: () => Promise<T>): Promise<T> {
  const run = fileQueue.then(task, task);
  fileQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readFileDb(): Promise<FileDb> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as FileDb;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw error;
  }
}

async function writeFileDb(db: FileDb) {
  await mkdir(path.dirname(FILE), { recursive: true });
  const temporary = `${FILE}.tmp`;
  await writeFile(temporary, JSON.stringify(db, null, 2));
  await rename(temporary, FILE);
}

function fileStore(): Store {
  return {
    list(collection) {
      return locked(async () => {
        const db = await readFileDb();
        return Object.entries(db[collection] ?? {}).map(([id, data]) => ({ id, data }));
      });
    },
    get(collection, id) {
      return locked(async () => {
        const db = await readFileDb();
        return db[collection]?.[id] ?? null;
      });
    },
    put(collection, id, data) {
      return locked(async () => {
        const db = await readFileDb();
        db[collection] ??= {};
        db[collection][id] = data;
        await writeFileDb(db);
      });
    },
    remove(collection, id) {
      return locked(async () => {
        const db = await readFileDb();
        if (!db[collection]) return;
        delete db[collection][id];
        await writeFileDb(db);
      });
    },
  };
}

async function cloudEnv(): Promise<CmsEnv | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env as CmsEnv;
  } catch {
    return null;
  }
}

function d1Store(db: ContentDatabase): Store {
  return {
    async list(collection) {
      const result = await db
        .prepare("SELECT id, data FROM documents WHERE collection = ? ORDER BY updated_at DESC")
        .bind(collection)
        .all<Row>();
      return (result.results ?? []).map((row) => ({ id: row.id, data: JSON.parse(row.data) as Record<string, unknown> }));
    },
    async get(collection, id) {
      const row = await db.prepare("SELECT data FROM documents WHERE collection = ? AND id = ?").bind(collection, id).first<{ data: string }>();
      return row ? (JSON.parse(row.data) as Record<string, unknown>) : null;
    },
    async put(collection, id, data) {
      const now = new Date().toISOString();
      await db
        .prepare(
          `INSERT INTO documents (collection, id, data, updated_at) VALUES (?, ?, ?, ?)
           ON CONFLICT(collection, id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
        )
        .bind(collection, id, JSON.stringify(data), now)
        .run();
    },
    async remove(collection, id) {
      await db.prepare("DELETE FROM documents WHERE collection = ? AND id = ?").bind(collection, id).run();
    },
  };
}

async function prepareDatabase(db: ContentDatabase) {
  await db.exec(`CREATE TABLE IF NOT EXISTS documents (
    collection TEXT NOT NULL,
    id TEXT NOT NULL,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (collection, id)
  )`);
}

let ready: Promise<Store> | null = null;

export function openStore() {
  if (!ready) {
    ready = createStore().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}

async function createStore(): Promise<Store> {
  if (process.env.NODE_ENV !== "production") return fileStore();
  const env = await cloudEnv();
  if (!env?.CONTENT_DB) throw new Error("Content database is not connected.");
  await prepareDatabase(env.CONTENT_DB);
  return d1Store(env.CONTENT_DB);
}

export async function ensureSeeded(store: Store, collection: string) {
  const marker = await store.get("_meta", "seeded");
  const seeded = (marker ?? {}) as Record<string, boolean>;
  if (seeded[collection]) return;
  for (const record of seedDocuments(collection)) {
    const existing = await store.get(collection, record.id);
    if (!existing) await store.put(collection, record.id, record.data);
  }
  seeded[collection] = true;
  await store.put("_meta", "seeded", seeded);
}

export async function readCollection(collection: string) {
  try {
    const store = await openStore();
    await ensureSeeded(store, collection);
    return await store.list(collection);
  } catch {
    return seedDocuments(collection);
  }
}

export async function readDocument(collection: string, id: string) {
  try {
    const store = await openStore();
    await ensureSeeded(store, collection);
    return await store.get(collection, id);
  } catch {
    return seedDocuments(collection).find((record) => record.id === id)?.data ?? null;
  }
}

export async function platformEnv() {
  return cloudEnv();
}
