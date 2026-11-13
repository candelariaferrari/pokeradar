import type { ReactNode } from "react";
import Image from "next/image";
import Icon, { type IconName } from "@/components/ui/Icon";
import TypeChip from "@/components/ui/TypeChip";
import StatBars from "@/components/pokemon/StatBars";
import FavoriteButton from "@/components/pokemon/FavoriteButton";
import { formatDexNumber, formatName, type PokemonDetail } from "@/lib/pokemon/utils";
import CryButton from "@/components/pokemon/CryButton";

interface PokemonProfileProps {
  pokemon: PokemonDetail;
  regionName: string;
  /** En el drawer, el botón de favoritos queda fijo abajo */
  stickyFooter?: boolean;
}

export default function PokemonProfile({ pokemon, regionName, stickyFooter = false }: PokemonProfileProps) {
  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_132px] items-start gap-4">
        <div>
          <span className="inline-flex h-7 items-center rounded-full bg-elevated px-3 font-mono text-[13px]">
            {formatDexNumber(pokemon.id)}
          </span>
          <div className="mt-3 flex items-center gap-3">
            <h2 className="min-w-0 break-words text-[40px] font-bold leading-11 tracking-tight">
              {formatName(pokemon.name)}
            </h2>
            {pokemon.cry && <CryButton src={pokemon.cry} name={formatName(pokemon.name)} />}
          </div>

          {pokemon.genus && <p className="mt-1 text-sm text-ink-muted">{pokemon.genus}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {pokemon.types.map((type, i) => (
              <TypeChip key={type} type={type} solid={i === 0} />
            ))}
          </div>
        </div>
        <div className="relative mt-10 size-33">
          {/* Halo del radar: dos pulsos suaves alrededor del círculo */}
          {["0s", "1.2s"].map((delay) => (
            <span
              key={delay}
              aria-hidden="true"
              style={{ animationDelay: delay }}
              className="absolute inset-0 animate-radar-halo rounded-full border-[1.5px] border-lime motion-reduce:hidden"
            />
          ))}
          <div className="relative grid size-full place-items-center overflow-hidden rounded-full border-[1.5px] border-lime bg-elevated shadow-glow">
            <Image
              src={pokemon.artwork}
              alt={formatName(pokemon.name)}
              width={120}
              height={120}
              className="size-30 object-contain"
            />
          </div>
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

      {stickyFooter ? (
        // Fijo abajo, con un degradé para que el contenido "pase por debajo"
        <div className="sticky bottom-0 -mx-6 -mb-6 mt-auto bg-linear-to-t from-surface from-70% to-transparent px-6 pb-6 pt-6">
          <FavoriteButton pokemonId={pokemon.id} />
        </div>
      ) : (
        <FavoriteButton pokemonId={pokemon.id} />
      )}
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