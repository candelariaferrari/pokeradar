import RegionThumbnail from "@/components/layout/RegionThumbnail";
import RegionWeather from "@/components/layout/RegionWeather";
import type { Region } from "@/lib/radar/regions";

interface MobileRegionBarProps {
  region: Region;
  onOpen: () => void;
}

export default function MobileRegionBar({ region, onOpen }: MobileRegionBarProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="flex w-full items-center gap-3 rounded-lg border border-line bg-surface p-2 pr-4 text-left"
    >
      <RegionThumbnail regionId={region.id} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs text-ink-muted">Explorando</span>
        <span className="truncate text-[15px] font-medium">{region.name}</span>
        {/* key: al cambiar de región, el clima se vuelve a pedir */}
        <RegionWeather key={region.id} regionId={region.id} />
      </span>
      <span className="shrink-0 text-sm font-medium text-lime">Cambiar</span>
    </button>
  );
}