"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/layout/Sidebar";
import PokemonDrawer from "@/components/pokemon/PokemonDrawer";
import { REGIONS, type RegionId } from "@/lib/regions";

// El mapa solo existe en el navegador: lo cargamos sin SSR
const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 animate-pulse bg-surface" />,
});

export default function Explorer() {
  const [regionId, setRegionId] = useState<RegionId>("litoral");
  const [pokemonId, setPokemonId] = useState<number | null>(null);

  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];

  function handleSelectRegion(id: RegionId) {
    setRegionId(id);
    setPokemonId(null);
  }

  return (
    <main className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[340px_minmax(0,1fr)]">
      <Sidebar selectedRegionId={regionId} onSelectRegion={handleSelectRegion} />

      <section
        aria-label="Mapa de Argentina"
        className="relative min-h-0 overflow-hidden rounded-lg border border-line bg-deep"
      >
        <MapView region={region} />

        {/* TEMPORAL: lo reemplazan los marcadores en el paso 5 */}
        <button
          type="button"
          onClick={() => setPokemonId(1)}
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-lime bg-surface px-5 py-2.5 text-sm font-medium hover:bg-lime-glow"
        >
          Probar: tocar un Pokémon
        </button>

        {pokemonId !== null && (
          <PokemonDrawer key={pokemonId} pokemonId={pokemonId} onClose={() => setPokemonId(null)} />
        )}
      </section>
    </main>
  );
}