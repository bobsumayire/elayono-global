import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), ".open-next/server-functions/default/handler.mjs");
const prefix = path.join(process.cwd(), ".open-next/server-functions/default") + path.sep;
const source = readFileSync(file, "utf8");
const next = source.split(prefix).join("./");

if (next === source) {
  console.log("Worker imports already use relative paths.");
} else {
  writeFileSync(file, next);
  console.log("Rewrote share-image imports so Cloudflare can find them.");
}
