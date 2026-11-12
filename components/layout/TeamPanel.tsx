import PokemonSprite from "@/components/pokemon/PokemonSprite";
import { MAX_FAVORITES } from "@/lib/pokemon/collection-store";
import { formatName } from "@/lib/pokemon/utils";
import { getPokemonEntry } from "@/lib/radar/scan";

interface TeamPanelProps {
  favorites: number[];
  onSelectPokemon: (id: number) => void;
}

export default function TeamPanel({ favorites, onSelectPokemon }: TeamPanelProps) {
  const slots = Array.from({ length: MAX_FAVORITES }, (_, i) => favorites[i] ?? null);

  return (
    <section aria-label="Tu equipo" className="rounded-lg border border-line bg-elevated/40 p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm text-ink-muted">Tu equipo</h2>
        <span className={`font-mono text-lg font-bold ${favorites.length === MAX_FAVORITES ? "text-lime" : ""}`}>
          {favorites.length} / {MAX_FAVORITES}
        </span>
      </div>

      <ul className="grid grid-cols-6 gap-2">
        {slots.map((id, i) => (
          <li key={id ?? `empty-${i}`}>
            {id !== null ? (
              <button
                type="button"
                onClick={() => onSelectPokemon(id)}
                aria-label={`Ver ficha de ${formatName(getPokemonEntry(id)?.name ?? String(id))}`}
                className="grid aspect-square w-full place-items-center overflow-hidden rounded-full border-[1.5px] border-lime bg-surface transition-transform hover:scale-105"
              >
                <PokemonSprite id={id} className="size-[130%]" />
              </button>
            ) : (
              <span aria-hidden="true" className="block aspect-square w-full rounded-full border-[1.5px] border-dashed border-line-strong" />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}