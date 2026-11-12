import Icon from "@/components/ui/Icon";
import Pill, { RadarDot } from "@/components/ui/Pill";

interface RadarToolbarProps {
  detectedCount: number;
  onScan: () => void;
}

export default function RadarToolbar({ detectedCount, onScan }: RadarToolbarProps) {
  return (
    <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
      <Pill variant="floating" size="md" role="status">
        <RadarDot />
        {detectedCount > 0 ? (
          <>
            <span className="font-mono">{detectedCount}</span> detectados
          </>
        ) : (
          "Escaneando…"
        )}
      </Pill>

      <button
        type="button"
        onClick={onScan}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-lime px-5 text-sm font-semibold text-on-lime shadow-panel transition-colors hover:bg-lime-soft"
      >
        <Icon name="radar" strokeWidth={2} />
        Escanear zona
      </button>
    </div>
  );
}