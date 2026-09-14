export type Ministry = {
  slug: string;
  name: string;
  summary: string;
  icon: "worship" | "prayer" | "youth" | "children" | "missions" | "media" | "women" | "men";
};

export const ministries: Ministry[] = [
  {
    slug: "worship",
    name: "Worship & Creative Arts",
    summary: "Leading the global family into the presence of God through music, song and the arts.",
    icon: "worship",
  },
  {
    slug: "prayer",
    name: "Prayer Ministry",
    summary: "Sustaining a culture of intercession across every altar, day and night.",
    icon: "prayer",
  },
  {
    slug: "youth",
    name: "Youth Ministry",
    summary: "Raising a generation grounded in faith, purpose and godly leadership.",
    icon: "youth",
  },
  {
    slug: "children",
    name: "Children's Ministry",
    summary: "Nurturing the next generation with age-appropriate teaching of God's Word.",
    icon: "children",
  },
  {
    slug: "missions",
    name: "Missions & Outreach",
    summary: "Extending the Gospel and practical compassion into communities and new nations.",
    icon: "missions",
  },
  {
    slug: "media",
    name: "Media Ministry",
    summary: "Carrying sermons, teachings and testimonies to a global audience online.",
    icon: "media",
  },
  {
    slug: "women",
    name: "Women's Fellowship",
    summary: "Building, equipping and encouraging women across the Elayono Global family.",
    icon: "women",
  },
  {
    slug: "men",
    name: "Men's Fellowship",
    summary: "Discipling men to lead with integrity in faith, family and community.",
    icon: "men",
  },
];
