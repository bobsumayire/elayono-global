/**
 * Neutral placeholder used wherever a real photograph is not yet available
 * (e.g. the founder's portrait). Deliberately non-photographic so it is never
 * mistaken for an actual likeness — swap for the real photo before launch.
 */
export default function PortraitPlaceholder({
  initials,
  className = "",
}: {
  initials: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-brand-700 via-brand-800 to-ink ${className}`}
    >
      <span className="font-display text-6xl font-extrabold tracking-tight text-white/90">
        {initials}
      </span>
    </div>
  );
}
