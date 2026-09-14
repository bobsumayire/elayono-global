"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import Button from "./Button";
import { primaryNav } from "@/lib/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route change is an external event (not a prop/state derivation), so
  // resetting menu UI here is the correct sync point rather than render logic.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-line"
          : "bg-white/0 border-b border-transparent"
      }`}
    >
      <div className="container-elayono flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {primaryNav.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => link.children && setOpenDropdown(link.label)}
              onMouseLeave={() => link.children && setOpenDropdown(null)}
            >
              <Link
                href={link.href}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                  pathname === link.href
                    ? "text-brand-600 bg-brand-50"
                    : "text-ink hover:text-brand-600 hover:bg-brand-50"
                }`}
              >
                {link.label}
                {link.children && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </Link>

              {link.children && openDropdown === link.label && (
                <div className="absolute left-0 top-full pt-3 w-72 animate-fade-in">
                  <div className="rounded-2xl border border-line bg-white shadow-xl shadow-ink/5 p-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex flex-col gap-0.5 rounded-xl px-4 py-3 hover:bg-brand-50 transition-colors"
                      >
                        <span className="text-sm font-semibold text-ink">{child.label}</span>
                        {child.description && (
                          <span className="text-xs text-slate">{child.description}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button href="/prayer-request" variant="ghost" size="md">
            Prayer Request
          </Button>
          <Button href="/give" variant="primary" size="md">
            Give
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
              <path d="M0 1H18M0 7H18M0 13H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-line bg-white max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="container-elayono py-6 flex flex-col gap-1">
            {primaryNav.map((link) => (
              <div key={link.href} className="border-b border-line/70 last:border-none py-2">
                <Link
                  href={link.href}
                  className="block py-2 text-base font-semibold text-ink"
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="flex flex-col pl-3 pb-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="py-1.5 text-sm text-slate hover:text-brand-600"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <Button href="/prayer-request" variant="ghost" className="w-full justify-center">
                Prayer Request
              </Button>
              <Button href="/give" variant="primary" className="w-full justify-center">
                Give
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
