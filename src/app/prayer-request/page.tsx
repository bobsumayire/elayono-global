import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import PrayerRequestForm from "@/components/PrayerRequestForm";

export const metadata: Metadata = {
  title: "Prayer Request",
  description: "Submit a prayer request to the Elayono Global prayer team — we stand with you in faith.",
};

export default function PrayerRequestPage() {
  return (
    <>
      <PageHero
        eyebrow="We're Praying With You"
        title="Submit a Prayer Request"
        description="No request is too big or too small. Our prayer team stands ready to believe with you."
        image="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Prayer Ministry"
            title="You Are Not Alone"
            description="Whatever you're facing — healing, family, finances, guidance or thanksgiving — our global prayer team is here to intercede with you. Every request is received with care and confidentiality."
          />
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
            <PrayerRequestForm />
          </div>
        </div>
      </section>
    </>
  );
}
