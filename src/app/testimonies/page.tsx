import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import TestimonyCard from "@/components/TestimonyCard";
import CTASection from "@/components/CTASection";
import { testimonies } from "@/data/testimonies";

export const metadata: Metadata = {
  title: "Testimonies",
  description: "Stories of transformation from across the Elayono Global family.",
};

export default function TestimoniesPage() {
  return (
    <>
      <PageHero
        eyebrow="Testimonies"
        title="Lives Being Transformed"
        description="Real stories from our global family of what God is doing through Elayono Global."
        image="https://images.unsplash.com/photo-1508186225823-0963cf9ab0de?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonies.map((t, i) => (
            <TestimonyCard key={i} testimony={t} />
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Share Your Story"
        title="Has God Transformed Your Life Through Elayono Global?"
        description="We would love to hear and share your testimony to encourage others in their walk of faith."
        primary={{ label: "Contact Us", href: "/contact" }}
        image="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2000&auto=format&fit=crop"
      />
    </>
  );
}
