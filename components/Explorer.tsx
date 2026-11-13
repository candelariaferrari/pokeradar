"use client";

import { useEffect, useRef, useState } from "react";
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
import { useRegionWeather } from "@/lib/hooks/use-region-weather";
import { fetchRegionWeather, getCachedWeather } from "@/lib/radar/weather-client";
import { weatherBoost } from "@/lib/radar/weather-boost";
import { playSound } from "@/lib/sound/sound";
import MapLoading from "@/components/map/MapLoading";

const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => <MapLoading />,
});

const INITIAL_REGION: RegionId = "misiones";

export default function Explorer() {
  const [regionId, setRegionId] = useState<RegionId>(INITIAL_REGION);
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(null);
  const [detected, setDetected] = useState<DetectedPokemon[]>([]);
  const [pokemonId, setPokemonId] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false); 
  const [regionsOpen, setRegionsOpen] = useState(false); 
  const [teamOpen, setTeamOpen] = useState(false); 
  const { discovered, favorites } = useCollection();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const currentWeather = useRegionWeather(regionId);
  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];
  const [leaving, setLeaving] = useState<DetectedPokemon[]>([]); 
  const [drawerClosing, setDrawerClosing] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    REGIONS.forEach((r) => {
      fetchRegionWeather(r.id).catch(() => { });
    });
  }, []);

  // Al desmontar, cancelar temporizadores pendientes
  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function scan(id: RegionId, options?: Parameters<typeof scanRegion>[1]) {
    const boost = weatherBoost(getCachedWeather(id))?.types; // el clima favorece algunos tipos
    setLeaving(detected);
    setDetected(scanRegion(id, { ...options, boost }));
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setLeaving([]), 400);
  }
  function handleSelectRegion(id: RegionId) {
    setRegionId(id);
    setTypeFilter(null);
    setPokemonId(null);
    scan(id);
  }

  function handleScan() {
    setPokemonId(null);
    scan(regionId, { type: typeFilter });
  }

  function handleTypeFilter(type: PokemonType | null) {
    playSound("scan");
    setTypeFilter(type);
    setPokemonId(null);
    scan(regionId, { type });
  }

  function handleSelectPokemon(id: number) {
    playSound("select");
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDrawerClosing(false);
    setPokemonId(id);
    setDetailOpen(false);
    collectionStore.discover(id);
  }

  function handleOpenFromTeam(id: number) {
    handleSelectPokemon(id);
    setDetailOpen(true);
  }

  function handleSearchSelect(id: number) {
    const entry = getPokemonEntry(id);
    if (!entry) return;
    setRegionId(entry.region);
    setTypeFilter(null);
    scan(entry.region, { include: id });
    handleSelectPokemon(id);
  }

  function handleUserLocated(point: [number, number]) {
    const nearest = findNearestRegion(point);
    if (!nearest) return false;
    handleSelectRegion(nearest.id);
    return true;
  }

  function finishCloseDrawer() {
    setDrawerClosing(false);
    if (isDesktop) setPokemonId(null);
    else setDetailOpen(false); 
  }

  function closeDrawer() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishCloseDrawer();
      return;
    }
    setDrawerClosing(true);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(finishCloseDrawer, 220); 
  }

  function handleMapClick() {
    if (pokemonId === null) return;
    if (isDesktop) closeDrawer();
    else setPokemonId(null); 
  }
  
  function handleScanClick() {
    playSound("scan");
    handleScan();
  }

  function handleUserSelectRegion(id: RegionId) {
    playSound("scan");
    handleSelectRegion(id);
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
          if (isDesktop) return; 
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
            leavingPokemons={leaving}
            selectedPokemonId={pokemonId}
            onSelectPokemon={handleSelectPokemon}
            onReady={handleScan}
            onUserLocated={handleUserLocated}
            onMapClick={handleMapClick}
            focusOffsetX={isDesktop ? -250 : 0}
          />

          <RadarToolbar
            detectedCount={detected.length}
            onScan={handleScan}
            types={typesAvailableIn(regionId)}
            typeFilter={typeFilter}
            onTypeFilter={handleTypeFilter}
            boost={weatherBoost(currentWeather)}
          />

          {showDrawer && pokemonId !== null && (
            <PokemonDrawer
              key={pokemonId}
              pokemonId={pokemonId}
              regionName={`${habitat.name} · ${habitat.province}`}
              closing={drawerClosing}
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