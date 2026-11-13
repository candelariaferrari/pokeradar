import { describe, expect, it } from "vitest";
import { distanceKm, findNearestRegion } from "../radar/regions";

const CORDOBA_CITY: [number, number] = [-64.18, -31.42];
const BUENOS_AIRES_CITY: [number, number] = [-58.38, -34.6];
const SAN_SALVADOR_DE_JUJUY: [number, number] = [-65.3, -24.2];

describe("distanceKm", () => {
  it("calcula la distancia real entre Córdoba y Buenos Aires (~646 km)", () => {
    expect(distanceKm(CORDOBA_CITY, BUENOS_AIRES_CITY)).toBeCloseTo(646, -1);
  });
});

describe("findNearestRegion", () => {
  it("desde la ciudad de Córdoba elige las Sierras Cordobesas", () => {
    expect(findNearestRegion(CORDOBA_CITY)?.id).toBe("cordoba");
  });

  it("si todas las regiones están a más de 350 km, no fuerza ninguna", () => {
    expect(findNearestRegion(SAN_SALVADOR_DE_JUJUY)).toBeNull();
  });
});