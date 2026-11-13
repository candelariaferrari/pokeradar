"use client";

import { useEffect } from "react";
import { collectionStore } from "@/lib/pokemon/collection-store";

export default function DiscoverOnView({ pokemonId }: { pokemonId: number }) {
  useEffect(() => {
    collectionStore.discover(pokemonId);
  }, [pokemonId]);

  return null;
}