import type { BlogBlock } from "@/data/blog";

export function blocksToText(blocks: BlogBlock[] | undefined): string {
  if (!blocks?.length) return "";
  return blocks
    .map((block) => {
      if (typeof block === "string") return block;
      if ("heading" in block) return `## ${block.heading}`;
      if ("quote" in block) return `> ${block.quote}`;
      if ("image" in block) return block.caption ? `! ${block.image} | ${block.caption}` : `! ${block.image}`;
      return block.list.map((item) => `- ${item}`).join("\n");
    })
    .join("\n\n");
}

export function textToBlocks(text: string): BlogBlock[] {
  const blocks: BlogBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] | null = null;

  const flushParagraph = () => {
    const value = paragraph.join(" ").trim();
    if (value) blocks.push(value);
    paragraph = [];
  };
  const flushList = () => {
    if (list?.length) blocks.push({ list });
    list = null;
  };

  for (const raw of text.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith("! ")) {
      flushParagraph();
      flushList();
      const [src, ...captionParts] = line.slice(2).split("|");
      const image = src.trim();
      if (image) {
        const caption = captionParts.join("|").trim();
        blocks.push(caption ? { image, caption } : { image });
      }
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ heading: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      blocks.push({ quote: line.slice(2).trim() });
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      list ??= [];
      list.push(line.slice(2).trim());
      continue;
    }
    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}
