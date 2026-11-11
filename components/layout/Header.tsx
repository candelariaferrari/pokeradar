export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4 lg:h-20 lg:px-6">
      <div className="flex items-center gap-3">
        
        <div>
          <h1 className="text-2xl font-bold leading-8 tracking-tight lg:text-[28px]">
            Pokérad<span className="text-lime">AR</span>
          </h1>
          <p className="hidden text-xs text-ink-muted lg:block">Explorá. Descubrí. Coleccioná.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-elevated px-4 text-sm font-medium">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-lime shadow-[0_0_0_4px_var(--color-lime-glow)]" />
          Radar activo
        </span>
        <button
          type="button"
          aria-label="Perfil del explorador"
          className="grid size-11 place-items-center rounded-full border border-line-strong bg-elevated"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </svg>
        </button>
      </div>
    </header>
  );
}