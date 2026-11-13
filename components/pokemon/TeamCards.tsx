import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import TypeChip from "@/components/ui/TypeChip";
import { artworkUrl, formatDexNumber, formatName, type PokemonRegionEntry } from "@/lib/pokemon/utils";
import { REGIONS } from "@/lib/radar/regions";

interface TeamCardsProps {
  team: PokemonRegionEntry[];
  onSelect?: (id: number) => void;
}

const CARD =
  "group flex h-full w-full flex-col items-center gap-2 rounded-lg border border-line bg-surface p-5 text-center transition-colors hover:border-(--type-color)";

/** Mobile: carrusel con imán · Desktop: grilla */
export default function TeamCards({ team, onSelect }: TeamCardsProps) {
  return (
    <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
      {team.map((pokemon) => {
        const region = REGIONS.find((r) => r.id === pokemon.region);
        const style = { "--type-color": `var(--color-type-${pokemon.types[0]})` } as CSSProperties;

        const content: ReactNode = (
          <>
            <span className="mb-2 grid size-36 place-items-center rounded-full border-[1.5px] border-(--type-color) bg-elevated">
              <Image
                src={artworkUrl(pokemon.id)}
                alt=""
                width={128}
                height={128}
                className="size-32 transition-transform group-hover:scale-105 motion-reduce:transition-none"
              />
            </span>
            <span className="font-mono text-xs text-ink-muted">{formatDexNumber(pokemon.id)}</span>
            <span className="text-2xl font-bold tracking-tight">{formatName(pokemon.name)}</span>
            <span className="text-sm text-ink-muted">{region?.name}</span>
            <span className="mt-1 flex gap-1.5">
              {pokemon.types.map((type) => (
                <TypeChip key={type} type={type} />
              ))}
            </span>
          </>
        );

        return (
          <li key={pokemon.id} className="w-[78%] shrink-0 snap-center sm:w-auto">
            {onSelect ? (
              <button type="button" onClick={() => onSelect(pokemon.id)} style={style} className={CARD}>
                {content}
              </button>
            ) : (
              <Link href={`/pokemon/${pokemon.id}`} style={style} className={CARD}>
                {content}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}