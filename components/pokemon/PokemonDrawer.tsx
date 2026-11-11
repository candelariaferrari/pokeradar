import { useEffect } from "react";

interface PokemonDrawerProps {
  pokemonId: number;
  onClose: () => void;
}

export default function PokemonDrawer({ pokemonId, onClose }: PokemonDrawerProps) {
  // Cerrar con la tecla Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <aside
      aria-label="Ficha del Pokémon"
      className="absolute inset-y-4 right-4 z-10 w-105 max-w-[calc(100%-2rem)] animate-drawer-in overflow-y-auto rounded-lg border border-line bg-surface p-6 shadow-panel"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar ficha"
        className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-ink-muted hover:bg-elevated hover:text-ink"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <span className="inline-flex h-7 items-center rounded-full bg-elevated px-3 font-mono text-[13px]">
        N.º {String(pokemonId).padStart(3, "0")}
      </span>
      <p className="mt-4 text-ink-muted">Acá van los datos de la PokéAPI (paso 5).</p>
    </aside>
  );
}