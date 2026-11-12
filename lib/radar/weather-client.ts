import type { RegionWeather } from "./weather";

const TTL_MS = 10 * 60 * 1000; // el clima cambia: guardamos 10 minutos
const cache = new Map<string, { savedAt: number; request: Promise<RegionWeather> }>();

export function fetchRegionWeather(regionId: string): Promise<RegionWeather> {
  const hit = cache.get(regionId);
  if (hit && Date.now() - hit.savedAt < TTL_MS) return hit.request;

  const request = fetch(`/api/weather/${regionId}`)
    .then(async (res) => {
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return (await res.json()) as RegionWeather;
    })
    .catch((error) => {
      cache.delete(regionId);
      throw error;
    });

  cache.set(regionId, { savedAt: Date.now(), request });
  return request;
}