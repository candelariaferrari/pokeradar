import { describe, expect, it } from "vitest";
import { parseTeam, teamPath, TEAM_SIZE } from "../pokemon/team";

describe("parseTeam", () => {
  it("lee los ids de la URL", () => {
    expect(parseTeam("1-25-133")).toEqual([1, 25, 133]);
  });

  it("descarta ids inválidos y repetidos", () => {
    expect(parseTeam("0-25-abc-152-25-7.5")).toEqual([25]);
  });

  it(`no acepta más de ${TEAM_SIZE} Pokémon`, () => {
    expect(parseTeam("1-2-3-4-5-6-7-8")).toHaveLength(TEAM_SIZE);
  });

  it("es la inversa de teamPath", () => {
    const ids = [4, 7, 1];
    expect(parseTeam(teamPath(ids).replace("/team/", ""))).toEqual(ids);
  });
});