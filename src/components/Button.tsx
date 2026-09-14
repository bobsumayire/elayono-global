import Link from "next/link";
import type { ReactNode } from "react";

type Common = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline-white" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

type ButtonAsLink = Common & {
  href: string;
  onClick?: never;
  type?: never;
};

type ButtonAsButton = Common & {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
};

type ButtonProps = ButtonAsLink | ButtonAsButton;

const base =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-wide rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-50 disabled:pointer-events-none";

const sizes = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-sm sm:text-base",
};

const variants = {
  primary:
    "bg-brand-500 text-white shadow-sm shadow-brand-900/10 hover:bg-brand-600 hover:shadow-md hover:-translate-y-0.5",
  secondary:
    "bg-ink text-white hover:bg-brand-900 hover:-translate-y-0.5",
  "outline-white":
    "border border-white/70 text-white hover:bg-white hover:text-ink backdrop-blur-sm",
  ghost:
    "border border-line text-ink hover:border-brand-400 hover:text-brand-600",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  onClick,
  type = "button",
}: ButtonProps) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <Link
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
