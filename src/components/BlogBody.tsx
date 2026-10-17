import ContentImage from "@/components/ContentImage";
import RichText from "@/components/RichText";
import type { BlogBlock } from "@/data/blog";
import { alignClass, plainText, splitAlign } from "@/lib/cms/richText";

export default function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="flex flex-col gap-6 text-[1.0625rem] leading-[1.7] text-ink sm:text-lg">
      {blocks.map((block, index) => {
        if (typeof block === "string") {
          const { align, body } = splitAlign(block);
          return (
            <p key={index} className={alignClass(align)}>
              <RichText value={body} />
            </p>
          );
        }
        if ("heading" in block) {
          const { align, body } = splitAlign(block.heading);
          return (
            <h2 key={index} className={`pt-3 text-2xl font-bold tracking-tight text-ink ${alignClass(align)}`}>
              <RichText value={body} />
            </h2>
          );
        }
        if ("quote" in block) {
          const { align, body } = splitAlign(block.quote);
          return (
            <blockquote
              key={index}
              className={`border-l-4 border-brand-500 py-1 pl-5 text-xl font-medium leading-snug text-ink ${alignClass(align)}`}
            >
              <RichText value={body} />
            </blockquote>
          );
        }
        if ("image" in block) {
          return (
            <figure key={index} className="my-2">
              <ContentImage src={block.image} alt={plainText(block.caption ?? "")} fit="natural" className="rounded-3xl" />
              {block.caption ? (
                <figcaption className="mt-3 text-center text-sm text-slate">
                  <RichText value={block.caption} />
                </figcaption>
              ) : null}
            </figure>
          );
        }
        return (
          <ul key={index} className="list-disc space-y-2 pl-5">
            {block.list.map((item, itemIndex) => (
              <li key={itemIndex}>
                <RichText value={item} />
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
