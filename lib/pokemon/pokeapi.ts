import { cacheLife } from "next/cache";
import { artworkUrl, type PokemonDetail, type StatName } from "./utils";
import type { PokemonType } from "../radar/regions";

const API = "https://pokeapi.co/api/v2";

interface RawPokemon {
  id: number;
  name: string;
  height: number; // decímetros
  weight: number; // hectogramos
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  cries?: { latest: string | null; legacy: string | null };
}

interface RawSpecies {
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
  genera: { genus: string; language: { name: string } }[];
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PokéAPI respondió ${res.status}`);
  return (await res.json()) as T;
}

/**  Detalle de un Pokémon, combinado y traducido.*/
export async function getPokemonDetail(id: number): Promise<PokemonDetail> {
  "use cache";
  cacheLife("days");

  const [pokemon, species] = await Promise.all([
    getJson<RawPokemon>(`${API}/pokemon/${id}`),
    getJson<RawSpecies>(`${API}/pokemon-species/${id}`),
  ]);

  const spanishText = species.flavor_text_entries
    .filter((entry) => entry.language.name === "es")
    .at(-1)?.flavor_text;

  return {
    id: pokemon.id,
    name: pokemon.name,
    types: [...pokemon.types]
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name as PokemonType),
    genus: species.genera.find((g) => g.language.name === "es")?.genus ?? null,
    description: spanishText ? spanishText.replace(/[\n\f\r]+/g, " ") : null,
    heightM: pokemon.height / 10,
    weightKg: pokemon.weight / 10,
    stats: pokemon.stats.map((s) => ({ name: s.stat.name as StatName, value: s.base_stat })),
    artwork: artworkUrl(pokemon.id),
    cry: pokemon.cries?.latest ?? pokemon.cries?.legacy ?? null,
  };
}