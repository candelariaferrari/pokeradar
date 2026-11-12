import { useEffect, useState } from "react";
import Image from "next/image";
import TypeChip from "@/components/ui/TypeChip";
import StatBars from "@/components/pokemon/StatBars";
import { fetchPokemonDetail } from "@/lib/pokemon-client";
import { formatDexNumber, formatName, type PokemonDetail } from "@/lib/pokemon";

type Status = "loading" | "ready" | "error";

interface PokemonDrawerProps {
  pokemonId: number;
  regionName: string;
  onClose: () => void;
}

export default function PokemonDrawer({ pokemonId, regionName, onClose }: PokemonDrawerProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Pedir los datos (y volver a pedirlos si el usuario toca "Reintentar")
  useEffect(() => {
    let cancelled = false;
    fetchPokemonDetail(pokemonId)
      .then((data) => {
        if (cancelled) return;
        setPokemon(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [pokemonId, attempt]);

  // Cerrar con Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function retry() {
    setStatus("loading");
    setAttempt((n) => n + 1);
  }

  return (
    <aside
      aria-label="Ficha del Pokémon"
      aria-busy={status === "loading"}
      className="absolute inset-y-4 right-4 z-10 flex w-105-w-[calc(100%-2rem)] animate-drawer-in flex-col gap-6 overflow-y-auto rounded-lg border border-line bg-surface p-6 shadow-panel"
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

      {status === "loading" && <DrawerSkeleton />}

      {status === "error" && (
        <div role="alert" className="mt-8 flex flex-col items-start gap-3 rounded-md border border-line bg-elevated p-4">
          <strong className="flex items-center gap-2 font-semibold text-danger">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 8v5M12 16.5v.5M10.3 4.2L2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
            </svg>
            No pudimos leer la señal
          </strong>
          <p className="text-ink-muted">La PokéAPI no respondió. Revisá tu conexión y volvé a intentar.</p>
          <button
            type="button"
            onClick={retry}
            className="h-11 rounded-full border border-line bg-surface px-5 text-sm font-medium hover:border-line-strong"
          >
            Reintentar
          </button>
        </div>
      )}

      {status === "ready" && pokemon && (
        <>
          <div className="grid grid-cols-[minmax(0,1fr)_132px] items-start gap-4">
            <div>
              <span className="inline-flex h-7 items-center rounded-full bg-elevated px-3 font-mono text-[13px]">
                {formatDexNumber(pokemon.id)}
              </span>
              <h2 className="mt-3 text-[40px] font-bold leading-11cking-tight">
                {formatName(pokemon.name)}
              </h2>
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
                className="size-30ct-contain"
              />
            </div>
          </div>

          {pokemon.description && (
            <p className="text-[15px] leading-5.5 text-ink-muted">{pokemon.description}</p>
          )}

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

          <section className="border-t border-line pt-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="fill-none stroke-lime" strokeWidth="1.8" strokeLinecap="round">
                <path d="M5 19v-5M10 19V9M15 19v-7M20 19V5" />
              </svg>
              Estadísticas base
            </h3>
            <StatBars stats={pokemon.stats} />
          </section>

          <section className="border-t border-line pt-6">
            <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="fill-none stroke-lime" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19l7-7" />
              </svg>
              Hábitat en PokéradAR
            </h3>
            <p className="text-ink-muted">{regionName}</p>
          </section>
        </>
      )}
    </aside>
  );
}

function DrawerSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-label="Cargando ficha">
      <div className="grid grid-cols-[minmax(0,1fr)_132px] gap-4">
        <div className="flex flex-col gap-3">
          <span className="h-7 w-20 animate-pulse rounded-full bg-elevated" />
          <span className="h-10 w-3/4 animate-pulse rounded-sm bg-elevated" />
          <div className="flex gap-2">
            <span className="h-8 w-24 animate-pulse rounded-full bg-elevated" />
            <span className="h-8 w-20 animate-pulse rounded-full bg-elevated" />
          </div>
        </div>
        <span className="mt-6 size-33 animate-pulse rounded-full bg-elevated" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="h-3.5 w-full animate-pulse rounded-sm bg-elevated" />
        <span className="h-3.5 w-2/3 animate-pulse rounded-sm bg-elevated" />
      </div>
      <div className="flex flex-col gap-3 border-t border-line pt-6">
        {[90, 80, 70, 85, 75, 60].map((w) => (
          <span key={w} className="h-2 animate-pulse rounded-full bg-elevated" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}