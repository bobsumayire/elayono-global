"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { signOut } from "@/lib/cms/actions";
import { collections } from "@/lib/cms/schema";

const links = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/media", label: "Media library" },
  ...collections.map((collection) => ({
    href: `/admin/content/${collection.name}`,
    label: collection.label,
  })),
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-mist">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink text-white lg:flex">
        <div className="border-b border-white/10 px-5 py-6">
          <Logo variant="white" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {links.map((link) => {
            const active = "exact" in link && link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active ? "bg-brand-500 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col gap-2 border-t border-white/10 p-4">
          <Link href="/" className="rounded-xl px-3 py-2 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white">
            View website
          </Link>
          <form action={signOut}>
            <button type="submit" className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-white px-5 py-4 lg:hidden">
          <Logo />
          <Link href="/" className="text-sm font-semibold text-brand-600">
            View site
          </Link>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-line bg-white px-4 py-3 lg:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="shrink-0 rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-ink">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex-1 px-5 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
