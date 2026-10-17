import { AsyncLocalStorage } from "node:async_hooks";
import { Readable } from "node:stream";
import worker, { BucketCachePurge, DOQueueHandler, DOShardedTagCache } from "../.open-next/worker.js";

export { BucketCachePurge, DOQueueHandler, DOShardedTagCache };

const PUBLIC_HOSTS = new Set(["www.elayonoglobal.com", "elayonoglobal.com"]);
const WORKER_HOST = "elayono-global.dimerw.workers.dev";
const requestContext = new AsyncLocalStorage();
const nativeFetch = globalThis.fetch.bind(globalThis);

function publicHost(request) {
  const forwarded = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  return forwarded && PUBLIC_HOSTS.has(forwarded) ? forwarded : "";
}

function withPublicHost(request) {
  const host = publicHost(request);
  if (!host) return request;
  const url = new URL(request.url);
  if (url.host === host) return request;
  url.host = host;
  const headers = new Headers(request.headers);
  headers.set("x-forwarded-host", host);
  return new Request(url, {
    method: request.method,
    headers,
    body: request.body,
    redirect: "manual",
    duplex: request.body ? "half" : undefined,
  });
}

function requestUrl(input) {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function isOwnHost(url) {
  return PUBLIC_HOSTS.has(url.host) || url.host === WORKER_HOST;
}

function headerValue(headers, name) {
  if (!headers) return "";
  if (typeof headers.get === "function") return headers.get(name) ?? "";
  const value = headers[name] ?? headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

globalThis.fetch = async (input, init) => {
  const url = new URL(requestUrl(input), "https://elayono-global.dimerw.workers.dev");
  const headers = init?.headers ?? (input instanceof Request ? input.headers : undefined);
  const internal = headerValue(headers, "x-action-forwarded") === "1" || headerValue(headers, "rsc") === "1";
  const store = requestContext.getStore();
  if (store && internal && isOwnHost(url) && headerValue(headers, "x-elayono-internal") !== "1") {
    const nextHeaders = new Headers(headers);
    nextHeaders.set("x-elayono-internal", "1");
    let body = init?.body;
    if (body && typeof body === "object" && typeof body.pipe === "function") body = Readable.toWeb(body);
    const request = new Request(url, {
      method: init?.method ?? (input instanceof Request ? input.method : "GET"),
      headers: nextHeaders,
      body,
      redirect: "manual",
      duplex: body ? "half" : undefined,
    });
    return worker.fetch(request, store.env, store.ctx);
  }
  return nativeFetch(input, init);
};

async function shareJpeg(request, env) {
  if (request.method !== "GET" || !env?.MEDIA) return null;
  const match = new URL(request.url).pathname.match(/^\/i\/([a-f0-9]+)\.jpg$/);
  if (!match) return null;
  const object = await env.MEDIA.get(`i-${match[1]}.jpg`);
  if (!object) return null;
  const bytes = await object.arrayBuffer();
  return new Response(bytes, {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const image = await shareJpeg(request, env);
    if (image) return image;
    return requestContext.run({ env, ctx }, () => worker.fetch(withPublicHost(request), env, ctx));
  },
};
