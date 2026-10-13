import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import LoginForm from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/cms/auth";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-5">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 shadow-xl shadow-ink/5">
        <Logo />
        <h1 className="mt-8 text-2xl font-extrabold tracking-tight text-ink">Sign in</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          Manage articles, photos and the rest of the Elayono Global website.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
