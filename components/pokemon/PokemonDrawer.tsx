import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import ErrorState from "@/components/ui/ErrorState";
import PokemonProfile from "@/components/pokemon/PokemonProfile";
import PokemonProfileSkeleton from "@/components/pokemon/PokemonProfileSkeleton";
import { fetchPokemonDetail } from "@/lib/pokemon/client";
import type { PokemonDetail } from "@/lib/pokemon/utils";

type Status = "loading" | "ready" | "error";

interface PokemonDrawerProps {
  pokemonId: number;
  regionName: string;
  isFavorite: boolean;
  favoritesFull: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}

export default function PokemonDrawer({ pokemonId, onClose, ...profileProps }: PokemonDrawerProps) {
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
      className="absolute inset-y-4 right-4 z-10 flex w-105 max-w-[calc(100%-2rem)] animate-drawer-in flex-col gap-6 overflow-y-auto rounded-lg border border-line bg-surface p-6 shadow-panel"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar ficha"
        className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-ink-muted hover:bg-elevated hover:text-ink"
      >
        <Icon name="close" />
      </button>

      {status === "loading" && <PokemonProfileSkeleton />}

      {status === "error" && (
        <ErrorState
          className="mt-8"
          title="No pudimos leer la señal"
          message="La PokéAPI no respondió. Revisá tu conexión y volvé a intentar."
          onRetry={retry}
        />
      )}

      {status === "ready" && pokemon && <PokemonProfile pokemon={pokemon} {...profileProps} />}
    </aside>
  );
}