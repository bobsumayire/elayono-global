import { cookies } from "next/headers";
import { platformEnv } from "@/lib/cms/store";

const COOKIE = "elayono_admin";
const MAX_AGE = 60 * 60 * 24 * 14;

async function setting(name: "ADMIN_PASSWORD" | "ADMIN_SESSION_SECRET") {
  if (process.env[name]) return process.env[name];
  const env = await platformEnv();
  return env?.[name];
}

function bytesToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return bytesToHex(signature);
}

function safeEqual(a: string, b: string) {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  const length = Math.max(left.length, right.length);
  let mismatch = left.length === right.length ? 0 : 1;
  for (let index = 0; index < length; index += 1) mismatch |= (left[index] ?? 0) ^ (right[index] ?? 0);
  return mismatch === 0;
}

export async function adminConfigured() {
  return Boolean((await setting("ADMIN_PASSWORD")) && (await setting("ADMIN_SESSION_SECRET")));
}

export async function loginAdmin(password: string) {
  const expected = await setting("ADMIN_PASSWORD");
  const secret = await setting("ADMIN_SESSION_SECRET");
  if (!expected || !secret) return "The admin password is not configured yet.";
  if (!safeEqual(password, expected)) return "That password is not correct.";

  const payload = JSON.stringify({ exp: Date.now() + MAX_AGE * 1000 });
  const token = `${btoa(payload)}.${await sign(payload, secret)}`;
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return null;
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdmin() {
  const secret = await setting("ADMIN_SESSION_SECRET");
  const token = (await cookies()).get(COOKIE)?.value;
  if (!secret || !token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  let decoded = "";
  try {
    decoded = atob(payload);
  } catch {
    return false;
  }
  const expected = await sign(decoded, secret);
  if (!safeEqual(signature, expected)) return false;
  try {
    const session = JSON.parse(decoded) as { exp?: number };
    return typeof session.exp === "number" && session.exp > Date.now();
  } catch {
    return false;
  }
}
