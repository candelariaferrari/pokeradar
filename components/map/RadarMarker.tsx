import type { DetectedPokemon } from "@/lib/radar";
import { formatDexNumber, formatName, spriteUrl } from "@/lib/pokemon";

interface RadarMarkerProps {
  pokemon: DetectedPokemon;
  selected: boolean;
  onSelect: (id: number) => void;
}

const RING_DELAYS = ["0s", "0.8s", "1.6s"];

export default function RadarMarker({ pokemon, selected, onSelect }: RadarMarkerProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(pokemon.id)}
      aria-pressed={selected}
      aria-label={`${formatName(pokemon.name)}, ${formatDexNumber(pokemon.id)}`}
      className={`group relative grid place-items-center rounded-full transition-[width,height] duration-200 ${
        selected ? "size-16" : "size-12"
      }`}
    >
      {/* Pulsos del radar: solo en el seleccionado */}
      {selected &&
        RING_DELAYS.map((delay) => (
          <span
            key={delay}
            aria-hidden="true"
            style={{ animationDelay: delay }}
            className="absolute inset-0 animate-radar-ping rounded-full border-[1.5px] border-lime motion-reduce:hidden"
          />
        ))}

      <span
        className={`relative grid size-full place-items-center overflow-hidden rounded-full border-2 bg-surface transition-transform group-hover:scale-105 ${
          selected ? "border-lime shadow-glow" : "border-line-strong group-hover:border-lime"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={spriteUrl(pokemon.id)}
          alt=""
          width={96}
          height={96}
          loading="lazy"
          draggable={false}
          className="size-[125%] max-w-none object-contain [image-rendering:pixelated]"
        />
      </span>
    </button>
  );
}