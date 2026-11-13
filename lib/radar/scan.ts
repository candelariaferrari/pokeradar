import pokemonData from "@/data/pokemon-regions.json";
import type { PokemonRegionEntry } from "@/lib/pokemon/utils";
import type { PokemonType, RegionId } from "./regions";
import { REGIONS } from "./regions";
import { SPAWN_POINTS } from "./spawn-points";

const ALL_POKEMON = pokemonData as PokemonRegionEntry[];
const BOOST_WEIGHT = 3; // un Pokémon favorecido tiene 3 veces más chances

export interface DetectedPokemon extends PokemonRegionEntry {
  position: [number, number];
}

interface ScanOptions {
  type?: PokemonType | null;
  include?: number;
  /** Tipos favorecidos por el clima: más chances de aparecer */
  boost?: PokemonType[];
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
/**
 * Mezcla donde algunos elementos tienen más chances de quedar adelante.
 * Algoritmo de Efraimidis–Spirakis: clave = random ^ (1 / peso), y se ordena de mayor a menor.
 */
function weightedShuffle<T>(items: T[], weightOf: (item: T) => number): T[] {
  return items
    .map((item) => ({ item, key: Math.random() ** (1 / weightOf(item)) }))
    .sort((a, b) => b.key - a.key)
    .map(({ item }) => item);
}

export function scanRegion(
  regionId: RegionId,
  { type = null, include, boost = [] }: ScanOptions = {},
  count = 8
): DetectedPokemon[] {
  const candidates = ALL_POKEMON.filter(
    (p) => p.region === regionId && (!type || p.types.includes(type))
  );
  let pool = weightedShuffle(candidates, (p) =>
    boost.some((t) => p.types.includes(t)) ? BOOST_WEIGHT : 1
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