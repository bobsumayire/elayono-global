export default function LoginForm({ error }: { error?: string }) {
  const message =
    error === "config"
      ? "The admin password is not configured yet."
      : error
        ? "That password is not correct."
        : "";

  return (
    <form action="/api/admin/login" method="post" className="mt-8 flex flex-col gap-4">
      {message && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{message}</p>}
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
        className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
      >
        Sign in
      </button>
    </form>
  );
}
