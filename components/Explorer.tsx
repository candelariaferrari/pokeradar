"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import PokemonDrawer from "@/components/pokemon/PokemonDrawer";
import { REGIONS, findNearestRegion, type RegionId } from "@/lib/regions";
import { getPokemonEntry, scanRegion, type DetectedPokemon } from "@/lib/radar";
import { MAX_FAVORITES, collectionStore, useCollection } from "@/lib/collection-store";

const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 animate-pulse bg-surface" />,
});

const INITIAL_REGION: RegionId = "misiones";

export default function Explorer() {
  const [regionId, setRegionId] = useState<RegionId>(INITIAL_REGION);
  const [detected, setDetected] = useState<DetectedPokemon[]>([]);
  const [pokemonId, setPokemonId] = useState<number | null>(null);
  const { discovered, favorites } = useCollection();

  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];

  function handleSelectRegion(id: RegionId) {
    setRegionId(id);
    setPokemonId(null);
    setDetected(scanRegion(id));
  }

  function handleScan() {
    setPokemonId(null);
    setDetected(scanRegion(regionId));
  }

  function handleSelectPokemon(id: number) {
    setPokemonId(id);
    collectionStore.discover(id);
  }

  function handleUserLocated(point: [number, number]) {
    const nearest = findNearestRegion(point);
    if (!nearest) return false;
    handleSelectRegion(nearest.id);
    return true;
  }

  // Hábitat del Pokémon abierto (funciona aunque no esté detectado ahora)
  const openEntry = pokemonId !== null ? getPokemonEntry(pokemonId) : undefined;
  const habitat = REGIONS.find((r) => r.id === openEntry?.region) ?? region;
  const isFavorite = pokemonId !== null && favorites.includes(pokemonId);

  return (
    <>
      <Header discoveredCount={discovered.length} favoritesCount={favorites.length} />

      <main className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Sidebar
          selectedRegionId={regionId}
          onSelectRegion={handleSelectRegion}
          favorites={favorites}
          onSelectPokemon={handleSelectPokemon}
        />

        <section
          aria-label="Mapa de Argentina"
          className="relative min-h-0 overflow-hidden rounded-lg border border-line bg-deep"
        >
          <MapView
            region={region}
            pokemons={detected}
            selectedPokemonId={pokemonId}
            onSelectPokemon={handleSelectPokemon}
            onReady={handleScan}
            onUserLocated={handleUserLocated}
          />

          <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
            <span
              role="status"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium shadow-panel"
            >
              <span aria-hidden="true" className="size-2.5 rounded-full bg-lime shadow-[0_0_0_4px_var(--color-lime-glow)]" />
              {detected.length > 0 ? (
                <>
                  <span className="font-mono">{detected.length}</span> detectados
                </>
              ) : (
                "Escaneando…"
              )}
            </span>
            <button
              type="button"
              onClick={handleScan}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-lime px-5 text-sm font-semibold text-on-lime shadow-panel transition-colors hover:bg-lime-soft"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="fill-none stroke-current" strokeWidth="2" strokeLinecap="round">
                <path d="M12 12l6-6M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5" />
              </svg>
              Escanear zona
            </button>
          </div>

          {pokemonId !== null && (
            <PokemonDrawer
              key={pokemonId}
              pokemonId={pokemonId}
              regionName={`${habitat.name} · ${habitat.province}`}
              isFavorite={isFavorite}
              favoritesFull={favorites.length >= MAX_FAVORITES}
              onToggleFavorite={() => collectionStore.toggleFavorite(pokemonId)}
              onClose={() => setPokemonId(null)}
            />
          )}
        </section>
      </main>
    </>
  );
}