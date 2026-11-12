import Icon from "@/components/ui/Icon";
import TypeChip from "@/components/ui/TypeChip";
import PokemonSprite from "@/components/pokemon/PokemonSprite";
import FavoriteButton from "@/components/pokemon/FavoriteButton";
import { formatDexNumber, formatName } from "@/lib/pokemon/utils";
import { getPokemonEntry } from "@/lib/radar/scan";
import { REGIONS } from "@/lib/radar/regions";

interface PokemonPeekProps {
  pokemonId: number;
  onOpenDetail: () => void;
  onClose: () => void;
}

/** Vista previa con datos locales: aparece al instante, sin esperar a la API */
export default function PokemonPeek({ pokemonId, onOpenDetail, onClose }: PokemonPeekProps) {
  const entry = getPokemonEntry(pokemonId);
  if (!entry) return null;
  const region = REGIONS.find((r) => r.id === entry.region);

  return (
    <section
      aria-label="Pokémon seleccionado"
      className="flex animate-sheet-in flex-col gap-3 rounded-lg border border-line bg-surface p-3"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border-[1.5px] border-lime bg-elevated shadow-glow">
          <PokemonSprite id={pokemonId} className="size-[130%]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-xs text-ink-muted">
            {formatDexNumber(pokemonId)} · {region?.name}
          </p>
          <p className="truncate text-xl font-bold leading-7">{formatName(entry.name)}</p>
          <div className="mt-1 flex gap-1.5">
            {entry.types.map((type) => (
              <TypeChip key={type} type={type} />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Deseleccionar Pokémon"
          className="grid size-9 shrink-0 self-start place-items-center rounded-full text-ink-muted hover:bg-elevated hover:text-ink"
        >
          <Icon name="close" />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onOpenDetail}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-lime text-sm font-semibold text-on-lime transition-colors hover:bg-lime-soft"
        >
          Ver ficha completa
        </button>
        <FavoriteButton pokemonId={pokemonId} compact />
      </div>
    </section>
  );
}