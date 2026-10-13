import type { BlogBlock } from "@/data/blog";
import { blocksToText, textToBlocks } from "@/lib/cms/blocks";

export type FieldType = "text" | "textarea" | "date" | "select" | "checkbox" | "image" | "lines" | "pairs" | "blocks" | "number";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  help?: string;
  placeholder?: string;
};

export type CollectionSchema = {
  name: string;
  label: string;
  description: string;
  idKey: string;
  titleKey: string;
  summaryKey?: string;
  singleton?: boolean;
  fields: Field[];
  blank: () => Record<string, string>;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const collections: CollectionSchema[] = [
  {
    name: "blog",
    label: "Blog",
    description: "Articles and ministry news.",
    idKey: "slug",
    titleKey: "title",
    summaryKey: "date",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL name", type: "text", required: true, help: "Lowercase words separated by hyphens. This becomes the link." },
      { key: "date", label: "Date", type: "date", required: true },
      { key: "category", label: "Category", type: "select", options: ["News", "Article"], required: true },
      { key: "author", label: "Author", type: "text", placeholder: "Elayono Global" },
      { key: "excerpt", label: "Excerpt", type: "textarea", required: true, help: "Shown on the blog list and in link previews." },
      { key: "image", label: "Cover image", type: "image" },
      { key: "published", label: "Published", type: "checkbox", help: "Only published posts appear on the website." },
      {
        key: "body",
        label: "Story",
        type: "blocks",
        help: "Blank line between paragraphs. Start a line with ## for a heading, > for a quote, or - for a list item.",
      },
    ],
    blank: () => ({
      title: "",
      slug: "",
      date: new Date().toISOString().slice(0, 10),
      category: "News",
      author: "Elayono Global",
      excerpt: "",
      image: "",
      published: "false",
      body: "",
    }),
  },
  {
    name: "events",
    label: "Events",
    description: "Conferences, services and gatherings.",
    idKey: "slug",
    titleKey: "title",
    summaryKey: "date",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL name", type: "text", required: true },
      { key: "date", label: "Start date", type: "date", required: true },
      { key: "endDate", label: "End date", type: "date", help: "Leave blank for a one-day event." },
      { key: "time", label: "Time", type: "text", required: true, placeholder: "1:00 PM - 9:00 PM" },
      { key: "location", label: "Location", type: "text", required: true },
      { key: "altarSlug", label: "Altar", type: "text", placeholder: "usa-canada", help: "usa-canada, belgium, france, or sweden." },
      { key: "category", label: "Category", type: "select", options: ["Conference", "Service", "Outreach", "Prayer", "Youth"], required: true },
      { key: "summary", label: "Summary", type: "textarea", required: true },
      { key: "image", label: "Poster", type: "image", required: true },
      { key: "whatsapp", label: "WhatsApp number", type: "text", placeholder: "12679399460", help: "Country code and number, digits only." },
    ],
    blank: () => ({
      title: "",
      slug: "",
      date: new Date().toISOString().slice(0, 10),
      endDate: "",
      time: "",
      location: "",
      altarSlug: "",
      category: "Service",
      summary: "",
      image: "",
      whatsapp: "",
    }),
  },
  {
    name: "sermons",
    label: "Sermons",
    description: "Messages shown on the sermons page and homepage.",
    idKey: "slug",
    titleKey: "title",
    summaryKey: "date",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL name", type: "text", required: true },
      { key: "speaker", label: "Speaker", type: "text", required: true },
      { key: "series", label: "Series", type: "text" },
      { key: "date", label: "Date", type: "date", required: true },
      { key: "duration", label: "Duration", type: "text", placeholder: "1h 20m" },
      { key: "summary", label: "Summary", type: "textarea", required: true },
      { key: "thumbnail", label: "Thumbnail", type: "image", required: true },
      { key: "videoUrl", label: "Video link", type: "text", placeholder: "https://www.youtube.com/watch?v=" },
    ],
    blank: () => ({
      title: "",
      slug: "",
      speaker: "Rev Prophet Ernest NYIRINDEKWE",
      series: "",
      date: new Date().toISOString().slice(0, 10),
      duration: "",
      summary: "",
      thumbnail: "",
      videoUrl: "",
    }),
  },
  {
    name: "gallery",
    label: "Gallery",
    description: "Photos on the Media page.",
    idKey: "id",
    titleKey: "alt",
    fields: [
      { key: "src", label: "Photo", type: "image", required: true },
      { key: "alt", label: "Description", type: "text", required: true },
      { key: "tall", label: "Tall frame", type: "checkbox" },
    ],
    blank: () => ({ src: "", alt: "", tall: "false" }),
  },
  {
    name: "testimonies",
    label: "Testimonies",
    description: "Written stories on the testimonies page and homepage.",
    idKey: "id",
    titleKey: "name",
    summaryKey: "altar",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "altar", label: "Altar", type: "text", required: true },
      { key: "quote", label: "Story", type: "textarea", required: true },
      { key: "image", label: "Photo", type: "image" },
    ],
    blank: () => ({ name: "", altar: "", quote: "", image: "" }),
  },
  {
    name: "testimonyVideos",
    label: "Testimony videos",
    description: "YouTube testimonies on the testimonies page.",
    idKey: "youtubeId",
    titleKey: "title",
    fields: [
      { key: "youtubeId", label: "YouTube video ID", type: "text", required: true, help: "The ID at the end of a YouTube link, after watch?v=" },
      { key: "title", label: "Title", type: "text", required: true },
    ],
    blank: () => ({ youtubeId: "", title: "" }),
  },
  {
    name: "altars",
    label: "Altars",
    description: "Locations, service times and the global map.",
    idKey: "slug",
    titleKey: "country",
    summaryKey: "region",
    fields: [
      { key: "country", label: "Country", type: "text", required: true },
      { key: "slug", label: "URL name", type: "text", required: true },
      { key: "region", label: "Region", type: "text", required: true, placeholder: "Europe" },
      { key: "cities", label: "Cities", type: "lines", required: true, help: "One city per line." },
      { key: "summary", label: "Summary", type: "textarea", required: true },
      { key: "serviceTimes", label: "Service times", type: "pairs", required: true, help: "One per line, written as Label | Time." },
      { key: "address", label: "Address", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "mapX", label: "Map position, left to right", type: "number", required: true, help: "A number from 0 to 100." },
      { key: "mapY", label: "Map position, top to bottom", type: "number", required: true, help: "A number from 0 to 100." },
      { key: "heroImage", label: "Photo", type: "image", required: true },
    ],
    blank: () => ({
      country: "",
      slug: "",
      region: "",
      cities: "",
      summary: "",
      serviceTimes: "Sunday Worship | 10:00 AM",
      address: "",
      email: "",
      phone: "",
      mapX: "50",
      mapY: "40",
      heroImage: "",
    }),
  },
  {
    name: "ministries",
    label: "Ministries",
    description: "Ministry cards on the homepage and ministries page.",
    idKey: "slug",
    titleKey: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "URL name", type: "text", required: true },
      { key: "summary", label: "Summary", type: "textarea", required: true },
      { key: "icon", label: "Icon", type: "select", required: true, options: ["worship", "prayer", "youth", "children", "missions", "media", "women", "men"] },
    ],
    blank: () => ({ name: "", slug: "", summary: "", icon: "worship" }),
  },
  {
    name: "founder",
    label: "Founder",
    description: "The founder biography on the homepage and founder page.",
    idKey: "id",
    titleKey: "name",
    singleton: true,
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "initials", label: "Initials", type: "text", required: true, help: "Shown until a portrait photo is added." },
      { key: "shortBio", label: "Short biography", type: "textarea", required: true },
      { key: "bioParagraphs", label: "Full biography", type: "lines", required: true, help: "One paragraph per line." },
      { key: "portrait", label: "Portrait", type: "image" },
    ],
    blank: () => ({ name: "", title: "", initials: "", shortBio: "", bioParagraphs: "", portrait: "" }),
  },
  {
    name: "site",
    label: "Site settings",
    description: "Name, contact details and social links used across the website.",
    idKey: "id",
    titleKey: "name",
    singleton: true,
    fields: [
      { key: "name", label: "Site name", type: "text", required: true },
      { key: "legalName", label: "Legal name", type: "text", required: true },
      { key: "founder", label: "Founder name", type: "text", required: true },
      { key: "tagline", label: "Tagline", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "url", label: "Website address", type: "text", required: true },
      { key: "email", label: "Email", type: "text", required: true },
      { key: "phone", label: "Phone", type: "text", required: true },
      { key: "facebook", label: "Facebook", type: "text" },
      { key: "instagram", label: "Instagram", type: "text" },
      { key: "youtube", label: "YouTube", type: "text" },
      { key: "tiktok", label: "TikTok", type: "text" },
    ],
    blank: () => ({
      name: "",
      legalName: "",
      founder: "",
      tagline: "",
      description: "",
      url: "",
      email: "",
      phone: "",
      facebook: "",
      instagram: "",
      youtube: "",
      tiktok: "",
    }),
  },
];

export function getCollection(name: string) {
  return collections.find((collection) => collection.name === name);
}

export function parseEntry(schema: CollectionSchema, values: Record<string, string>, originalId: string) {
  const required = schema.fields.find((field) => field.required && !values[field.key]?.trim());
  if (required) throw new Error(`${required.label} is required.`);

  const id = resolveId(schema, values, originalId);
  if (!schema.singleton && schema.idKey === "slug" && !slugPattern.test(id)) {
    throw new Error("URL name must use lowercase letters, numbers and hyphens.");
  }
  if (schema.name === "testimonyVideos" && !/^[\w-]{6,}$/.test(id)) {
    throw new Error("Enter the YouTube video ID, not the full link.");
  }

  const data: Record<string, unknown> = { [schema.idKey]: id };

  for (const field of schema.fields) {
    const raw = values[field.key]?.trim() ?? "";
    if (field.type === "checkbox") {
      data[field.key] = values[field.key] === "true";
      continue;
    }
    if (field.type === "lines") {
      data[field.key] = raw.split("\n").map((line) => line.trim()).filter(Boolean);
      continue;
    }
    if (field.type === "pairs") {
      data[field.key] = raw.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
        const [label, ...rest] = line.split("|");
        return { label: label.trim(), time: rest.join("|").trim() };
      }).filter((item) => item.label && item.time);
      continue;
    }
    if (field.type === "blocks") {
      data[field.key] = textToBlocks(values[field.key] ?? "");
      continue;
    }
    if (field.type === "number") {
      const number = Number(raw);
      if (!Number.isFinite(number)) throw new Error(`${field.label} must be a number.`);
      data[field.key] = number;
      continue;
    }
    if (raw) data[field.key] = raw;
  }

  if (schema.name === "altars") {
    data.map = { x: data.mapX, y: data.mapY };
    delete data.mapX;
    delete data.mapY;
    data.cities = data.cities ?? [];
    data.serviceTimes = data.serviceTimes ?? [];
  }
  if (schema.name === "site") {
    data.social = {
      facebook: values.facebook?.trim() ?? "",
      instagram: values.instagram?.trim() ?? "",
      youtube: values.youtube?.trim() ?? "",
      tiktok: values.tiktok?.trim() ?? "",
    };
    delete data.facebook;
    delete data.instagram;
    delete data.youtube;
    delete data.tiktok;
  }
  if (schema.name === "blog") {
    data.published = values.published === "true";
    data.body = data.body ?? [];
    data.category = values.category === "Article" ? "Article" : "News";
  }
  if (schema.name === "gallery") data.tall = values.tall === "true";

  return { id, data };
}

function resolveId(schema: CollectionSchema, values: Record<string, string>, originalId: string) {
  if (schema.singleton) return "main";
  const fromField = schema.fields.some((field) => field.key === schema.idKey) ? values[schema.idKey]?.trim() : "";
  if (fromField) return schema.idKey === "slug" ? slugify(fromField) : fromField;
  if (originalId && originalId !== "new") return originalId;
  return crypto.randomUUID();
}

export function documentToForm(schema: CollectionSchema, doc: Record<string, unknown> | null): Record<string, string> {
  const source: Record<string, unknown> = doc ? { ...doc } : {};
  if (schema.name === "altars" && source.map && typeof source.map === "object") {
    const map = source.map as { x?: number; y?: number };
    source.mapX = map.x ?? "";
    source.mapY = map.y ?? "";
  }
  if (schema.name === "site" && source.social && typeof source.social === "object") {
    Object.assign(source, source.social);
  }

  const blank = schema.blank();
  if (!doc) return blank;

  for (const field of schema.fields) {
    const value = source[field.key];
    if (field.type === "checkbox") blank[field.key] = value ? "true" : "false";
    else if (field.type === "lines") blank[field.key] = Array.isArray(value) ? value.join("\n") : "";
    else if (field.type === "pairs") {
      blank[field.key] = Array.isArray(value)
        ? value.map((item) => `${(item as { label?: string }).label ?? ""} | ${(item as { time?: string }).time ?? ""}`).join("\n")
        : "";
    } else if (field.type === "blocks") blank[field.key] = blocksToText(Array.isArray(value) ? (value as BlogBlock[]) : []);
    else if (value == null) blank[field.key] = "";
    else blank[field.key] = String(value);
  }
  return blank;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
