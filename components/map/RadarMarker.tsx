import type { CSSProperties } from "react";
import type { DetectedPokemon } from "@/lib/radar/scan";
import PokemonSprite from "@/components/pokemon/PokemonSprite";
import { formatDexNumber, formatName } from "@/lib/pokemon/utils";

interface RadarMarkerProps {
  pokemon: DetectedPokemon;
  selected: boolean;
  onSelect: (id: number) => void;
  index: number;
  leaving?: boolean;
}

const RING_DELAYS = ["0s", "0.8s", "1.6s"];

export default function RadarMarker({ pokemon, selected, onSelect, index, leaving = false }: RadarMarkerProps) {
  if (leaving) {
    return (
      <span
        aria-hidden="true"
        style={{ animationDelay: `${index * 30}ms` }}
        className="pointer-events-none grid size-12 animate-marker-out place-items-center rounded-full motion-reduce:hidden"
      >
        <span className="grid size-full place-items-center overflow-hidden rounded-full border-2 border-line-strong bg-surface">
          <PokemonSprite id={pokemon.id} className="size-[125%]" />
        </span>
      </span>
    );
  }

  const style = {
    animationDelay: `${250 + index * 70}ms`,
    "--type-color": `var(--color-type-${pokemon.types[0]})`,
  } as CSSProperties;

  return (
    <button
      type="button"
      onClick={() => onSelect(pokemon.id)}
      aria-pressed={selected}
      aria-label={`${formatName(pokemon.name)}, ${formatDexNumber(pokemon.id)}`}
      style={style}
      className={`group relative grid animate-marker-in place-items-center rounded-full transition-[width,height] duration-200 motion-reduce:animate-none ${selected ? "size-16" : "size-12"
        }`}
    >
      {selected ? (
        RING_DELAYS.map((delay) => (
          <span
            key={delay}
            aria-hidden="true"
            style={{ animationDelay: delay }}
            className="absolute inset-0 animate-radar-ping rounded-full border-[1.5px] border-lime motion-reduce:hidden"
          />
        ))
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-(--type-color) opacity-0 group-hover:animate-radar-ping group-focus-visible:animate-radar-ping motion-reduce:hidden"
        />
      )}

      <span
        className={`relative grid size-full place-items-center overflow-hidden rounded-full border-2 bg-surface transition-transform group-hover:scale-105 ${selected ? "border-lime shadow-glow" : "border-(--type-color)"
          }`}
      >
        <PokemonSprite id={pokemon.id} className="size-[125%]" />
      </span>
    </button>
  );
}