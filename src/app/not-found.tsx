import Button from "@/components/Button";
import LogoMark from "@/components/LogoMark";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <LogoMark className="h-14 w-14" />
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-500">404</p>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Page Not Found</h1>
      <p className="max-w-md text-slate">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Button href="/" variant="primary">
        Return Home
      </Button>
    </div>
  );
}
