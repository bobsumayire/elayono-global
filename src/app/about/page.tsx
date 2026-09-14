import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";
import GlobalPresenceMap from "@/components/GlobalPresenceMap";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn who Elayono Global is, what we believe, and our vision for a global family united by faith.",
};

const beliefs = [
  { title: "The Bible", body: "We believe the Bible is the inspired, infallible Word of God and the final authority for faith and life." },
  { title: "The Trinity", body: "We believe in one God, eternally existing in three persons: Father, Son and Holy Spirit." },
  { title: "Salvation", body: "We believe salvation is a free gift of God's grace, received through faith in Jesus Christ." },
  { title: "The Church", body: "We believe the Church is the body of Christ, called to worship, discipleship and mission in every nation." },
  { title: "The Holy Spirit", body: "We believe in the present ministry and power of the Holy Spirit in the life of every believer." },
  { title: "Eternity", body: "We believe in the resurrection of both the saved and the lost — the saved to eternal life, the lost to eternal separation from God." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Elayono Global"
        title="Who We Are"
        description="A global family, united by one faith and one mission."
        image="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2000&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28">
        <div className="container-elayono grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Our Story"
            title="A ministry raised for the nations"
            description={siteConfig.description}
          />
          <div className="flex flex-col gap-4 text-base leading-relaxed text-slate">
            <p>
              Elayono Global was founded by Rev Prophet Ernest NYIRINDEKWE out of a clear calling
              to preach the Gospel and see lives transformed by the power of God. What began as a
              single altar has grown into an international ministry, with congregations now
              gathering across the USA &amp; Canada, Belgium, France and Sweden.
            </p>
            <p>
              We exist to proclaim the Gospel with excellence, to disciple believers into
              maturity, and to build a global community of faith that reflects the heart of God
              for every nation, tribe and tongue.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-28">
        <div className="container-elayono flex flex-col gap-12">
          <SectionHeading
            eyebrow="Our Mission & Vision"
            title="Faith. Excellence. Global Reach. Transformation."
            align="center"
            className="mx-auto text-center"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-3xl border border-line bg-white p-8">
              <h3 className="font-display text-lg font-bold text-ink">Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">
                To proclaim the Gospel of Jesus Christ across nations, making disciples who love
                God, love people, and live out their God-given purpose.
              </p>
            </div>
            <div className="rounded-3xl border border-line bg-white p-8">
              <h3 className="font-display text-lg font-bold text-ink">Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">
                A global family of altars, united by one faith, raising a generation equipped to
                carry God&apos;s purpose into every sphere of society.
              </p>
            </div>
            <div className="rounded-3xl border border-line bg-white p-8">
              <h3 className="font-display text-lg font-bold text-ink">Values</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">
                Faith, excellence, integrity, community and a relentless commitment to spiritual
                growth and transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-elayono flex flex-col gap-10">
          <SectionHeading eyebrow="What We Believe" title="Our Statement of Faith" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beliefs.map((b) => (
              <div key={b.title} className="rounded-2xl border border-line bg-white p-6">
                <h3 className="font-display font-bold text-ink">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-28">
        <div className="container-elayono flex flex-col gap-10">
          <SectionHeading
            eyebrow="Where We Are"
            title="A Global Family, United by Faith"
            description="Explore our altars around the world."
          />
          <GlobalPresenceMap />
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="container-elayono flex flex-col items-center gap-6">
          <SectionHeading
            title="Ready to Learn More About Our Founder?"
            align="center"
            className="mx-auto"
          />
          <Button href="/founder" variant="primary" size="lg">
            Meet Rev Prophet Ernest NYIRINDEKWE
          </Button>
        </div>
      </section>
    </>
  );
}
