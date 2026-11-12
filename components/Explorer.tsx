"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import type { SidebarContentProps } from "@/components/layout/SidebarContent";
import PokemonDrawer from "@/components/pokemon/PokemonDrawer";
import RadarToolbar from "@/components/map/RadarToolbar";
import MobileRegionBar from "@/components/mobile/MobileRegionBar";
import MobileRegionsSheet from "@/components/mobile/MobileRegionsSheet";
import PokemonPeek from "@/components/mobile/PokemonPeek";
import { REGIONS, findNearestRegion, type PokemonType, type RegionId } from "@/lib/radar/regions";
import { getPokemonEntry, scanRegion, typesAvailableIn, type DetectedPokemon } from "@/lib/radar/scan";
import { collectionStore, useCollection } from "@/lib/pokemon/collection-store";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import PokemonSearch from "@/components/layout/PokemonSearch";
import TeamPanel from "@/components/layout/TeamPanel";

const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 animate-pulse bg-surface" />,
});

const INITIAL_REGION: RegionId = "misiones";

export default function Explorer() {
  const [regionId, setRegionId] = useState<RegionId>(INITIAL_REGION);
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(null);
  const [detected, setDetected] = useState<DetectedPokemon[]>([]);
  const [pokemonId, setPokemonId] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false); // ficha completa en mobile
  const [regionsOpen, setRegionsOpen] = useState(false); // hoja de regiones en mobile
  const [teamOpen, setTeamOpen] = useState(false); // equipo abajo del mapa en mobile
  const { discovered, favorites } = useCollection();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];

  function handleSelectRegion(id: RegionId) {
    setRegionId(id);
    setTypeFilter(null);
    setPokemonId(null);
    setDetected(scanRegion(id));
  }

  function handleScan() {
    setPokemonId(null);
    setDetected(scanRegion(regionId, { type: typeFilter }));
  }

  function handleTypeFilter(type: PokemonType | null) {
    setTypeFilter(type);
    setPokemonId(null);
    setDetected(scanRegion(regionId, { type }));
  }

  /** Tocar un marcador: en desktop abre la ficha; en mobile, la vista previa */
  function handleSelectPokemon(id: number) {
    setPokemonId(id);
    setDetailOpen(false);
    collectionStore.discover(id);
  }

  /** Desde "Tu equipo" se va directo a la ficha (también en mobile) */
  function handleOpenFromTeam(id: number) {
    handleSelectPokemon(id);
    setDetailOpen(true);
  }

  function handleSearchSelect(id: number) {
    const entry = getPokemonEntry(id);
    if (!entry) return;
    setRegionId(entry.region);
    setTypeFilter(null);
    setDetected(scanRegion(entry.region, { include: id }));
    handleSelectPokemon(id);
  }

  function handleUserLocated(point: [number, number]) {
    const nearest = findNearestRegion(point);
    if (!nearest) return false;
    handleSelectRegion(nearest.id);
    return true;
  }

  function closeDrawer() {
    if (isDesktop) setPokemonId(null);
    else setDetailOpen(false); // en mobile vuelve a la vista previa
  }

  const openEntry = pokemonId !== null ? getPokemonEntry(pokemonId) : undefined;
  const habitat = REGIONS.find((r) => r.id === openEntry?.region) ?? region;
  const showDrawer = pokemonId !== null && (isDesktop || detailOpen);

  const sidebarProps: SidebarContentProps = {
    selectedRegionId: regionId,
    favorites,
    onSelectRegion: handleSelectRegion,
    onSelectPokemon: handleOpenFromTeam,
    onSearchSelect: handleSearchSelect,
  };

  return (
    <>
      <Header
        discoveredCount={discovered.length}
        favoritesCount={favorites.length}
        teamOpen={teamOpen && !isDesktop}
        onTeamClick={() => {
          if (isDesktop) return; // en desktop el equipo ya está siempre visible en el sidebar
          setPokemonId(null);
          setTeamOpen((open) => !open);
        }}
      />
      <main className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 p-3 lg:grid-cols-[340px_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-4 lg:p-4">        <Sidebar {...sidebarProps} />
        {/* Solo mobile: buscador siempre visible */}
        <div className="lg:hidden">
          <PokemonSearch onSelect={handleSearchSelect} />
        </div>
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

          <RadarToolbar
            detectedCount={detected.length}
            onScan={handleScan}
            types={typesAvailableIn(regionId)}
            typeFilter={typeFilter}
            onTypeFilter={handleTypeFilter}
          />

          {showDrawer && pokemonId !== null && (
            <PokemonDrawer
              key={pokemonId}
              pokemonId={pokemonId}
              regionName={`${habitat.name} · ${habitat.province}`}
              onClose={closeDrawer}
            />
          )}
        </section>

        {/* Solo mobile: Pokémon elegido > equipo > región */}
        <div className="lg:hidden">
          {pokemonId !== null && !isDesktop ? (
            <PokemonPeek
              key={pokemonId}
              pokemonId={pokemonId}
              onOpenDetail={() => setDetailOpen(true)}
              onClose={() => setPokemonId(null)}
            />
          ) : teamOpen ? (
            <div className="animate-sheet-in rounded-lg bg-surface">
              <TeamPanel favorites={favorites} onSelectPokemon={handleOpenFromTeam} />
            </div>
          ) : (
            <MobileRegionBar region={region} onOpen={() => setRegionsOpen(true)} />
          )}
        </div>
      </main>

      {regionsOpen && (
        <MobileRegionsSheet
          {...sidebarProps}
          onSelectRegion={(id) => {
            handleSelectRegion(id);
            setRegionsOpen(false);
          }}
          onSelectPokemon={(id) => {
            handleOpenFromTeam(id);
            setRegionsOpen(false);
          }}
          onSearchSelect={(id) => {
            handleSearchSelect(id);
            setRegionsOpen(false);
          }}
          onClose={() => setRegionsOpen(false)}
          showSearch={false}
        />
      )}
    </>
  );
}