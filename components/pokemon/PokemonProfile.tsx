import type { ReactNode } from "react";
import Image from "next/image";
import Icon, { type IconName } from "@/components/ui/Icon";
import TypeChip from "@/components/ui/TypeChip";
import StatBars from "@/components/pokemon/StatBars";
import { formatDexNumber, formatName, type PokemonDetail } from "@/lib/pokemon/utils";

interface PokemonProfileProps {
  pokemon: PokemonDetail;
  regionName: string;
  isFavorite: boolean;
  favoritesFull: boolean;
  onToggleFavorite: () => void;
}

export default function PokemonProfile({
  pokemon,
  regionName,
  isFavorite,
  favoritesFull,
  onToggleFavorite,
}: PokemonProfileProps) {
  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_132px] items-start gap-4">
        <div>
          <span className="inline-flex h-7 items-center rounded-full bg-elevated px-3 font-mono text-[13px]">
            {formatDexNumber(pokemon.id)}
          </span>
          <h2 className="mt-3 text-[40px] font-bold leading-11 tracking-tight">{formatName(pokemon.name)}</h2>
          {pokemon.genus && <p className="mt-1 text-sm text-ink-muted">{pokemon.genus}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {pokemon.types.map((type, i) => (
              <TypeChip key={type} type={type} solid={i === 0} />
            ))}
          </div>
        </div>
        <div className="mt-6 grid size-33 place-items-center overflow-hidden rounded-full border-[1.5px] border-line-strong bg-elevated shadow-[0_0_32px_rgb(163_230_53/0.12)]">
          <Image
            src={pokemon.artwork}
            alt={formatName(pokemon.name)}
            width={120}
            height={120}
            className="size-30 object-contain"
          />
        </div>
      </div>

      {pokemon.description && <p className="text-[15px] leading-5.5 text-ink-muted">{pokemon.description}</p>}

      <dl className="grid grid-cols-2 gap-3">
        <div className="rounded-md bg-elevated px-4 py-3">
          <dt className="text-xs text-ink-muted">Altura</dt>
          <dd className="font-mono text-[15px]">{pokemon.heightM.toLocaleString("es-AR")} m</dd>
        </div>
        <div className="rounded-md bg-elevated px-4 py-3">
          <dt className="text-xs text-ink-muted">Peso</dt>
          <dd className="font-mono text-[15px]">{pokemon.weightKg.toLocaleString("es-AR")} kg</dd>
        </div>
      </dl>

      <ProfileSection icon="bars" title="Estadísticas base">
        <StatBars stats={pokemon.stats} />
      </ProfileSection>

      <ProfileSection icon="leaf" title="Hábitat en PokéradAR">
        <p className="text-ink-muted">{regionName}</p>
      </ProfileSection>

      <button
        type="button"
        onClick={onToggleFavorite}
        aria-pressed={isFavorite}
        disabled={!isFavorite && favoritesFull}
        className="mt-auto inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full border-[1.5px] border-lime text-sm font-medium transition-colors hover:bg-lime-glow disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent aria-pressed:bg-lime-glow aria-pressed:text-lime-soft"
      >
        <Icon name="heart" filled={isFavorite} />
        {isFavorite ? "En tu equipo" : favoritesFull ? "Equipo completo (6/6)" : "Agregar al equipo"}
      </button>
    </>
  );
}

function ProfileSection({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Icon name={icon} className="text-lime" />
        {title}
      </h3>
      {children}
    </section>
  );
}