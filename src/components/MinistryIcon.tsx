import type { Ministry } from "@/data/ministries";

const paths: Record<Ministry["icon"], string> = {
  worship: "M12 3v12M8 7l4-4 4 4M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6",
  prayer: "M12 21c-4-3-8-6.2-8-10.4C4 7 6.5 4.5 9.7 4.5c1.6 0 2.9.7 3.3 1.8.4-1.1 1.7-1.8 3.3-1.8 3.2 0 5.7 2.5 5.7 6.1 0 4.2-4 7.4-8 10.4-.7-.4-1.3-.9-2-1.4",
  youth: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9c0-3.9 3.1-7 7-7s7 3.1 7 7",
  children: "M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 13v-4a5 5 0 0 1 10 0v4M7 13l-3 3M17 13l3 3",
  missions: "M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  media: "M4 6h16v11H4zM9 9.5v4l4-2ZM8 20h8",
  women: "M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 10v8m-4-4h8",
  men: "M14 10a4 4 0 1 0-4-4M16 4h4v4M10 10 20 0M6 22v-6a4 4 0 0 1 8 0v6",
};

export default function MinistryIcon({ icon, className }: { icon: Ministry["icon"]; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d={paths[icon]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
