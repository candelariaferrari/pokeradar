import { REGIONS, type RegionId } from "@/lib/radar/regions";
import TeamPanel from "@/components/layout/TeamPanel";
import PokemonSearch from "@/components/layout/PokemonSearch";
import RegionThumbnail from "@/components/layout/RegionThumbnail";
import RegionWeather from "@/components/layout/RegionWeather";

interface SidebarProps {
  selectedRegionId: RegionId;
  favorites: number[];
  onSelectRegion: (id: RegionId) => void;
  onSelectPokemon: (id: number) => void;
  onSearchSelect: (id: number) => void;
}

export default function Sidebar({ selectedRegionId, onSelectRegion, favorites, onSelectPokemon, onSearchSelect }: SidebarProps) {
  return (
    <aside
      aria-label="Exploración"
      className="hidden min-h-0 flex-col gap-4 rounded-lg border border-line bg-surface p-5 lg:flex"
    >
      <PokemonSearch onSelect={onSearchSelect} />

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
                <RegionThumbnail regionId={region.id} />
                <span className="flex min-w-0 flex-col">
                  <span className="text-[15px] font-medium">{region.name}</span>
                  <span className="text-xs text-ink-muted">
                    {region.province} · {region.biome}
                  </span>
                  {isSelected && <RegionWeather regionId={region.id} />}
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