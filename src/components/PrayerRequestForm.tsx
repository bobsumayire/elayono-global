"use client";

import { useState, type FormEvent, type ReactNode } from "react";

const categories = ["Healing", "Family", "Finances", "Salvation", "Guidance", "Thanksgiving", "Other"];

export default function PrayerRequestForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/prayer-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          altar: data.get("altar"),
          category: data.get("category"),
          request: data.get("request"),
          confidential: data.get("confidential") === "on",
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
        <h3 className="text-xl font-bold text-ink">Your request has been received</h3>
        <p className="mt-2 text-slate">
          Our prayer team is standing with you in faith. Thank you for trusting us with this.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="name">
          <input id="name" name="name" required className={inputClass} />
        </Field>
        <Field label="Email Address" htmlFor="email">
          <input id="email" name="email" type="email" required className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nearest Altar (optional)" htmlFor="altar">
          <select id="altar" name="altar" className={inputClass}>
            <option value="">Select an altar</option>
            <option>USA &amp; Canada</option>
            <option>Belgium</option>
            <option>France</option>
            <option>Sweden</option>
            <option>Online / Other</option>
          </select>
        </Field>
        <Field label="Category" htmlFor="category">
          <select id="category" name="category" className={inputClass}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Your Prayer Request" htmlFor="request">
        <textarea id="request" name="request" required rows={5} className={inputClass} />
      </Field>

      <label className="flex items-start gap-3 text-sm text-slate">
        <input type="checkbox" name="confidential" className="mt-1 h-4 w-4 rounded border-line text-brand-500 focus:ring-brand-400" />
        Keep my request confidential to the prayer team only.
      </label>

      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60 sm:w-fit"
      >
        {status === "loading" ? "Sending…" : "Submit Prayer Request"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}
