import Icon from "@/components/ui/Icon";
import Pill, { RadarDot } from "@/components/ui/Pill";
import Tooltip from "@/components/ui/Tooltip";
import { MAX_FAVORITES } from "@/lib/pokemon/collection-store";
import SoundToggle from "@/components/layout/SoundToggle";

interface HeaderProps {
  discoveredCount: number;
  favoritesCount: number;
  teamOpen: boolean;
  onTeamClick: () => void;
}

export default function Header({ discoveredCount, favoritesCount, teamOpen, onTeamClick }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line px-4 lg:h-20 lg:px-6">
      <div className="flex items-center gap-3">
        <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" className="hidden fill-none stroke-lime sm:block">
          <circle cx="20" cy="20" r="17" className="stroke-line-strong" strokeWidth="2.2" />
          <circle cx="20" cy="20" r="10.5" className="stroke-line-strong" strokeWidth="2.2" />
          <path d="M20 20 L32 8" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="20" cy="20" r="3" className="fill-lime stroke-none" />
        </svg>
        <div>
          <h1 className="text-2xl font-bold leading-8 tracking-tight lg:text-[28px]">
            Pokérad<span className="text-lime">AR</span>
          </h1>
          <p className="hidden text-xs text-ink-muted lg:block">Explorá. Descubrí. Coleccioná.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <SoundToggle />
        <span className="hidden md:block">
          <Pill>
            <RadarDot />
            Radar activo
          </Pill>
        </span>

        <Tooltip label="Pokémon descubiertos">
          <Pill>
            <Icon name="star" size={16} filled className="text-type-electric" />
            <span className="font-mono">{discoveredCount}</span>
            <span className="hidden sm:inline">descubiertos</span>
            <span className="sr-only sm:hidden">Pokémon descubiertos</span>
          </Pill>
        </Tooltip>

        <Tooltip label={`Tu equipo: ${favoritesCount} de ${MAX_FAVORITES}`}>
          <button
            type="button"
            onClick={onTeamClick}
            aria-expanded={teamOpen}
            aria-label={`Tu equipo: ${favoritesCount} de ${MAX_FAVORITES}`}
            className={`inline-flex h-9 items-center gap-2 rounded-full border-[1.5px] border-lime px-3 text-sm font-medium transition-colors hover:bg-lime-glow lg:px-4 ${
              teamOpen ? "bg-lime-glow" : ""
            }`}
          >
            <Icon name="heart" size={16} filled className="text-lime" />
            <span className="hidden sm:inline">Mi equipo</span>
            <span className="font-mono">
              {favoritesCount}/{MAX_FAVORITES}
            </span>
          </button>
        </Tooltip>
      </div>
    </header>
  );
}