import { parseRich, type RichNode } from "@/lib/cms/richText";

function Nodes({ nodes }: { nodes: RichNode[] }) {
  return nodes.map((node, index) => {
    if (node.type === "text") {
      const text = node.text.replace(/\u200b/g, "");
      return text ? text : null;
    }
    const children = <Nodes nodes={node.children} />;
    if (node.type === "strong") return <strong key={index}>{children}</strong>;
    if (node.type === "em") return <em key={index}>{children}</em>;
    if (node.type === "u") return <u key={index}>{children}</u>;
    if (node.type === "a") {
      const external = /^https?:/i.test(node.href);
      return (
        <a key={index} href={node.href} className="text-brand-700 underline" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    }
    if (node.type !== "span") return children;
    return (
      <span key={index} data-font={node.font} data-size={node.size}>
        {children}
      </span>
    );
  });
}

export default function RichText({ value }: { value: string }) {
  return (
    <span className="rich-text">
      <Nodes nodes={parseRich(value)} />
    </span>
  );
}
