import type { BlogBlock } from "@/data/blog";

function oneLine(value: string) {
  return value.replace(/\s*\n\s*/g, " ").trim();
}

/** Paragraphs that look like headings, quotes, lists, or photos are stored with a leading backslash. */
function paragraphLine(text: string) {
  const line = oneLine(text);
  if (!line) return "";
  if (/^(?:\\+|! |## |> |- )/.test(line)) return `\\${line}`;
  return line;
}

export function blocksToText(blocks: BlogBlock[] | undefined): string {
  if (!blocks?.length) return "";
  return blocks
    .map((block) => {
      if (typeof block === "string") return paragraphLine(block);
      if ("heading" in block) {
        const heading = oneLine(block.heading);
        return heading ? `## ${heading}` : "";
      }
      if ("quote" in block) {
        const quote = oneLine(block.quote);
        return quote ? `> ${quote}` : "";
      }
      if ("image" in block) {
        const image = oneLine(block.image);
        if (!image || image.startsWith("blob:")) return "";
        const caption = block.caption ? oneLine(block.caption) : "";
        return caption ? `! ${image} | ${caption}` : `! ${image}`;
      }
      const items = block.list.map(oneLine).filter(Boolean);
      return items.length ? items.map((item) => `- ${item}`).join("\n") : "";
    })
    .filter(Boolean)
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
    if (line.startsWith("\\")) {
      flushList();
      paragraph.push(line.slice(1));
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
