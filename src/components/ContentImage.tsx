import Image from "next/image";

type ContentImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** `cover` fills a sized frame. `natural` keeps the photo's own shape. `full` spans the column without cropping. */
  fit?: "cover" | "natural" | "full";
};

function isManaged(src: string) {
  return src.startsWith("/api/media/") || src.startsWith("/uploads/");
}

export default function ContentImage({ src, alt, className = "", sizes, priority, fit = "cover" }: ContentImageProps) {
  if (fit === "natural" || fit === "full") {
    const shape = fit === "full" ? "h-auto w-full" : "h-auto w-auto max-h-[min(85vh,52rem)]";
    return <img src={src} alt={alt} className={`mx-auto block max-w-full object-contain ${shape} ${className}`} />;
  }
  if (!src || isManaged(src)) {
    return <img src={src} alt={alt} className={`absolute inset-0 h-full w-full ${className}`} />;
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />;
}
