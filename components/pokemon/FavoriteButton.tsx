"use client";

import Icon from "@/components/ui/Icon";
import { MAX_FAVORITES, collectionStore, useCollection } from "@/lib/pokemon/collection-store";
import Tooltip from "@/components/ui/Tooltip";
import { playSound } from "@/lib/sound/sound";

interface FavoriteButtonProps {
  pokemonId: number;
  compact?: boolean;
}

export default function FavoriteButton({ pokemonId, compact = false }: FavoriteButtonProps) {
  const { favorites } = useCollection();
  const isFavorite = favorites.includes(pokemonId);
  const isFull = favorites.length >= MAX_FAVORITES;
  const label = isFavorite
    ? "En tu equipo"
    : isFull
      ? `Equipo completo (${MAX_FAVORITES}/${MAX_FAVORITES})`
      : "Agregar al equipo";

  const shared = {
    type: "button" as const,
    onClick: () => {
      const wasFavorite = isFavorite;
      if (collectionStore.toggleFavorite(pokemonId)) {
        playSound(wasFavorite ? "favoriteRemove" : "favoriteAdd");
      }
    },
    "aria-pressed": isFavorite,
    disabled: !isFavorite && isFull,
  };

  if (compact) {
    return (
      <Tooltip label={label} side="top">
        <button
          {...shared}
          aria-label={label}
          className="grid size-11 shrink-0 place-items-center rounded-full border-[1.5px] border-lime transition-colors hover:bg-lime-glow disabled:cursor-not-allowed disabled:opacity-45 aria-pressed:bg-lime-glow aria-pressed:text-lime-soft"
        >
          <Icon name="heart" size={20} filled={isFavorite} />
        </button>
      </Tooltip>
    );
  }

  return (
    <button
      {...shared}
      className="mt-auto inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full border-[1.5px] border-lime text-sm font-medium transition-colors hover:bg-lime-glow disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent aria-pressed:bg-lime-glow aria-pressed:text-lime-soft"
    >
      <Icon name="heart" filled={isFavorite} />
      {label}
    </button>
  );
}