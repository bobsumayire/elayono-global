/**
 * Placeholder recreation of the Elayono Global mark (cross, open Bible, dove,
 * ascending swoop) for development. This is NOT the official artwork — replace
 * with the exported brand file (e.g. public/brand/logo-mark.svg) before launch
 * and swap the <LogoMark> usages in Header/Footer for a plain <Image>.
 */
type LogoMarkProps = {
  className?: string;
  variant?: "color" | "white";
};

export default function LogoMark({ className, variant = "color" }: LogoMarkProps) {
  const isWhite = variant === "white";

  const hill = isWhite ? "#ffffff" : "var(--color-brand-900)";
  const swoopOuter = isWhite ? "#ffffffb3" : "var(--color-brand-300)";
  const swoopInner = isWhite ? "#ffffff" : "var(--color-brand-400)";
  const cross = isWhite ? "#ffffff" : "var(--color-brand-500)";
  const dove = isWhite ? "#ffffff" : "var(--color-brand-500)";
  const bookFill = isWhite ? "transparent" : "var(--color-paper)";
  const bookStroke = isWhite ? "#ffffff" : "var(--color-brand-700)";

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Elayono Global mark"
    >
      <path
        d="M96 118 C60 96 34 100 18 128 C50 108 70 122 88 138 Z"
        fill={swoopOuter}
      />
      <path
        d="M100 112 C74 94 54 96 40 116 C64 100 80 112 94 128 Z"
        fill={swoopInner}
      />

      <g>
        <path d="M60 66 L86 58 L100 40 L114 58 L140 66 L128 88 Q100 78 72 88 Z" fill={dove} opacity="0" />
        <path
          d="M132 34 C138 46 136 58 124 66 C130 54 128 46 118 40 C124 36 128 34 132 34 Z"
          fill={dove}
        />
        <path
          d="M124 66 C130 72 138 74 146 70 C140 78 128 80 120 74 Z"
          fill={dove}
        />
      </g>

      <path
        d="M92 40 H108 V78 H140 V94 H108 V150 H92 V94 H60 V78 H92 Z"
        fill={cross}
      />

      <path
        d="M100 128 C82 118 62 118 48 130 V150 C62 140 82 140 100 150 C118 140 138 140 152 150 V130 C138 118 118 118 100 128 Z"
        fill={bookFill}
        stroke={bookStroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M100 128 V150"
        stroke={bookStroke}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        d="M18 176 C48 140 80 150 100 150 C120 150 152 140 182 176 Z"
        fill={hill}
      />
    </svg>
  );
}
