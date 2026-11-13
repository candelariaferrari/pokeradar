import { ImageResponse } from "next/og";
import { parseTeam } from "@/lib/pokemon/team";
import { artworkUrl, formatName } from "@/lib/pokemon/utils";
import { getPokemonEntry } from "@/lib/radar/scan";

export const alt = "Equipo de expedición en PokéradAR";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TeamImage({ params }: { params: Promise<{ ids: string }> }) {
  const team = parseTeam((await params).ids).flatMap((id) => getPokemonEntry(id) ?? []);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#101814",
          color: "#E8EFE8",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>
            Pokérad<span style={{ color: "#A3E635" }}>AR</span>
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#A7B8AC", marginTop: 8 }}>
            Mi equipo de expedición por Argentina
          </div>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {team.map((pokemon) => (
            <div key={pokemon.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 152,
                  height: 152,
                  borderRadius: 999,
                  border: "4px solid #A3E635",
                  background: "#25352A",
                }}
              >
                <img src={artworkUrl(pokemon.id)} width={128} height={128} alt="" />
              </div>
              <div style={{ display: "flex", fontSize: 24 }}>{formatName(pokemon.name)}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}