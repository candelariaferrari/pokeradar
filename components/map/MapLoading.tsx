interface MapLoadingProps {
  visible?: boolean;
}

export default function MapLoading({ visible = true }: MapLoadingProps) {
  return (
    <div
      role={visible ? "status" : undefined}
      aria-hidden={!visible}
      className={`absolute inset-0 z-5 flex flex-col items-center justify-center gap-6 bg-surface transition-opacity duration-500 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="relative grid size-28 place-items-center">
        {["0s", "0.8s", "1.6s"].map((delay) => (
          <span
            key={delay}
            aria-hidden="true"
            style={{ animationDelay: delay }}
            className="absolute inset-0 animate-radar-ping rounded-full border-[1.5px] border-lime/60 motion-reduce:hidden"
          />
        ))}
        <span className="size-3 rounded-full bg-lime shadow-glow" />
      </div>
      <p className="text-sm text-ink-muted">Iniciando radar…</p>
    </div>
  );
}