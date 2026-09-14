import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { galleryImages } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Media & Gallery",
  description: "Photos and highlights from across the Elayono Global family.",
};

export default function MediaPage() {
  return (
    <>
      <PageHero
        eyebrow="Media"
        title="Gallery"
        description="Moments of worship, fellowship and mission from across our global family."
        image="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`relative w-full overflow-hidden rounded-2xl border border-line break-inside-avoid ${
                img.tall ? "aspect-[3/4]" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
