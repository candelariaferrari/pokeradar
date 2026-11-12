import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PokemonPageShell from "@/components/pokemon/PokemonPageShell";
import PokemonProfile from "@/components/pokemon/PokemonProfile";
import DiscoverOnView from "@/components/pokemon/DiscoverOnView";
import { getPokemonDetail } from "@/lib/pokemon/pokeapi";
import { formatName } from "@/lib/pokemon/utils";
import { getPokemonEntry } from "@/lib/radar/scan";
import { REGIONS } from "@/lib/radar/regions";

interface PokemonPageProps {
  params: Promise<{ id: string }>;
}

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id >= 1 && id <= 151 ? id : null;
}

// Título de la pestaña y de la vista previa al compartir el link
export async function generateMetadata({ params }: PokemonPageProps): Promise<Metadata> {
  const id = parseId((await params).id);
  const entry = id ? getPokemonEntry(id) : undefined;
  if (!entry) return { title: "Fuera del radar · PokéradAR" };

  const name = formatName(entry.name);
  return {
    title: `${name} · PokéradAR`,
    description: `Ficha de ${name}: tipos, estadísticas y dónde encontrarlo en Argentina.`,
  };
}

export default async function PokemonPage({ params }: PokemonPageProps) {
  const id = parseId((await params).id);
  if (!id) notFound();

  const pokemon = await getPokemonDetail(id); // si falla, Next muestra error.tsx
  const region = REGIONS.find((r) => r.id === getPokemonEntry(id)?.region);

  return (
    <PokemonPageShell>
      <DiscoverOnView pokemonId={id} />
      <PokemonProfile
        pokemon={pokemon}
        regionName={region ? `${region.name} · ${region.province}` : "Sin región asignada"}
      />
    </PokemonPageShell>
  );
}