import Image from "next/image";
import Button from "./Button";
import LogoMark from "./LogoMark";

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-ink">
      <Image
        src="https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2400&auto=format&fit=crop"
        alt="Congregation worshipping together"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />

      <div className="container-elayono relative z-10 flex flex-col gap-8 py-32">
        <div className="flex animate-fade-up items-center gap-4">
          <LogoMark variant="white" className="h-14 w-14 sm:h-16 sm:w-16" />
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">
            Elayono Global
          </span>
        </div>

        <h1 className="max-w-3xl animate-fade-up text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl [animation-delay:100ms]">
          One Family. One Faith. <span className="text-brand-300">A Global Mission.</span>
        </h1>

        <p className="max-w-xl animate-fade-up text-lg leading-relaxed text-white/85 [animation-delay:200ms]">
          Welcome to Elayono Global — a growing international Christian ministry committed to
          proclaiming the Gospel, transforming lives, building faith and raising a generation for
          God&apos;s purpose.
        </p>

        <div className="flex animate-fade-up flex-wrap gap-4 [animation-delay:300ms]">
          <Button href="/watch-live" variant="primary" size="lg">
            Watch Live
          </Button>
          <Button href="/about" variant="outline-white" size="lg">
            Discover Elayono
          </Button>
          <Button href="/altars" variant="outline-white" size="lg">
            Find an Altar
          </Button>
        </div>

        <div className="flex animate-fade-up flex-wrap items-center gap-x-10 gap-y-4 pt-6 text-white/70 [animation-delay:400ms]">
          <Stat value="4" label="Nations & Growing" />
          <Stat value="10+" label="Cities Reached" />
          <Stat value="1" label="Global Family" />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 animate-fade-in flex-col items-center gap-2 text-white/60 sm:flex [animation-delay:800ms]">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-8 w-px bg-white/40" />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-extrabold text-white">{value}</span>
      <span className="text-xs uppercase tracking-wide">{label}</span>
    </div>
  );
}
