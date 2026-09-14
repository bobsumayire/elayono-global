import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import GlobalPresenceMap from "@/components/GlobalPresenceMap";
import LocationCard from "@/components/LocationCard";
import { altars } from "@/data/altars";

export const metadata: Metadata = {
  title: "Our Altars",
  description: "Find an Elayono Global altar near you across the USA & Canada, Belgium, France and Sweden.",
};

export default function AltarsPage() {
  return (
    <>
      <PageHero
        eyebrow="Find an Altar"
        title="Our Altars Around the World"
        description="Wherever you find an Elayono Global altar, you'll find the same family — one faith, one mission."
        image="https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono flex flex-col gap-10">
          <SectionHeading eyebrow="Global Map" title="A Global Family, United by Faith" />
          <GlobalPresenceMap />
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-28">
        <div className="container-elayono flex flex-col gap-10">
          <SectionHeading eyebrow="All Altars" title="Browse by Location" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {altars.map((a) => (
              <LocationCard key={a.slug} altar={a} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
