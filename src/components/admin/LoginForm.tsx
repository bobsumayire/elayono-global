"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/cms/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined);

  return (
    <form action={action} className="mt-8 flex flex-col gap-4">
      {state?.error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{state.error}</p>}
      <label className="flex flex-col gap-2 text-sm font-semibold text-ink">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-2xl border border-line px-4 py-3 font-normal outline-none focus:border-brand-500"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
