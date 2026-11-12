import { REGIONS, type RegionId } from "@/lib/radar/regions";
import TeamPanel from "@/components/layout/TeamPanel";
import Icon from "@/components/ui/Icon";

interface SidebarProps {
  selectedRegionId: RegionId;
  favorites: number[];
  onSelectRegion: (id: RegionId) => void;
  onSelectPokemon: (id: number) => void;
}

export default function Sidebar({ selectedRegionId, onSelectRegion, favorites, onSelectPokemon }: SidebarProps) {  return (
    <aside
      aria-label="Exploración"
      className="hidden min-h-0 flex-col gap-4 rounded-lg border border-line bg-surface p-5 lg:flex"
    >
      <label className="relative flex items-center">
        <span className="sr-only">Buscar Pokémon</span>
              <Icon name="search" className="pointer-events-none absolute left-4 text-ink-muted" />
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
                className={`flex w-full items-center gap-3 rounded-md border-[1.5px] p-1 pr-3 text-left transition-colors ${isSelected
                    ? "border-lime bg-lime-glow shadow-[0_0_16px_rgb(163_230_53/0.18)]"
                    : "border-transparent bg-elevated hover:border-line-strong"
                  }`}
              >
                <span aria-hidden="true" className="h-13 w-20 shrink-0 rounded-sm bg-surface" />
                <span className="flex flex-col">
                  <span className="text-[15px] font-medium">{region.name}</span>
                  <span className="text-xs text-ink-muted">
                    {region.province} · {region.biome}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <TeamPanel favorites={favorites} onSelectPokemon={onSelectPokemon} />
    </aside>
  );
}