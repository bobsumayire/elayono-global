import type { BlogBlock } from "@/data/blog";

export default function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="flex flex-col gap-5 text-base leading-relaxed text-ink/80 sm:text-lg">
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
