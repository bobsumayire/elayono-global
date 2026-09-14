import Link from "next/link";
import LogoMark from "./LogoMark";

type LogoProps = {
  variant?: "color" | "white";
  showWordmark?: boolean;
  className?: string;
};

export default function Logo({
  variant = "color",
  showWordmark = true,
  className = "",
}: LogoProps) {
  const wordmarkColor = variant === "white" ? "text-white" : "text-ink";
  const subColor = variant === "white" ? "text-white/70" : "text-brand-600";

  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 shrink-0 ${className}`}
      aria-label="Elayono Global — Home"
    >
      <LogoMark
        variant={variant}
        className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 transition-transform duration-300 group-hover:scale-105"
      />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display font-extrabold tracking-tight text-[1.05rem] sm:text-[1.2rem] ${wordmarkColor}`}
          >
            ELAYONO <span className="font-light">GLOBAL</span>
          </span>
          <span
            className={`mt-1 text-[0.62rem] sm:text-[0.66rem] font-semibold uppercase tracking-[0.22em] ${subColor}`}
          >
            One Family &middot; One Faith
          </span>
        </span>
      )}
    </Link>
  );
}
