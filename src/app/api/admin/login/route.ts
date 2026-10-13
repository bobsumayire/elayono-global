import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/cms/auth";

const PUBLIC_HOSTS = new Set(["www.elayonoglobal.com", "elayonoglobal.com", "localhost:3000"]);

function redirectTo(request: Request, pathname: string, error?: string) {
  const current = new URL(request.url);
  const forwarded = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwarded && PUBLIC_HOSTS.has(forwarded) ? forwarded : current.host;
  const proto = request.headers.get("x-forwarded-proto") ?? current.protocol.replace(":", "");
  const url = new URL(pathname, `${proto}://${host}`);
  if (error) url.searchParams.set("error", error);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    let host = "";
    try {
      host = new URL(origin).host;
    } catch {
      host = "";
    }
    if (!PUBLIC_HOSTS.has(host)) return redirectTo(request, "/admin/login", "1");
  }

  const form = await request.formData();
  const error = await loginAdmin(String(form.get("password") ?? ""));
  if (error?.includes("not configured")) return redirectTo(request, "/admin/login", "config");
  if (error) return redirectTo(request, "/admin/login", "1");
  return redirectTo(request, "/admin");
}
