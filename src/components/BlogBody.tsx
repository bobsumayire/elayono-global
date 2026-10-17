import ContentImage from "@/components/ContentImage";
import type { BlogBlock } from "@/data/blog";

export default function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="flex flex-col gap-6 text-[1.0625rem] leading-[1.7] text-ink sm:text-lg">
      {blocks.map((block, index) => {
        if (typeof block === "string") {
          return <p key={index}>{block}</p>;
        }
        if ("heading" in block) {
          return (
            <h2 key={index} className="pt-3 text-2xl font-bold tracking-tight text-ink">
              {block.heading}
            </h2>
          );
        }
        if ("quote" in block) {
          return (
            <blockquote
              key={index}
              className="border-l-4 border-brand-500 py-1 pl-5 text-xl font-medium leading-snug text-ink"
            >
              {block.quote}
            </blockquote>
          );
        }
        if ("image" in block) {
          return (
            <figure key={index} className="my-2">
              <ContentImage src={block.image} alt={block.caption ?? ""} fit="natural" className="rounded-3xl" />
              {block.caption ? <figcaption className="mt-3 text-center text-sm text-slate">{block.caption}</figcaption> : null}
            </figure>
          );
        }
        return (
          <ul key={index} className="list-disc space-y-2 pl-5">
            {block.list.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
