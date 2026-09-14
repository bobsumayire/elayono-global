import type { ReactElement } from "react";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";
import { altars } from "@/data/altars";
import { siteConfig } from "@/lib/site";

const socialIcons: Record<string, ReactElement> = {
  facebook: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  ),
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4.6.23 1.03.51 1.48.96.45.45.73.88.96 1.48.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4 4 0 0 1-.96 1.48 4 4 0 0 1-1.48.96c-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4 4 0 0 1-1.48-.96 4 4 0 0 1-.96-1.48c-.16-.46-.35-1.26-.4-2.43C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43.23-.6.51-1.03.96-1.48.45-.45.88-.73 1.48-.96.46-.16 1.26-.35 2.43-.4C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.74.07-.96.04-1.48.2-1.82.34-.46.18-.79.39-1.13.74-.35.34-.56.67-.74 1.13-.14.34-.3.86-.34 1.82C3.17 8.34 3.16 8.7 3.16 11.84c0 3.14.01 3.5.07 4.74.04.96.2 1.48.34 1.82.18.46.39.79.74 1.13.34.35.67.56 1.13.74.34.14.86.3 1.82.34 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c.96-.04 1.48-.2 1.82-.34.46-.18.79-.39 1.13-.74.35-.34.56-.67.74-1.13.14-.34.3-.86.34-1.82.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.04-.96-.2-1.48-.34-1.82a3.03 3.03 0 0 0-.74-1.13 3.03 3.03 0 0 0-1.13-.74c-.34-.14-.86-.3-1.82-.34C15.5 4.01 15.14 4 12 4Zm0 3.78a4.22 4.22 0 1 1 0 8.44 4.22 4.22 0 0 1 0-8.44Zm0 1.8a2.42 2.42 0 1 0 0 4.84 2.42 2.42 0 0 0 0-4.84Zm4.4-2a.99.99 0 1 1 0 1.98.99.99 0 0 1 0-1.98Z" />
    </svg>
  ),
  youtube: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.6 7.2s-.21-1.5-.86-2.16c-.82-.87-1.74-.87-2.16-.92C15.6 4 12 4 12 4h-.01s-3.6 0-6.58.12c-.42.05-1.34.05-2.16.92-.65.66-.86 2.16-.86 2.16S2.18 8.96 2.18 10.7v1.6c0 1.74.21 3.5.21 3.5s.21 1.5.86 2.16c.82.87 1.9.84 2.38.94 1.72.16 7.37.21 7.37.21s3.6 0 6.58-.13c.42-.05 1.34-.05 2.16-.92.65-.66.86-2.16.86-2.16s.21-1.74.21-3.5v-1.6c0-1.74-.21-3.5-.21-3.5ZM9.94 14.3V8.9l5.4 2.72-5.4 2.68Z" />
    </svg>
  ),
  tiktok: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.6 2h-3.2v13.6a2.8 2.8 0 1 1-2.4-2.77v-3.25a6 6 0 1 0 5.6 5.99V8.4a7.2 7.2 0 0 0 4.4 1.5V6.7a4 4 0 0 1-4.4-4.7Z" />
    </svg>
  ),
};

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-elayono py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr]">
          <div className="flex flex-col gap-5">
            <Logo variant="white" />
            <p className="text-sm leading-relaxed text-white/65 max-w-xs">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-3 pt-1">
              {Object.entries(siteConfig.social).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-colors"
                >
                  {socialIcons[key]}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Explore
            </h3>
            {[
              { label: "About Elayono Global", href: "/about" },
              { label: "Our Founder", href: "/founder" },
              { label: "Sermons", href: "/sermons" },
              { label: "Events", href: "/events" },
              { label: "Give", href: "/give" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-white/70 hover:text-brand-300 transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Our Altars
            </h3>
            {altars.map((a) => (
              <a
                key={a.slug}
                href={`/altars/${a.slug}`}
                className="text-sm text-white/70 hover:text-brand-300 transition-colors"
              >
                {a.country}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Stay Connected
            </h3>
            <p className="text-sm text-white/65">
              Get sermon updates, event announcements and ministry news from across the Elayono Global family.
            </p>
            <NewsletterForm variant="dark" />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/contact" className="hover:text-brand-300">Contact</a>
            <a href="/privacy" className="hover:text-brand-300">Privacy Policy</a>
            <a href="/terms" className="hover:text-brand-300">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
