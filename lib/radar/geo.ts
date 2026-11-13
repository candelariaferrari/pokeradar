import type { Feature, FeatureCollection, Point, Polygon } from "geojson";
import { REGIONS, distanceKm, type Region, type RegionId } from "./regions";
import { SPAWN_POINTS } from "./spawn-points";

/** Círculo aproximado (polígono de N lados) alrededor de un punto, en km */
export function circlePolygon([lng, lat]: [number, number], radiusKm: number, steps = 64): Feature<Polygon> {
  const KM_PER_DEGREE = 111.32;
  const latRad = (lat * Math.PI) / 180;
  const coordinates: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    coordinates.push([
      lng + (radiusKm / (KM_PER_DEGREE * Math.cos(latRad))) * Math.cos(angle),
      lat + (radiusKm / KM_PER_DEGREE) * Math.sin(angle),
    ]);
  }

  return { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [coordinates] } };
}

export function regionRadiusKm(regionId: RegionId): number {
  const region = REGIONS.find((r) => r.id === regionId);
  if (!region) return 50;
  const farthest = Math.max(...SPAWN_POINTS[regionId].map((point) => distanceKm(region.center, point)));
  return farthest * 1.25 + 5;
}

export function regionArea(regionId: RegionId): Feature<Polygon> {
  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];
  return circlePolygon(region.center, regionRadiusKm(regionId));
}

export function regionsOverview(colorOf: (region: Region) => string) {
  const areas: FeatureCollection<Polygon> = {
    type: "FeatureCollection",
    features: REGIONS.map((region) => ({
      ...regionArea(region.id),
      properties: { id: region.id, color: colorOf(region) },
    })),
  };

  const labels: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: REGIONS.map((region) => ({
      type: "Feature" as const,
      properties: { id: region.id, name: region.name, color: colorOf(region) },
      geometry: { type: "Point" as const, coordinates: region.center },
    })),
  };

  return { areas, labels };
}