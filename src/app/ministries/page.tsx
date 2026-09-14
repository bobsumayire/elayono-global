import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import MinistryCard from "@/components/MinistryCard";
import CTASection from "@/components/CTASection";
import { ministries } from "@/data/ministries";

export const metadata: Metadata = {
  title: "Ministries",
  description: "Explore the ministries serving the Elayono Global family across every altar.",
};

export default function MinistriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title="Ministries Serving the Body of Christ"
        description="Every believer has a place to grow, serve and belong at Elayono Global."
        image="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ministries.map((m) => (
            <MinistryCard key={m.slug} ministry={m} />
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Serve With Us"
        title="Find Your Place to Serve"
        description="Interested in joining a ministry team at your local altar? We'd love to connect you with a leader."
        primary={{ label: "Contact Us", href: "/contact" }}
        secondary={{ label: "Find an Altar", href: "/altars" }}
        image="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=2000&auto=format&fit=crop"
      />
    </>
  );
}
