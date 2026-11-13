import { describe, expect, it } from "vitest";
import { REGIONS } from "../radar/regions";
import { scanRegion, typesAvailableIn } from "../radar/scan";

const REGION_IDS = REGIONS.map((region) => region.id);

describe("scanRegion", () => {
  it.each(REGION_IDS)("en %s detecta 8 Pokémon de la región, sin repetir ni superponerse", (regionId) => {
    const found = scanRegion(regionId);

    expect(found).toHaveLength(8);
    expect(found.every((pokemon) => pokemon.region === regionId)).toBe(true);
    expect(new Set(found.map((pokemon) => pokemon.id)).size).toBe(8);
    expect(new Set(found.map((pokemon) => pokemon.position.join())).size).toBe(8);
  });

  it("con filtro de tipo, todos los detectados son de ese tipo", () => {
    const found = scanRegion("costa", { type: "psychic" });

    expect(found.length).toBeGreaterThan(0);
    expect(found.every((pokemon) => pokemon.types.includes("psychic"))).toBe(true);
  });

  it("include garantiza que aparezca el Pokémon buscado", () => {
    const found = scanRegion("buenos-aires", { include: 25 });
    expect(found[0].id).toBe(25); // Pikachu
  });
});

describe("typesAvailableIn", () => {
  it("incluye los tipos secundarios: la Costa no es solo Agua", () => {
    expect(typesAvailableIn("costa")).toEqual(["water", "psychic", "ice", "poison"]);
  });

  it.each(REGION_IDS)("en %s, cada filtro devuelve al menos 2 Pokémon", (regionId) => {
    for (const type of typesAvailableIn(regionId)) {
      expect(scanRegion(regionId, { type }, 151).length).toBeGreaterThanOrEqual(2);
    }
  });
});