import { mkdir, writeFile } from "node:fs/promises";
import { REGIONS, type PokemonType, type RegionId } from "../lib/radar/regions";
import type { PokemonRegionEntry } from "../lib/pokemon/utils";

const API = "https://pokeapi.co/api/v2";
const MAX_ID = 151; // 1.ª generación
const OUTPUT = "data/pokemon-regions.json";

const ALL_TYPES: PokemonType[] = [
  "normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel",
  "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy",
];


// --- utilidades ---------------------------------------------------------

function idFromUrl(url: string): number {
  return Number(url.split("/").filter(Boolean).pop());
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} al pedir ${url}`);
  return (await res.json()) as T;
}

/** Hace los pedidos de a grupos para no saturar la API */
async function inBatches<T>(items: T[], size: number, fn: (item: T) => Promise<void>) {
  for (let i = 0; i < items.length; i += size) {
    await Promise.all(items.slice(i, i + size).map(fn));
  }
}

// --- script -------------------------------------------------------------

async function main() {
  // 1) Tipos: 18 pedidos. "slot" nos dice si el tipo es el 1.º o el 2.º
  console.log("Leyendo tipos…");
  const pokemon = new Map<number, { name: string; types: PokemonType[] }>();

  for (const type of ALL_TYPES) {
    const data = await getJson<{
      pokemon: { slot: number; pokemon: { name: string; url: string } }[];
    }>(`${API}/type/${type}`);

    for (const { slot, pokemon: p } of data.pokemon) {
      const id = idFromUrl(p.url);
      if (id > MAX_ID) continue;
      const entry = pokemon.get(id) ?? { name: p.name, types: [] };
      entry.types[slot - 1] = type;
      pokemon.set(id, entry);
    }
  }

  // 2) Familias evolutivas: de quién evoluciona cada uno
  console.log("Leyendo familias evolutivas…");
  const ids = [...pokemon.keys()].sort((a, b) => a - b);
  const parentOf = new Map<number, number | null>();

  await inBatches(ids, 10, async (id) => {
    const species = await getJson<{ evolves_from_species: { url: string } | null }>(
      `${API}/pokemon-species/${id}`
    );
    parentOf.set(id, species.evolves_from_species ? idFromUrl(species.evolves_from_species.url) : null);
  });

  /** Primer Pokémon de la familia dentro de la generación (Golem → Geodude) */
  function familyRoot(id: number): number {
    let current = id;
    while (true) {
      const parent = parentOf.get(current);
      if (!parent || parent > MAX_ID) return current;
      current = parent;
    }
  }

  // 3) Regla de puntuación: tipo principal +2, secundario +1
  function assignRegion(id: number, types: PokemonType[]): RegionId | null {
    const scores = REGIONS.map((region) => {
      let points = 0;
      if (region.types.includes(types[0])) points += 2;
      if (types[1] && region.types.includes(types[1])) points += 1;
      return { region: region.id, points };
    });

    const best = Math.max(...scores.map((s) => s.points));
    if (best === 0) return null;

    // Empate: desempata la familia evolutiva (determinístico)
    const tied = scores.filter((s) => s.points === best);
    return tied[familyRoot(id) % tied.length].region;
  }

  // 4) Armar el resultado
  const result: PokemonRegionEntry[] = [];
  const unassigned: string[] = [];

  for (const id of ids) {
    const { name, types } = pokemon.get(id)!;
    const cleanTypes = types.filter(Boolean);
    const region = assignRegion(id, cleanTypes);
    if (region) result.push({ id, name, types: cleanTypes, region });
    else unassigned.push(name);
  }

  await mkdir("data", { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(result, null, 2) + "\n");

  // 5) Resumen en consola
  console.log(`\n✔ ${result.length} Pokémon guardados en ${OUTPUT}\n`);
  for (const region of REGIONS) {
    const count = result.filter((p) => p.region === region.id).length;
    console.log(`  ${region.name.padEnd(20)} ${count}`);
  }
  if (unassigned.length) console.log(`\n⚠ Sin región: ${unassigned.join(", ")}`);
}

main().catch((error) => {
  console.error("✖ Falló el script:", error.message);
  process.exit(1);
});