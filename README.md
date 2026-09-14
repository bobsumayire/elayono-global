# Elayono Global

Website for Elayono Global, an international Christian ministry. Built with
Next.js (App Router), TypeScript and Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

All ministry content lives in typed data files under `src/data/` — edit these
to update the site, no other code changes required:

- `altars.ts` — countries/cities, service times, map position. Add an object
  here to bring a new altar online across the map, footer and locations pages.
- `sermons.ts`, `events.ts`, `ministries.ts`, `testimonies.ts`, `news.ts`,
  `founder.ts`, `gallery.ts`

Site-wide settings (name, tagline, social links, navigation) live in
`src/lib/site.ts`.

## Before Launch

A few things are intentionally placeholder and need real assets/content
before this goes live:

- **Logo** — `src/components/LogoMark.tsx` is a recreation built from the
  brand brief (cross, open Bible, dove, swoop), not the official exported
  file. Replace it with the real logo asset (ideally SVG) once available.
- **Founder portrait** — `src/components/PortraitPlaceholder.tsx` is a
  placeholder (no real photo was supplied). Swap it for an actual photo in
  the homepage and `/founder` page.
- **Sermons, events, testimonies, news** — sample/placeholder content in
  `src/data/`. Testimonies in particular should only go live once approved
  by the person quoted.
- **Forms** — `/api/contact`, `/api/prayer-request`, `/api/newsletter`
  validate input and return success but don't send email or persist
  anywhere yet. Wire them to a real provider (e.g. Resend, Mailchimp) or a
  database before launch.
- **Giving** — `/give` is informational only; no payment processing is
  wired up. Connect a real giving platform (Tithe.ly, Pushpay, Stripe, etc.)
  for the "Give Online" button.
- **Live stream embed** — `/watch-live` has a placeholder player; embed your
  actual stream source (YouTube Live, Vimeo, etc.) when available.
- Update `siteConfig` in `src/lib/site.ts` with real contact details and
  social links, and `metadataBase`/`url` before deploying.

## Stack

Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, next/font
(Manrope + Inter), next/image (remote Unsplash placeholders — replace with
real photography).
