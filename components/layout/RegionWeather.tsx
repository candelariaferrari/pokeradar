import { useEffect, useState } from "react";
import Icon, { type IconName } from "@/components/ui/Icon";
import { fetchRegionWeather } from "@/lib/radar/weather-client";
import type { RegionWeather as Weather, WeatherKind } from "@/lib/radar/weather";
import type { RegionId } from "@/lib/radar/regions";

const ICONS: Record<WeatherKind, IconName> = {
  clear: "sun", // de noche se cambia por la luna (abajo)
  partly: "cloud",
  cloudy: "cloud",
  fog: "fog",
  drizzle: "rain",
  rain: "rain",
  snow: "snow",
  storm: "storm",
};

export default function RegionWeather({ regionId }: { regionId: RegionId }) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchRegionWeather(regionId)
      .then((data) => {
        if (!cancelled) setWeather(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [regionId]);

  // Si el clima falla, no mostramos nada: es información extra
  if (failed) return null;

  if (!weather) {
    return <span aria-hidden="true" className="mt-1 block h-4 w-32 animate-pulse rounded-sm bg-surface/70" />;
  }

  const icon = weather.kind === "clear" && !weather.isDay ? "moon" : ICONS[weather.kind];

  return (
    <span className="mt-1 flex min-w-0 items-center gap-1.5 text-xs">
      <Icon name={icon} size={14} className="text-lime" />
      <span className="font-mono">{weather.temperature}°</span>
      <span className="truncate text-ink-muted">{weather.label}</span>
      <span aria-hidden="true" className="text-ink-faint">·</span>
      <Icon name="wind" size={14} className="text-ink-muted" />
      <span className="sr-only">Viento</span>
      <span className="shrink-0 font-mono text-ink-muted">{weather.windKmh} km/h</span>
    </span>
  );
}