import pokemonData from "@/data/pokemon-regions.json";
import type { PokemonRegionEntry } from "../pokemon/utils";
import type { RegionId } from "./regions";
import { SPAWN_POINTS } from "./spawn-points";

const ALL_POKEMON = pokemonData as PokemonRegionEntry[];

export interface DetectedPokemon extends PokemonRegionEntry {
  position: [number, number];
}

/** Mezcla un array sin modificar el original (Fisher–Yates) */
function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Elige qué Pokémon "detecta" el radar en una región y dónde aparecen */
export function scanRegion(regionId: RegionId, count = 8): DetectedPokemon[] {
  const pool = shuffle(ALL_POKEMON.filter((p) => p.region === regionId));
  const points = shuffle(SPAWN_POINTS[regionId]);
  const total = Math.min(count, pool.length, points.length);

  return pool.slice(0, total).map((pokemon, i) => ({ ...pokemon, position: points[i] }));
}

/** Datos básicos de cualquier Pokémon (aunque no esté detectado ahora) */
export function getPokemonEntry(id: number): PokemonRegionEntry | undefined {
  return ALL_POKEMON.find((p) => p.id === id);
}