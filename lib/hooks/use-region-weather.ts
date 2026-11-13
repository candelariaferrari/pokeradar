import { useEffect, useState } from "react";
import { fetchRegionWeather } from "@/lib/radar/weather-client";
import type { RegionWeather } from "@/lib/radar/weather";
import type { RegionId } from "@/lib/radar/regions";

/** Clima de la región actual, o null mientras carga (o si falló) */
export function useRegionWeather(regionId: RegionId): RegionWeather | null {
  const [state, setState] = useState<{ regionId: RegionId; weather: RegionWeather } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchRegionWeather(regionId)
      .then((weather) => {
        if (!cancelled) setState({ regionId, weather });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [regionId]);

  // Si el guardado es de otra región (todavía no llegó el nuevo), no lo mostramos
  return state?.regionId === regionId ? state.weather : null;
}