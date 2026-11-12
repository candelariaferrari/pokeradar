import { MAX_FAVORITES } from "@/lib/pokemon/collection-store";

interface HeaderProps {
  discoveredCount: number;
  favoritesCount: number;
}

export default function Header({ discoveredCount, favoritesCount }: HeaderProps) {
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
        <span className="hidden h-9 items-center gap-2 rounded-full border border-line bg-elevated px-4 text-sm font-medium md:inline-flex">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-lime shadow-[0_0_0_4px_var(--color-lime-glow)]" />
          Radar activo
        </span>

        <span className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-elevated px-3 text-sm font-medium lg:px-4">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="fill-type-electric">
            <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
          </svg>
          <span className="font-mono">{discoveredCount}</span>
          <span className="hidden sm:inline">descubiertos</span>
        </span>

        <span className="inline-flex h-9 items-center gap-2 rounded-full border-[1.5px] border-lime px-3 text-sm font-medium lg:px-4">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="fill-lime">
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
          </svg>
          <span className="hidden sm:inline">Mi equipo</span>
          <span className="font-mono">
            {favoritesCount}/{MAX_FAVORITES}
          </span>
        </span>
      </div>
    </header>
  );
}