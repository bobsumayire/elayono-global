"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  phone: string; // digits only, with country code
  message: string;
};

type AppChoice = "personal" | "business";

/**
 * Opens the chosen WhatsApp app via its own deep link. Some phones have both
 * WhatsApp and WhatsApp Business installed, and both register the same
 * generic `whatsapp://` scheme, so the OS can't tell them apart on its own —
 * we target each app's own scheme (and, on Android, its package via an
 * intent link) and fall back to the universal wa.me link if that app isn't
 * installed.
 */
function openWhatsApp(choice: AppChoice, phone: string, message: string) {
  const text = encodeURIComponent(message);
  const fallbackUrl = `https://wa.me/${phone}?text=${text}`;
  const ua = navigator.userAgent;
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  if (!isAndroid && !isIOS) {
    window.open(fallbackUrl, "_blank", "noopener,noreferrer");
    return;
  }

  let deepLink: string;
  if (isAndroid) {
    const pkg = choice === "business" ? "com.whatsapp.w4b" : "com.whatsapp";
    deepLink = `intent://send?phone=${phone}&text=${text}#Intent;scheme=whatsapp;package=${pkg};S.browser_fallback_url=${encodeURIComponent(
      fallbackUrl
    )};end`;
  } else {
    deepLink = choice === "business" ? `whatsappbusiness://send?phone=${phone}&text=${text}` : `whatsapp://send?phone=${phone}&text=${text}`;
  }

  // iOS has no built-in fallback for a missing app, so time it out ourselves:
  // if the tab is still visible shortly after trying the deep link, the app
  // wasn't there to catch it and we hand off to the universal wa.me link.
  if (isIOS) {
    const start = Date.now();
    window.location.href = deepLink;
    setTimeout(() => {
      if (!document.hidden && Date.now() - start < 2500) {
        window.location.href = fallbackUrl;
      }
    }, 1200);
  } else {
    window.location.href = deepLink;
  }
}

export default function WhatsAppRegisterButton({ phone, message }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const choose = (choice: AppChoice) => {
    setOpen(false);
    openWhatsApp(choice, phone, message);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
      >
        <WhatsAppIcon /> Register on WhatsApp
      </button>

      {open && (
        <div className="absolute inset-x-0 bottom-full z-10 mb-2 animate-fade-in rounded-2xl border border-line bg-white p-2 shadow-xl shadow-ink/5">
          <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-slate">
            Open with
          </p>
          <button
            type="button"
            onClick={() => choose("personal")}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-brand-50"
          >
            <WhatsAppIcon /> WhatsApp
          </button>
          <button
            type="button"
            onClick={() => choose("business")}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-brand-50"
          >
            <WhatsAppIcon /> WhatsApp Business
          </button>
        </div>
      )}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 1.3a6.7 6.7 0 0 0-5.7 10.2L1.3 14.7l3.3-1a6.7 6.7 0 1 0 3.4-12.4Zm0 12.1a5.4 5.4 0 0 1-2.75-.75l-.2-.12-2 .53.53-1.94-.13-.2A5.4 5.4 0 1 1 8 13.4Zm3-4a1.6 1.6 0 0 1-1 .5c-.27.05-.62.08-1.85-.4a6.5 6.5 0 0 1-2.5-2.2c-.4-.5-.65-1.1-.5-1.6.1-.35.4-.5.55-.6.13-.08.28-.08.4-.05l.35.05c.12.02.28-.02.44.33.17.4.55 1.4.6 1.5.05.1.08.22.02.35-.06.13-.1.2-.2.3l-.28.3c-.1.1-.2.2-.08.4.12.2.5.85 1.1 1.35.75.65 1.35.85 1.55.95.2.1.32.08.44-.05l.5-.6c.15-.2.3-.16.5-.1l1.2.55c.14.06.24.1.28.16.05.08.05.42-.1.8Z" />
    </svg>
  );
}
