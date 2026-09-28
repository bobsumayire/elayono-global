"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  title: string;
  text: string;
  /** Path on this site to share, e.g. `/events#my-event`. */
  path: string;
};

type Platform = {
  label: string;
  icon: React.ReactNode;
  href: (url: string, message: string, title: string) => string;
};

const platforms: Platform[] = [
  {
    label: "WhatsApp",
    icon: <WhatsAppIcon />,
    href: (url, message) => `https://wa.me/?text=${encodeURIComponent(`${message}\n${url}`)}`,
  },
  {
    label: "Facebook",
    icon: <FacebookIcon />,
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    label: "X (Twitter)",
    icon: <XIcon />,
    href: (url, message) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
  },
  {
    label: "Telegram",
    icon: <TelegramIcon />,
    href: (url, message) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`,
  },
  {
    label: "Email",
    icon: <MailIcon />,
    href: (url, message, title) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${message}\n\n${url}`)}`,
  },
];

export default function ShareEventButton({ title, text, path }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClickAway = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, [open]);

  const shareUrl = () => `${window.location.origin}${path}`;

  const openPlatform = (platform: Platform) => {
    setOpen(false);
    const href = platform.href(shareUrl(), text, title);
    if (href.startsWith("mailto:")) {
      window.location.href = href;
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", shareUrl());
    }
  };

  const nativeShare = async () => {
    setOpen(false);
    try {
      await navigator.share({ title, text, url: shareUrl() });
    } catch {
      // Visitor dismissed the share sheet — nothing to do.
    }
  };

  const itemClass =
    "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-brand-50";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Share ${title}`}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand-500 hover:text-brand-600"
      >
        <ShareIcon /> Share
      </button>

      {open && (
        <div className="absolute inset-x-0 bottom-full z-10 mb-2 animate-fade-in rounded-2xl border border-line bg-white p-2 shadow-xl shadow-ink/5">
          <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-slate">
            Share via
          </p>
          {platforms.map((p) => (
            <button key={p.label} type="button" onClick={() => openPlatform(p)} className={itemClass}>
              {p.icon} {p.label}
            </button>
          ))}
          <button type="button" onClick={copyLink} className={itemClass}>
            <LinkIcon /> {copied ? "Link copied!" : "Copy link"}
          </button>
          {canNativeShare && (
            <button type="button" onClick={nativeShare} className={itemClass}>
              <MoreIcon /> More options…
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="12" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12.5" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.8 7 10.2 4.5M5.8 9l4.4 2.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 1.3a6.7 6.7 0 0 0-5.7 10.2L1.3 14.7l3.3-1a6.7 6.7 0 1 0 3.4-12.4Zm0 12.1a5.4 5.4 0 0 1-2.75-.75l-.2-.12-2 .53.53-1.94-.13-.2A5.4 5.4 0 1 1 8 13.4Zm3-4a1.6 1.6 0 0 1-1 .5c-.27.05-.62.08-1.85-.4a6.5 6.5 0 0 1-2.5-2.2c-.4-.5-.65-1.1-.5-1.6.1-.35.4-.5.55-.6.13-.08.28-.08.4-.05l.35.05c.12.02.28-.02.44.33.17.4.55 1.4.6 1.5.05.1.08.22.02.35-.06.13-.1.2-.2.3l-.28.3c-.1.1-.2.2-.08.4.12.2.5.85 1.1 1.35.75.65 1.35.85 1.55.95.2.1.32.08.44-.05l.5-.6c.15-.2.3-.16.5-.1l1.2.55c.14.06.24.1.28.16.05.08.05.42-.1.8Z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M9.2 14.7V8.6h2l.3-2.4H9.2V4.7c0-.7.2-1.2 1.2-1.2h1.2V1.4A16 16 0 0 0 9.8 1.3C8 1.3 6.8 2.4 6.8 4.4v1.8h-2v2.4h2v6.1h2.4Z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M12.2 1.5h2.2L9.6 7l5.6 7.5h-4.4L7.4 10l-3.9 4.5H1.3l5.1-5.9L1 1.5h4.5l3.1 4.1 3.6-4.1Zm-.8 11.7h1.2L4.7 2.7H3.4l8 10.5Z" />
    </svg>
  );
}
function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M14.6 2.3 1.9 7.2c-.9.3-.9.8-.2 1l3.3 1 1.2 3.9c.2.4.1.6.5.6.3 0 .4-.1.6-.3l1.6-1.5 3.3 2.4c.6.3 1 .2 1.2-.6l2.2-10.3c.2-.9-.3-1.3-1-1.1ZM5.6 9l6.2-3.9c.3-.2.6-.1.4.1l-5.1 4.6-.2 2.2L5.6 9Z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.8" y="3.3" width="12.4" height="9.4" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="m2.5 4.3 5.5 4.2 5.5-4.2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6.7 9.3a3 3 0 0 0 4.2 0l2.2-2.2a3 3 0 0 0-4.2-4.2l-.8.8M9.3 6.7a3 3 0 0 0-4.2 0L2.9 8.9a3 3 0 0 0 4.2 4.2l.8-.8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="3.5" cy="8" r="1.3" />
      <circle cx="8" cy="8" r="1.3" />
      <circle cx="12.5" cy="8" r="1.3" />
    </svg>
  );
}
