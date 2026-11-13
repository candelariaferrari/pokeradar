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
import MapLoading from "@/components/map/MapLoading";
import { regionArea } from "@/lib/radar/geo";

maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");

const STYLE_URL = "https://tiles.openfreemap.org/styles/dark";
const MAX_BOUNDS: [[number, number], [number, number]] = [[-82, -58], [-46, -18]];
const ARGENTINA_VIEW: [[number, number], [number, number]] = [[-74, -55.5], [-53, -21.5]];
const HIDDEN_SOURCE_LAYERS = new Set([
  "building",
  "housenumber",
  "poi",
  "aeroway",
  "aerodrome_label",
  "mountain_peak",
  "landuse",
  "park",
  "transportation_name",
  "water_name",
]);

type MapStyle = ConstructorParameters<typeof maplibregl.Map>[0]["style"];
let slimStylePromise: Promise<MapStyle> | null = null;

/** Descarga el estilo una sola vez y le saca las capas que no usamos */
function loadSlimStyle(): Promise<MapStyle> {
  slimStylePromise ??= fetch(STYLE_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`Estilo: ${res.status}`);
      return res.json();
    })
    .then(
      (style: { layers: { "source-layer"?: string }[] }) =>
        ({
          ...style,
          layers: style.layers.filter((layer) => !HIDDEN_SOURCE_LAYERS.has(layer["source-layer"] ?? "")),
        }) as MapStyle
    )
    .catch(() => STYLE_URL); // si algo falla, usamos el estilo completo
  return slimStylePromise;
}
const COLORS = {
  land: "#19251E",
  water: "#0B120E",
};
const AREA_SOURCE = "region-area";

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

/** Color del tipo dominante de la región, leído de los tokens de globals.css */
function regionColor(region: Region) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-type-${region.types[0]}`)
    .trim();
  return value || "#A3E635";
}

function addRegionArea(map: maplibregl.Map, region: Region) {
  const color = regionColor(region);
  map.addSource(AREA_SOURCE, { type: "geojson", data: regionArea(region.id) });
  const firstLabelLayer = map.getStyle().layers.find((layer) => layer.type === "symbol")?.id;

  map.addLayer(
    { id: "region-area-fill", type: "fill", source: AREA_SOURCE, paint: { "fill-color": color, "fill-opacity": 0.06 } },
    firstLabelLayer
  );
  map.addLayer(
    {
      id: "region-area-line",
      type: "line",
      source: AREA_SOURCE,
      paint: { "line-color": color, "line-opacity": 0.7, "line-width": 1.5, "line-dasharray": [2, 3] },
    },
    firstLabelLayer
  );
}

function isInsideArgentina([lng, lat]: [number, number]) {
  const [[west, south], [east, north]] = MAX_BOUNDS;
  return lng >= west && lng <= east && lat >= south && lat <= north;
}

interface MapViewProps {
  region: Region;
  pokemons: DetectedPokemon[];
  selectedPokemonId: number | null;
  focusOffsetX: number;
  leavingPokemons: DetectedPokemon[];
  onUserLocated: (point: [number, number]) => boolean;
  onSelectPokemon: (id: number) => void;
  onReady: () => void;
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
  focusOffsetX
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [zoom, setZoom] = useState(region.zoom);
  const [loaded, setLoaded] = useState(false);
  const onMapClickRef = useRef(onMapClick);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);
  const regionRef = useRef(region);
  useEffect(() => {
    regionRef.current = region;
  }, [region]);

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
      el.setAttribute("role", "img");
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

  // 1) Crear el mapa una sola vez, con el estilo aligerado
  useEffect(() => {
    let cancelled = false;
    let map: maplibregl.Map | null = null;

    loadSlimStyle().then((style) => {
      if (cancelled || !containerRef.current) return;

      const instance = new maplibregl.Map({
        container: containerRef.current,
        style,
        center: regionRef.current.center,
        zoom: regionRef.current.zoom,
        minZoom: 3.5,
        maxZoom: 12,
        maxBounds: MAX_BOUNDS,
        attributionControl: { compact: true },
        fadeDuration: 0, // sin fundido de textos: menos redibujos
        pixelRatio: Math.min(window.devicePixelRatio, 2), // no dibujar a 3x en celulares
      });
      map = instance;

      instance.on("load", () => {
        applyPokeradarColors(instance);
        addRegionArea(instance, regionRef.current);
        onReady();
        navigator.permissions
          ?.query({ name: "geolocation" })
          .then((status) => {
            if (status.state === "granted") locateUser();
          })
          .catch(() => { });
        setLoaded(true);
      });
      instance.on("zoomend", () => setZoom(instance.getZoom()));
      instance.on("click", (e) => {
        const target = e.originalEvent.target as HTMLElement | null;
        if (target?.closest(".maplibregl-marker")) return;
        onMapClickRef.current();
      });
      mapRef.current = instance;
    });

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      userMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Cada vez que cambia la región, la cámara vuela hacia ella
  useEffect(() => {
    const map = mapRef.current;
    map?.flyTo({ center: region.center, zoom: region.zoom, duration: 1200, essential: true });
    (map?.getSource(AREA_SOURCE) as maplibregl.GeoJSONSource | undefined)?.setData(regionArea(region.id));
    if (map?.getLayer("region-area-line")) {
      const color = regionColor(region);
      map.setPaintProperty("region-area-line", "line-color", color);
      map.setPaintProperty("region-area-fill", "fill-color", color);
    }
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

  // 7) Al elegir un Pokémon, la cámara vuela hacia él
  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedPokemonId === null) return;

    const target = pokemons.find((p) => p.id === selectedPokemonId);
    if (!target) return;

    map.flyTo({
      center: target.position,
      zoom: Math.max(map.getZoom(), region.zoom),
      offset: [focusOffsetX, 0],
      duration: 800,
    });
  }, [selectedPokemonId, pokemons, region, focusOffsetX]);
  return (
    <>
      <MapLoading visible={!loaded} />
      <div className="absolute inset-0">
        <div ref={containerRef} className="h-full w-full" />
      </div>

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
      <div className="absolute bottom-12 right-3 z-10 flex flex-col gap-2 lg:bottom-auto lg:right-4 lg:top-4">
        <div className="hidden flex-col rounded-md border border-line bg-surface shadow-panel lg:flex">
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