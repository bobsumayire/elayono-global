import { NextResponse } from "next/server";

/**
 * Placeholder endpoint — validates the payload and returns success without
 * persisting anything. Wire this up to a real email provider (e.g. Mailchimp,
 * Resend, Brevo) before launch.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
