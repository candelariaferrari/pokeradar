export type PokemonType =
  | "fire" | "water" | "grass" | "electric" | "poison" | "psychic"
  | "rock" | "ground" | "bug" | "normal" | "flying" | "ice" | "dragon";

export type RegionId =
  | "noa" | "litoral" | "cuyo" | "pampa" | "costa" | "patagonia" | "tdf";

export interface Region {
  id: RegionId;
  name: string;
  biome: string;
  types: PokemonType[];
  /** Centro del mapa en formato MapLibre: [longitud, latitud] */
  center: [number, number];
  zoom: number;
}

export const REGIONS: Region[] = [
  { id: "noa", name: "Noroeste", biome: "Puna · Montaña / altura", types: ["rock", "ground"], center: [-66.5, -24.0], zoom: 6 },
  { id: "litoral", name: "Litoral", biome: "Misiones · Selva", types: ["grass", "bug", "poison"], center: [-54.6, -26.9], zoom: 6.5 },
  { id: "cuyo", name: "Cuyo", biome: "Desierto", types: ["fire", "ground"], center: [-68.8, -32.9], zoom: 6 },
  { id: "pampa", name: "Pampa", biome: "Pradera", types: ["normal", "flying"], center: [-61.5, -35.5], zoom: 5.5 },
  { id: "costa", name: "Costa Atlántica", biome: "Mar", types: ["water"], center: [-57.6, -38.0], zoom: 6 },
  { id: "patagonia", name: "Patagonia", biome: "Estepa / viento", types: ["flying", "ice", "dragon"], center: [-69.5, -45.5], zoom: 5 },
  { id: "tdf", name: "Tierra del Fuego", biome: "Glaciar", types: ["ice", "water"], center: [-68.3, -54.5], zoom: 6.5 },
];