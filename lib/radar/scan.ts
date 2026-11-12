import pokemonData from "@/data/pokemon-regions.json";
import type { PokemonRegionEntry } from "@/lib/pokemon/utils";
import type { PokemonType, RegionId } from "./regions";
import { REGIONS } from "./regions";
import { SPAWN_POINTS } from "./spawn-points";

const ALL_POKEMON = pokemonData as PokemonRegionEntry[];

export interface DetectedPokemon extends PokemonRegionEntry {
  position: [number, number];
}

interface ScanOptions {
  type?: PokemonType | null;
  include?: number;
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
export function scanRegion(regionId: RegionId, { type = null, include }: ScanOptions = {}, count = 8): DetectedPokemon[] {
  let pool = shuffle(
    ALL_POKEMON.filter((p) => p.region === regionId && (!type || p.types.includes(type)))
  );

  if (include) {
    const target = ALL_POKEMON.find((p) => p.id === include);
    if (target) pool = [target, ...pool.filter((p) => p.id !== include)];
  }

  const points = shuffle(SPAWN_POINTS[regionId]);
  const total = Math.min(count, pool.length, points.length);
  return pool.slice(0, total).map((pokemon, i) => ({ ...pokemon, position: points[i] }));
}

/** Tipos de la región que tienen al menos un Pokémon asignado */
export function typesAvailableIn(regionId: RegionId): PokemonType[] {
  const region = REGIONS.find((r) => r.id === regionId);
  if (!region) return [];
  return region.types.filter((type) =>
    ALL_POKEMON.some((p) => p.region === regionId && p.types.includes(type))
  );
}

export function getPokemonEntry(id: number): PokemonRegionEntry | undefined {
  return ALL_POKEMON.find((p) => p.id === id);
}

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[-.]/g, " ").trim();
}

/** Busca por nombre o por número de Pokédex */
export function searchPokemon(query: string, limit = 6): PokemonRegionEntry[] {
  const q = normalize(query);
  if (!q) return [];
  const asNumber = Number(q);

  return ALL_POKEMON.filter(
    (p) => normalize(p.name).includes(q) || (Number.isInteger(asNumber) && p.id === asNumber)
  ).slice(0, limit);
}