import { describe, expect, it } from "vitest";
import { weatherBoost } from "../radar/weather-boost";
import type { RegionWeather } from "../radar/weather";

/** Un clima "neutro" que cada test modifica solo en lo que le importa */
function weather(overrides: Partial<RegionWeather> = {}): RegionWeather {
  return { temperature: 20, windKmh: 10, isDay: true, kind: "cloudy", label: "Nublado", ...overrides };
}

describe("weatherBoost", () => {
  it("sin datos de clima no favorece nada", () => {
    expect(weatherBoost(null)).toBeNull();
  });

  it("la tormenta tiene prioridad sobre el calor y el viento", () => {
    const boost = weatherBoost(weather({ kind: "storm", temperature: 35, windKmh: 50 }));
    expect(boost?.types).toEqual(["electric", "water"]);
  });

  it.each(["rain", "drizzle"] as const)("con %s favorece Agua y Bicho", (kind) => {
    expect(weatherBoost(weather({ kind }))?.types).toEqual(["water", "bug"]);
  });

  it("el viento fuerte gana sobre la temperatura", () => {
    const boost = weatherBoost(weather({ windKmh: 30, temperature: 35 }));
    expect(boost?.reason).toBe("Viento fuerte");
  });

  it("muestra la temperatura en el motivo", () => {
    const boost = weatherBoost(weather({ temperature: 33 }));
    expect(boost).toMatchObject({ types: ["fire", "ground"], reason: "Calor (33°)" });
  });

  it("el cielo despejado cambia según sea de día o de noche", () => {
    expect(weatherBoost(weather({ kind: "clear", isDay: true }))?.types).toEqual(["fire", "grass"]);
    expect(weatherBoost(weather({ kind: "clear", isDay: false }))?.types).toEqual(["ghost", "psychic"]);
  });

  it("nublado y templado favorece Volador y Normal", () => {
    expect(weatherBoost(weather())?.reason).toBe("Nublado");
  });
});