import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { altars } from "@/data/altars";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Elayono Global or connect with a local altar near you.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Contact Elayono Global"
        description="We'd love to hear from you — whether you have a question, want prayer, or want to visit an altar."
        image="https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="Ministry Office"
              title="Reach Our Team"
              description="For general inquiries, media requests or partnership questions, contact our global ministry office."
            />
            <div className="flex flex-col gap-3 text-sm">
              <p className="text-slate">
                Email:{" "}
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-brand-600 hover:underline">
                  {siteConfig.email}
                </a>
              </p>
              <p className="text-slate">
                Phone:{" "}
                <a href={`tel:${siteConfig.phone}`} className="font-semibold text-brand-600 hover:underline">
                  {siteConfig.phone}
                </a>
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-line pt-6">
              <h3 className="font-display font-bold text-ink">Our Altars</h3>
              {altars.map((a) => (
                <div key={a.slug} className="flex items-center justify-between text-sm">
                  <span className="text-ink">{a.country}</span>
                  <a href={`/altars/${a.slug}`} className="font-semibold text-brand-600 hover:underline">
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
