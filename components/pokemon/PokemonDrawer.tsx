import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import ErrorState from "@/components/ui/ErrorState";
import PokemonProfile from "@/components/pokemon/PokemonProfile";
import PokemonProfileSkeleton from "@/components/pokemon/PokemonProfileSkeleton";
import CopyLinkButton from "@/components/pokemon/CopyLinkButton";
import { fetchPokemonDetail } from "@/lib/pokemon/client";
import type { PokemonDetail } from "@/lib/pokemon/utils";

type Status = "loading" | "ready" | "error";

interface PokemonDrawerProps {
  pokemonId: number;
  regionName: string;
  /** true mientras se reproduce la animación de salida */
  closing: boolean;
  onClose: () => void;
}

export default function PokemonDrawer({ pokemonId, regionName, closing, onClose }: PokemonDrawerProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Pedir los datos (y volver a pedirlos con "Reintentar")
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
      className={`fixed inset-0 z-50 flex flex-col gap-6 overflow-y-auto scrollbar-none bg-surface p-6 motion-reduce:animate-none lg:absolute lg:inset-y-4 lg:left-auto lg:right-4 lg:z-10 lg:w-120 lg:max-w-[calc(100%-2rem)] lg:rounded-lg lg:border lg:border-line lg:shadow-panel ${
        closing ? "animate-drawer-out" : "animate-drawer-in"
      }`}
    >
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1">
        {status === "ready" && <CopyLinkButton pokemonId={pokemonId} />}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ficha"
          className="grid size-9 place-items-center rounded-full text-ink-muted hover:bg-elevated hover:text-ink"
        >
          <Icon name="close" />
        </button>
      </div>

      {status === "loading" && <PokemonProfileSkeleton />}

      {status === "error" && (
        <ErrorState
          className="mt-8"
          title="No pudimos leer la señal"
          message="La PokéAPI no respondió. Revisá tu conexión y volvé a intentar."
          onRetry={retry}
        />
      )}

      {status === "ready" && pokemon && <PokemonProfile pokemon={pokemon} regionName={regionName} stickyFooter />}
    </aside>
  );
}