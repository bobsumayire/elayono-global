"use client";

import { useState, type FormEvent } from "react";

type NewsletterFormProps = {
  variant?: "light" | "dark";
};

export default function NewsletterForm({ variant = "light" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const isDark = variant === "dark";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className={`text-sm font-medium ${isDark ? "text-brand-300" : "text-brand-600"}`}>
        Thank you — you&apos;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`w-full rounded-full px-4 py-2.5 text-sm outline-none transition-colors ${
          isDark
            ? "bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:border-brand-400"
            : "bg-white text-ink placeholder:text-slate border border-line focus:border-brand-400"
        }`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
