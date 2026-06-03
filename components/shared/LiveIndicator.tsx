/** Blinking guinda square + uppercase label — shared between masthead and status bar. */
export function LiveIndicator({ label }: { label: string }) {
  return (
    <span className="live">{label}</span>
  );
}
