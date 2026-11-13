import type { IconName } from "@/components/ui/Icon";
import type { PokemonType } from "./regions";
import type { RegionWeather } from "./weather";

export interface WeatherBoost {
  types: PokemonType[];
  reason: string;
  icon: IconName;
}

/** Qué tipos favorece cada clima (regla propia de PokéradAR) */
export function weatherBoost(weather: RegionWeather | null): WeatherBoost | null {
  if (!weather) return null;
  const { kind, temperature, windKmh, isDay } = weather;

  // 1–4: fenómenos del cielo
  if (kind === "storm") return { types: ["electric", "water"], reason: "Tormenta", icon: "storm" };
  if (kind === "snow") return { types: ["ice"], reason: "Nieve", icon: "snow" };
  if (kind === "rain" || kind === "drizzle") return { types: ["water", "bug"], reason: "Lluvia", icon: "rain" };
  if (kind === "fog") return { types: ["ghost"], reason: "Niebla", icon: "fog" };

  // 5–7: viento y temperatura (lo que más cambia entre regiones)
  if (windKmh >= 30) return { types: ["flying", "dragon"], reason: "Viento fuerte", icon: "wind" };
  if (temperature >= 30) return { types: ["fire", "ground"], reason: `Calor (${temperature}°)`, icon: "sun" };
  if (temperature <= 5) return { types: ["ice", "water"], reason: `Frío (${temperature}°)`, icon: "snow" };

  // 8–9: cielo despejado o nublado
  if (kind === "clear") {
    return isDay
      ? { types: ["fire", "grass"], reason: "Día soleado", icon: "sun" }
      : { types: ["ghost", "psychic"], reason: "Noche despejada", icon: "moon" };
  }
  return { types: ["flying", "normal"], reason: "Nublado", icon: "cloud" };
}