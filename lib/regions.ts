export type PokemonType =
  | "fire" | "water" | "grass" | "electric" | "poison" | "psychic"
  | "rock" | "ground" | "bug" | "normal" | "flying" | "ice"
  | "dragon" | "fighting" | "ghost" | "steel" | "dark" | "fairy";

export type RegionId =
  | "misiones" | "cordoba" | "buenos-aires" | "costa" | "mendoza" | "patagonia";

export interface Region {
  id: RegionId;
  name: string;
  province: string;
  biome: string;
  types: PokemonType[];
  center: [number, number];
  zoom: number;
}

export const REGIONS: Region[] = [
  { id: "misiones", name: "Selva Misionera", province: "Misiones", biome: "Selva", types: ["grass", "bug", "poison"], center: [-54.6, -26.9], zoom: 7 },
  { id: "cordoba", name: "Sierras Cordobesas", province: "Córdoba", biome: "Sierras", types: ["rock", "ground", "grass", "fighting", "fairy"], center: [-64.6, -31.4], zoom: 7.5 },
  { id: "buenos-aires", name: "Urbe Porteña", province: "Buenos Aires", biome: "Urbano", types: ["electric", "normal"], center: [-58.44, -34.61], zoom: 9 },
  { id: "costa", name: "Costa Atlántica", province: "Buenos Aires (costa)", biome: "Marino", types: ["water"], center: [-57.55, -38.0], zoom: 7.5 },
  { id: "mendoza", name: "Andes Mendocinos", province: "Mendoza", biome: "Montaña / Árido", types: ["ground", "rock", "fire"], center: [-68.84, -32.89], zoom: 7 },
  { id: "patagonia", name: "Hielos Patagónicos", province: "Patagonia sur", biome: "Montaña / Hielo", types: ["ice", "rock", "ground"], center: [-72.5, -49.8], zoom: 6.5 },
];