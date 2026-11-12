import { NextResponse } from "next/server";
import { REGIONS, type RegionId } from "@/lib/radar/regions";
import { getRegionWeather } from "@/lib/radar/weather";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ region: string }> }
) {
  const { region } = await params;

  if (!REGIONS.some((r) => r.id === region)) {
    return NextResponse.json({ error: "Región desconocida" }, { status: 404 });
  }

  try {
    return NextResponse.json(await getRegionWeather(region as RegionId));
  } catch {
    return NextResponse.json({ error: "El servicio del clima no respondió" }, { status: 502 });
  }
}