export const siteConfig = {
  name: "Elayono Global",
  legalName: "Elayono Global",
  founder: "Rev Prophet Ernest NYIRINDEKWE",
  tagline: "One Family. One Faith. A Global Mission.",
  description:
    "Elayono Global is a growing international Christian ministry committed to proclaiming the Gospel, transforming lives, building faith and raising a generation for God's purpose.",
  url: "https://www.elayonoglobal.org",
  email: "info@elayonoglobal.org",
  phone: "+1 (000) 000-0000",
  social: {
    facebook: "https://facebook.com/elayonoglobal",
    instagram: "https://instagram.com/elayonoglobal",
    youtube: "https://youtube.com/@elayonoglobal",
    tiktok: "https://tiktok.com/@elayonoglobal",
  },
};

export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const primaryNav: NavLink[] = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Elayono Global", href: "/about", description: "Our story, vision and beliefs" },
      { label: "Our Founder", href: "/founder", description: "Rev Prophet Ernest NYIRINDEKWE" },
      { label: "Ministries", href: "/ministries", description: "How we serve the body of Christ" },
    ],
  },
  {
    label: "Media",
    href: "/sermons",
    children: [
      { label: "Sermons & Teachings", href: "/sermons", description: "Watch and listen on demand" },
      { label: "Watch Live", href: "/watch-live", description: "Join a service in real time" },
      { label: "Gallery", href: "/media", description: "Photos and highlights" },
      { label: "News & Articles", href: "/news", description: "Updates from across the ministry" },
    ],
  },
  { label: "Events", href: "/events" },
  { label: "Altars", href: "/altars" },
  { label: "Testimonies", href: "/testimonies" },
  { label: "Contact", href: "/contact" },
];
