import { NextResponse } from "next/server";
import { getPokemonDetail } from "@/lib/pokemon/pokeapi";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pokemonId = Number(id);

  if (!Number.isInteger(pokemonId) || pokemonId < 1 || pokemonId > 151) {
    return NextResponse.json({ error: "Ese Pokémon está fuera del radar" }, { status: 404 });
  }

  try {
    return NextResponse.json(await getPokemonDetail(pokemonId));
  } catch {
    return NextResponse.json({ error: "La PokéAPI no respondió" }, { status: 502 });
  }
}