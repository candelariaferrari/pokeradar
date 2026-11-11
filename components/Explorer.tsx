"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import PokemonDrawer from "@/components/pokemon/PokemonDrawer";
import type { RegionId } from "@/lib/regions";

export default function Explorer() {
  const [regionId, setRegionId] = useState<RegionId>("litoral");
  const [pokemonId, setPokemonId] = useState<number | null>(null);

  function handleSelectRegion(id: RegionId) {
    setRegionId(id);
    setPokemonId(null); // al cambiar de región se cierra la ficha
  }

  return (
    <main className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[340px_minmax(0,1fr)]">
      <Sidebar selectedRegionId={regionId} onSelectRegion={handleSelectRegion} />

      <section
        aria-label="Mapa de Argentina"
        className="relative min-h-0 overflow-hidden rounded-lg border border-line bg-deep"
      >
        {/* TEMPORAL: este botón simula tocar un marcador. Lo reemplaza el mapa en el paso 4 */}
        <div className="absolute inset-0 grid place-items-center">
          <button
            type="button"
            onClick={() => setPokemonId(1)}
            className="rounded-full border border-lime px-6 py-3 text-sm font-medium hover:bg-lime-glow"
          >
            Probar: tocar un Pokémon
          </button>
        </div>

        {pokemonId !== null && (
          <PokemonDrawer
            key={pokemonId}
            pokemonId={pokemonId}
            onClose={() => setPokemonId(null)}
          />
        )}
      </section>
    </main>
  );
}