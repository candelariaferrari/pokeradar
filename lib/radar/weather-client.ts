import type { RegionWeather } from "./weather";

const TTL_MS = 10 * 60 * 1000; // el clima cambia: guardamos 10 minutos
const requests = new Map<string, { savedAt: number; request: Promise<RegionWeather> }>();
const resolved = new Map<string, { savedAt: number; weather: RegionWeather }>();

export function fetchRegionWeather(regionId: string): Promise<RegionWeather> {
  const hit = requests.get(regionId);
  if (hit && Date.now() - hit.savedAt < TTL_MS) return hit.request;

  const request = fetch(`/api/weather/${regionId}`)
    .then(async (res) => {
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const weather = (await res.json()) as RegionWeather;
      resolved.set(regionId, { savedAt: Date.now(), weather });
      return weather;
    })
    .catch((error) => {
      requests.delete(regionId);
      throw error;
    });

  requests.set(regionId, { savedAt: Date.now(), request });
  return request;
}

/** El clima de una región si ya llegó (sin esperar). Lo usa el escaneo. */
export function getCachedWeather(regionId: string): RegionWeather | null {
  const hit = resolved.get(regionId);
  return hit && Date.now() - hit.savedAt < TTL_MS ? hit.weather : null;
}