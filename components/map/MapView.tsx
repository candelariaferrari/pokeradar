"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Region } from "@/lib/radar/regions";
import type { DetectedPokemon } from "@/lib/radar/scan";
import RadarMarker from "@/components/map/RadarMarker";
import Icon, { type IconName } from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";

maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");

const STYLE_URL = "https://tiles.openfreemap.org/styles/dark";
const MAX_BOUNDS: [[number, number], [number, number]] = [[-82, -58], [-46, -18]];
const ARGENTINA_VIEW: [[number, number], [number, number]] = [[-74, -55.5], [-53, -21.5]];

const COLORS = {
  land: "#19251E",  // --color-surface
  water: "#0B120E", // un tono más oscuro que --color-deep
};

function applyPokeradarColors(map: maplibregl.Map) {
  for (const layer of map.getStyle().layers) {
    if (layer.type === "background") {
      map.setPaintProperty(layer.id, "background-color", COLORS.land);
    }
    if (layer.type === "fill" && layer.id.includes("water")) {
      map.setPaintProperty(layer.id, "fill-color", COLORS.water);
    }
  }
}

function isInsideArgentina([lng, lat]: [number, number]) {
  const [[west, south], [east, north]] = MAX_BOUNDS;
  return lng >= west && lng <= east && lat >= south && lat <= north;
}

interface MapViewProps {
  region: Region;
  pokemons: DetectedPokemon[];
  selectedPokemonId: number | null;
  /** Devuelve true si la ubicación cayó cerca de una región (y la seleccionó) */
  onUserLocated: (point: [number, number]) => boolean;
  onSelectPokemon: (id: number) => void;
  onReady: () => void;
  /** Los del escaneo anterior, mientras hacen su animación de salida */
  leavingPokemons: DetectedPokemon[];
  /** Clic en una parte vacía del mapa */
  onMapClick: () => void;
}

export default function MapView({
  region,
  pokemons,
  leavingPokemons,
  selectedPokemonId,
  onSelectPokemon,
  onReady,
  onUserLocated,
  onMapClick,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [zoom, setZoom] = useState(region.zoom);
  const onMapClickRef = useRef(onMapClick);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  function flyToUser(position: GeolocationPosition) {
    const map = mapRef.current;
    if (!map) return;

    const lngLat: [number, number] = [position.coords.longitude, position.coords.latitude];
    if (!isInsideArgentina(lngLat)) return;

    if (!userMarkerRef.current) {
      const el = document.createElement("div");
      el.className =
        "size-4 rounded-full border-2 border-deep bg-lime shadow-[0_0_0_6px_var(--color-lime-glow)]";
      el.setAttribute("aria-label", "Tu ubicación");
      userMarkerRef.current = new maplibregl.Marker({ element: el }).setLngLat(lngLat).addTo(map);
    } else {
      userMarkerRef.current.setLngLat(lngLat);
    }

    const selectedNearbyRegion = onUserLocated(lngLat);
    if (!selectedNearbyRegion) {
      map.flyTo({ center: lngLat, zoom: 9, duration: 1500, essential: true });
    }
  }

  function locateUser() {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      flyToUser,
      (error) => console.info("Ubicación no disponible:", error.message),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 10 * 60 * 1000 }
    );
  }

  // 1) Crear el mapa una sola vez
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: region.center,
      zoom: region.zoom,
      minZoom: 3.5,
      maxZoom: 12,
      maxBounds: MAX_BOUNDS,
      attributionControl: { compact: true },
    });

    map.on("load", () => {
      applyPokeradarColors(map);
      onReady();
      navigator.permissions
        ?.query({ name: "geolocation" })
        .then((status) => {
          if (status.state === "granted") locateUser();
        })
        .catch(() => { });
    });
    map.on("zoomend", () => setZoom(map.getZoom()));
    // Clic en el mapa (no en un marcador, y sin arrastrar): cerrar la selección
    map.on("click", (e) => {
      const target = e.originalEvent.target as HTMLElement | null;
      if (target?.closest(".maplibregl-marker")) return;
      onMapClickRef.current();
    });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      userMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Cada vez que cambia la región, la cámara vuela hacia ella
  useEffect(() => {
    mapRef.current?.flyTo({ center: region.center, zoom: region.zoom, duration: 1200, essential: true });
  }, [region]);

  // 3) Un elemento HTML vacío por cada Pokémon detectado
  const markerNodes = useMemo(
    () => pokemons.map((pokemon) => ({ pokemon, element: document.createElement("div") })),
    [pokemons]
  );

  // 4) Esos elementos se agregan al mapa como marcadores
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers = markerNodes.map(({ pokemon, element }) =>
      new maplibregl.Marker({ element }).setLngLat(pokemon.position).addTo(map)
    );
    return () => markers.forEach((marker) => marker.remove());
  }, [markerNodes]);

  // 5) El seleccionado queda por encima de los demás
  useEffect(() => {
    markerNodes.forEach(({ pokemon, element }) => {
      element.style.zIndex = pokemon.id === selectedPokemonId ? "2" : "1";
    });
  }, [markerNodes, selectedPokemonId]);

  // 6) Marcadores del escaneo anterior, solo mientras hacen su salida
  const leavingNodes = useMemo(
    () => leavingPokemons.map((pokemon) => ({ pokemon, element: document.createElement("div") })),
    [leavingPokemons]
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = leavingNodes.map(({ pokemon, element }) =>
      new maplibregl.Marker({ element }).setLngLat(pokemon.position).addTo(map)
    );
    return () => markers.forEach((marker) => marker.remove());
  }, [leavingNodes]);
  return (
    <>
      <div className="absolute inset-0">
        <div ref={containerRef} className="h-full w-full" />
      </div>

      {/* React dibuja cada marcador DENTRO del elemento que maneja MapLibre */}
      {markerNodes.map(({ pokemon, element }, index) =>
        createPortal(
          <RadarMarker
            pokemon={pokemon}
            index={index}
            selected={pokemon.id === selectedPokemonId}
            onSelect={onSelectPokemon}
          />,
          element,
          String(pokemon.id)
        )
      )}
      {leavingNodes.map(({ pokemon, element }, index) =>
        createPortal(
          <RadarMarker pokemon={pokemon} index={index} selected={false} onSelect={() => { }} leaving />,
          element,
          `leaving-${pokemon.id}`
        )
      )}

      {/* Controles */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <div className="flex flex-col rounded-md border border-line bg-surface shadow-panel">
          <MapButton label="Acercar" onClick={() => mapRef.current?.zoomIn()} icon="plus" />
          <MapButton label="Alejar" onClick={() => mapRef.current?.zoomOut()} icon="minus" withBorder />
        </div>
        <div className="flex flex-col rounded-md border border-line bg-surface shadow-panel">
          <MapButton label="Mi ubicación" onClick={locateUser} icon="locate" />
          <MapButton
            label="Ver Argentina completa"
            onClick={() => mapRef.current?.fitBounds(ARGENTINA_VIEW, { padding: 40, duration: 1200 })}
            icon="map"
            withBorder
          />
        </div>
      </div>

      <span className="absolute bottom-4 left-4 z-10 hidden h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 font-mono text-[13px] text-ink-muted lg:inline-flex">
        Zoom <b className="font-medium text-ink">{zoom.toFixed(1)}</b>
      </span>
    </>
  );
}

interface MapButtonProps {
  label: string;
  onClick: () => void;
  icon: IconName;
  withBorder?: boolean;
}
function MapButton({ label, onClick, icon, withBorder }: MapButtonProps) {
  return (
    <Tooltip label={label} side="left" className={withBorder ? "border-t border-line" : ""}>
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="grid size-12 place-items-center rounded-md text-ink transition-colors hover:bg-elevated hover:text-lime"
      >
        <Icon name={icon} size={20} />
      </button>
    </Tooltip>
  );
}