import { REGIONS, type RegionId } from "@/lib/regions";

interface SidebarProps {
  selectedRegionId: RegionId;
  onSelectRegion: (id: RegionId) => void;
}

export default function Sidebar({ selectedRegionId, onSelectRegion }: SidebarProps) {
  return (
    <aside
      aria-label="Exploración"
      className="hidden min-h-0 flex-col gap-4 rounded-lg border border-line bg-surface p-5 lg:flex"
    >
      <label className="relative flex items-center">
        <span className="sr-only">Buscar Pokémon</span>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="pointer-events-none absolute left-4 fill-none stroke-ink-muted" strokeWidth="1.8" strokeLinecap="round">
          <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4" />
        </svg>
        <input
          type="search"
          placeholder="Buscar Pokémon…"
          className="h-12 w-full rounded-full border border-line-strong bg-elevated pl-11 pr-4 text-[15px] placeholder:text-ink-muted focus:border-lime focus:outline-none focus:ring-4 focus:ring-lime-glow"
        />
      </label>

      <h2 className="text-lg font-semibold">Regiones de Argentina</h2>

      <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {REGIONS.map((region) => {
          const isSelected = region.id === selectedRegionId;

          return (
            <li key={region.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectRegion(region.id)}
                className={`flex w-full items-center gap-3 rounded-md border-[1.5px] p-1 pr-3 text-left transition-colors ${
                  isSelected
                    ? "border-lime bg-lime-glow shadow-[0_0_16px_rgb(163_230_53/0.18)]"
                    : "border-transparent bg-elevated hover:border-line-strong"
                }`}
              >
                <span aria-hidden="true" className="h-13 w-20 shrink-0 rounded-sm bg-surface" />
                <span className="flex flex-col">
                  <span className="text-[15px] font-medium">{region.name}</span>
                  <span className="text-xs text-ink-muted">{region.biome}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}