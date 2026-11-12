import type { PokemonType, RegionId } from "./regions";

export interface PokemonRegionEntry {
  id: number;
  name: string;
  types: PokemonType[];
  region: RegionId;
}

const SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

/** Sprite chico (96px) */
export const spriteUrl = (id: number) => `${SPRITES}/${id}.png`;

/** Ilustración oficial grande */
export const artworkUrl = (id: number) => `${SPRITES}/other/official-artwork/${id}.png`;

export const formatDexNumber = (id: number) => `N.º ${String(id).padStart(3, "0")}`;

export function formatName(name: string): string {
  const special: Record<string, string> = {
    "nidoran-f": "Nidoran♀",
    "nidoran-m": "Nidoran♂",
    "mr-mime": "Mr. Mime",
    farfetchd: "Farfetch’d",
  };
  return special[name] ?? name.charAt(0).toUpperCase() + name.slice(1);
}
export type StatName =
  | "hp" | "attack" | "defense" | "special-attack" | "special-defense" | "speed";

export const STAT_LABELS: Record<StatName, string> = {
  hp: "PS",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "At. Esp.",
  "special-defense": "Def. Esp.",
  speed: "Velocidad",
};

export interface PokemonDetail {
  id: number;
  name: string;
  types: PokemonType[];
  genus: string | null;       // "Pokémon Ratón"
  description: string | null;
  heightM: number;
  weightKg: number;
  stats: { name: StatName; value: number }[];
  artwork: string;
}