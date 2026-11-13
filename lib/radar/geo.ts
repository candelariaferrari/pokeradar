import type { Feature, Polygon } from "geojson";
import { REGIONS, distanceKm, type RegionId } from "./regions";
import { SPAWN_POINTS } from "./spawn-points";

/** Círculo aproximado (polígono de N lados) alrededor de un punto, en km */
export function circlePolygon([lng, lat]: [number, number], radiusKm: number, steps = 64): Feature<Polygon> {
  const KM_PER_DEGREE = 111.32;
  const latRad = (lat * Math.PI) / 180;
  const coordinates: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    coordinates.push([
      // un grado de longitud mide menos cuanto más al sur: lo corregimos con cos(latitud)
      lng + (radiusKm / (KM_PER_DEGREE * Math.cos(latRad))) * Math.cos(angle),
      lat + (radiusKm / KM_PER_DEGREE) * Math.sin(angle),
    ]);
  }

  return { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [coordinates] } };
}

/** Radio de la zona: el punto de aparición más lejano + un margen */
export function regionRadiusKm(regionId: RegionId): number {
  const region = REGIONS.find((r) => r.id === regionId);
  if (!region) return 50;
  const farthest = Math.max(...SPAWN_POINTS[regionId].map((point) => distanceKm(region.center, point)));
  return farthest * 1.25 + 5;
}

/** La zona de exploración de una región, lista para dibujar */
export function regionArea(regionId: RegionId): Feature<Polygon> {
  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];
  return circlePolygon(region.center, regionRadiusKm(regionId));
}