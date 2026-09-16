export type GalleryImage = {
  src: string;
  alt: string;
  tall?: boolean;
};

export const galleryImages: GalleryImage[] = [
  { src: "/photos/cta-ministries.jpg", alt: "Worship service", tall: true },
  { src: "/photos/altar-usa-canada.jpg", alt: "Congregation gathered in worship" },
  { src: "/photos/hero-watch-live.jpg", alt: "Hands raised in worship" },
  { src: "/photos/event-stockholm.jpg", alt: "Youth gathering", tall: true },
  { src: "/photos/event-paris.jpg", alt: "Community outreach" },
  { src: "/photos/event-conference.jpg", alt: "Conference gathering" },
  { src: "/photos/hero-testimonies.jpg", alt: "Fellowship among believers", tall: true },
  { src: "/photos/hero-prayer.jpg", alt: "Prayer gathering" },
  { src: "/photos/news-conference.jpg", alt: "Worship team leading praise" },
];
