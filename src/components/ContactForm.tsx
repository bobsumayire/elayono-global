"use client";

import { useState, type FormEvent } from "react";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
        <h3 className="text-xl font-bold text-ink">Message sent</h3>
        <p className="mt-2 text-slate">Thank you for reaching out — our team will respond soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-name" className="text-sm font-semibold text-ink">Full Name</label>
          <input id="c-name" name="name" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="c-email" className="text-sm font-semibold text-ink">Email Address</label>
          <input id="c-email" name="email" type="email" required className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="c-subject" className="text-sm font-semibold text-ink">Subject</label>
        <input id="c-subject" name="subject" required className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="c-message" className="text-sm font-semibold text-ink">Message</label>
        <textarea id="c-message" name="message" required rows={5} className={inputClass} />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60 sm:w-fit"
      >
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
