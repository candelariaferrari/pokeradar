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

  switch (weather.kind) {
    case "clear":
      return weather.isDay
        ? { types: ["fire", "grass"], reason: "Día soleado", icon: "sun" }
        : { types: ["ghost", "psychic"], reason: "Noche despejada", icon: "moon" };
    case "partly":
    case "cloudy":
      return { types: ["flying", "normal"], reason: "Nublado", icon: "cloud" };
    case "fog":
      return { types: ["ghost"], reason: "Niebla", icon: "fog" };
    case "drizzle":
    case "rain":
      return { types: ["water", "bug"], reason: "Lluvia", icon: "rain" };
    case "storm":
      return { types: ["electric", "water"], reason: "Tormenta", icon: "storm" };
    case "snow":
      return { types: ["ice"], reason: "Nieve", icon: "snow" };
  }
}