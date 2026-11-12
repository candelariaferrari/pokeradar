import Icon from "@/components/ui/Icon";
import Pill, { RadarDot } from "@/components/ui/Pill";
import { MAX_FAVORITES } from "@/lib/pokemon/collection-store";

interface HeaderProps {
  discoveredCount: number;
  favoritesCount: number;
}

export default function Header({ discoveredCount, favoritesCount }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line px-4 lg:h-20 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Logo: es una marca, no un ícono, por eso queda acá */}
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
        <span className="hidden md:block">
          <Pill>
            <RadarDot />
            Radar activo
          </Pill>
        </span>

        <Pill>
          <Icon name="star" size={16} filled className="text-type-electric" />
          <span className="font-mono">{discoveredCount}</span>
          <span className="hidden sm:inline">descubiertos</span>
        </Pill>

        <Pill variant="outline">
          <Icon name="heart" size={16} filled className="text-lime" />
          <span className="hidden sm:inline">Mi equipo</span>
          <span className="font-mono">
            {favoritesCount}/{MAX_FAVORITES}
          </span>
        </Pill>
      </div>
    </header>
  );
}