import { NextResponse } from "next/server";

/**
 * Placeholder endpoint — validates the payload and returns success without
 * persisting or emailing anything. Wire this up to the prayer team's real
 * inbox or CRM (e.g. via Resend, a database, or a ministry CRM) before launch.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const request_text = typeof body?.request === "string" ? body.request.trim() : "";

  if (!name || !request_text || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please provide your name, a valid email, and your prayer request." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
