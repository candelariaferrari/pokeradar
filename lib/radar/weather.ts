import { cacheLife } from "next/cache";
import { REGIONS, type RegionId } from "./regions";

export type WeatherKind = "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm";

export interface RegionWeather {
  temperature: number; // °C
  windKmh: number;
  isDay: boolean;
  kind: WeatherKind;
  label: string; // en español
}

/** Open-Meteo usa los códigos de clima de la OMM: los traducimos */
function describe(code: number): { kind: WeatherKind; label: string } {
  if (code === 0) return { kind: "clear", label: "Despejado" };
  if (code === 1) return { kind: "clear", label: "Mayormente despejado" };
  if (code === 2) return { kind: "partly", label: "Parcialmente nublado" };
  if (code === 3) return { kind: "cloudy", label: "Nublado" };
  if (code === 45 || code === 48) return { kind: "fog", label: "Niebla" };
  if (code >= 51 && code <= 57) return { kind: "drizzle", label: "Llovizna" };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { kind: "rain", label: "Lluvia" };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { kind: "snow", label: "Nieve" };
  if (code >= 95) return { kind: "storm", label: "Tormenta" };
  return { kind: "cloudy", label: "Sin datos" };
}

/** Clima actual en el centro de una región. Se cachea ~10 minutos. */
export async function getRegionWeather(regionId: RegionId): Promise<RegionWeather> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 600, expire: 3600 });

  const region = REGIONS.find((r) => r.id === regionId);
  if (!region) throw new Error("Región desconocida");

  const [lng, lat] = region.center;
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,weather_code,wind_speed_10m,is_day&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo respondió ${res.status}`);

  const data = (await res.json()) as {
    current: { temperature_2m: number; weather_code: number; wind_speed_10m: number; is_day: number };
  };

  return {
    temperature: Math.round(data.current.temperature_2m),
    windKmh: Math.round(data.current.wind_speed_10m),
    isDay: data.current.is_day === 1,
    ...describe(data.current.weather_code),
  };
}