import Image from "next/image";

type ContentImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

function isManaged(src: string) {
  return src.startsWith("/api/media/") || src.startsWith("/uploads/");
}

export default function ContentImage({ src, alt, className = "", sizes, priority }: ContentImageProps) {
  if (!src || isManaged(src)) {
    return <img src={src} alt={alt} className={`absolute inset-0 h-full w-full ${className}`} />;
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />;
}
