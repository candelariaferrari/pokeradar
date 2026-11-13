export const TEAM_SIZE = 6;

/** Ruta compartible de un equipo: /equipo/1-25-133 */
export const teamPath = (ids: number[]) => `/team/${ids.join("-")}`;

export function parseTeam(raw: string): number[] {
  const ids = raw
    .split("-")
    .map(Number)
    .filter((id) => Number.isInteger(id) && id >= 1 && id <= 151);
  return [...new Set(ids)].slice(0, TEAM_SIZE);
}