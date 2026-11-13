"use client";

import { useEffect } from "react";
import { collectionStore } from "@/lib/pokemon/collection-store";

/** No dibuja nada: solo marca el Pokémon como descubierto al verse */
export default function DiscoverOnView({ pokemonId }: { pokemonId: number }) {
  useEffect(() => {
    collectionStore.discover(pokemonId);
  }, [pokemonId]);

  return null;
}