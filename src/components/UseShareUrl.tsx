"use client";

import { useEffect } from "react";

/** Puts the share address in the bar so a copied link is one WhatsApp has not saved before. */
export default function UseShareUrl({ path }: { path: string }) {
  useEffect(() => {
    if (window.location.pathname === path) return;
    window.history.replaceState(window.history.state, "", path);
  }, [path]);
  return null;
}
