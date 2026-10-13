type SqlStatement = {
  bind(...values: (string | number | null)[]): SqlStatement;
  run(): Promise<unknown>;
  all<T>(): Promise<{ results?: T[] }>;
  first<T>(): Promise<T | null>;
};

export type ContentDatabase = {
  exec(query: string): Promise<unknown>;
  prepare(query: string): SqlStatement;
};

export type MediaBucket = {
  put(
    key: string,
    value: ArrayBuffer,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
  get(key: string): Promise<{
    body: ReadableStream;
    httpMetadata?: { contentType?: string };
  } | null>;
  delete(key: string): Promise<unknown>;
  list(options?: { limit?: number }): Promise<{ objects: { key: string }[] }>;
};

export type CmsEnv = {
  CONTENT_DB?: ContentDatabase;
  MEDIA?: MediaBucket;
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
};
