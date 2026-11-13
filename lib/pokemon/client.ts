import type { PokemonDetail } from "./utils";

const cache = new Map<number, Promise<PokemonDetail>>();

export function fetchPokemonDetail(id: number): Promise<PokemonDetail> {
  const cached = cache.get(id);
  if (cached) return cached;

  const request = fetch(`/api/pokemon/${id}`)
    .then(async (res) => {
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return (await res.json()) as PokemonDetail;
    })
    .catch((error) => {
      cache.delete(id); 
      throw error;
    });

  cache.set(id, request);
  return request;
}