"use client";

import Icon from "@/components/ui/Icon";
import { MAX_FAVORITES, collectionStore, useCollection } from "@/lib/pokemon/collection-store";

export default function FavoriteButton({ pokemonId }: { pokemonId: number }) {
  const { favorites } = useCollection();
  const isFavorite = favorites.includes(pokemonId);
  const isFull = favorites.length >= MAX_FAVORITES;

  return (
    <button
      type="button"
      onClick={() => collectionStore.toggleFavorite(pokemonId)}
      aria-pressed={isFavorite}
      disabled={!isFavorite && isFull}
      className="mt-auto inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full border-[1.5px] border-lime text-sm font-medium transition-colors hover:bg-lime-glow disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent aria-pressed:bg-lime-glow aria-pressed:text-lime-soft"
    >
      <Icon name="heart" filled={isFavorite} />
      {isFavorite ? "En tu equipo" : isFull ? `Equipo completo (${MAX_FAVORITES}/${MAX_FAVORITES})` : "Agregar al equipo"}
    </button>
  );
}