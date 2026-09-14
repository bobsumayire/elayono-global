import { NextResponse } from "next/server";

/**
 * Placeholder endpoint — validates the payload and returns success without
 * sending anything. Wire this up to a real email provider before launch.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please provide your name, a valid email, and a message." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
