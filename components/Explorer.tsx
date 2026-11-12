"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import PokemonDrawer from "@/components/pokemon/PokemonDrawer";
import { REGIONS, findNearestRegion, type RegionId } from "@/lib/radar/regions";
import { getPokemonEntry, scanRegion, type DetectedPokemon } from "@/lib/radar/scan";
import { collectionStore, useCollection } from "@/lib/pokemon/collection-store";
import RadarToolbar from "@/components/map/RadarToolbar";

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
          <RadarToolbar detectedCount={detected.length} onScan={handleScan} />

           {pokemonId !== null && (
            <PokemonDrawer
              key={pokemonId}
              pokemonId={pokemonId}
              regionName={`${habitat.name} · ${habitat.province}`}
              onClose={() => setPokemonId(null)}
            />
          )}
        </section>
      </main>
    </>
  );
}