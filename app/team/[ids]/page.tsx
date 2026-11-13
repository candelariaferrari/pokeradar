import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PokemonPageShell from "@/components/pokemon/PokemonPageShell";
import ShareTeamButton from "@/components/pokemon/ShareTeamButton";
import TeamCards from "@/components/pokemon/TeamCards";
import { parseTeam, TEAM_SIZE } from "@/lib/pokemon/team";
import { formatName, type PokemonRegionEntry } from "@/lib/pokemon/utils";
import { getPokemonEntry } from "@/lib/radar/scan";

interface TeamPageProps {
  params: Promise<{ ids: string }>;
}

function getTeam(raw: string): PokemonRegionEntry[] {
  return parseTeam(raw)
    .map((id) => getPokemonEntry(id))
    .filter((entry): entry is PokemonRegionEntry => entry !== undefined);
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const team = getTeam((await params).ids);
  if (team.length === 0) return { title: "Equipo vacío · PokéradAR" };

  const names = team.map((p) => formatName(p.name));
  return {
    title: `Equipo de expedición: ${names.slice(0, 2).join(", ")}${names.length > 2 ? ` y ${names.length - 2} más` : ""} · PokéradAR`,
    description: `${names.join(", ")}. Un equipo armado explorando las regiones de Argentina en PokéradAR.`,
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const team = getTeam((await params).ids);
  if (team.length === 0) notFound();

  return (
    <PokemonPageShell wide>
      <section className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
          Equipo de expedición · {team.length}/{TEAM_SIZE}
        </p>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          Mi equipo Pokérad<span className="text-lime">AR</span>
        </h1>
        <p className="text-ink-muted">Pokémon descubiertos explorando las regiones de Argentina.</p>
      </section>

      {/* Mobile: carrusel con imán · Desktop: grilla */}
          <TeamCards team={team} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <ShareTeamButton ids={team.map((p) => p.id)} variant="button" />
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full bg-lime px-5 text-sm font-semibold text-on-lime transition-colors hover:bg-lime-soft"
        >
          Explorar el radar
        </Link>
      </div>
    </PokemonPageShell>
  );
}