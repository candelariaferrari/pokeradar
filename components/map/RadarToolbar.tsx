import Icon from "@/components/ui/Icon";
import Pill, { RadarDot } from "@/components/ui/Pill";
import TypeChip from "@/components/ui/TypeChip";
import type { PokemonType } from "@/lib/radar/regions";
import { typeLabel } from "@/components/ui/TypeChip";
import type { WeatherBoost } from "@/lib/radar/weather-boost";

interface RadarToolbarProps {
  detectedCount: number;
  onScan: () => void;
  types: PokemonType[];
  typeFilter: PokemonType | null;
  boost: WeatherBoost | null;
  onTypeFilter: (type: PokemonType | null) => void;
}

export default function RadarToolbar({ detectedCount, onScan, types, typeFilter, onTypeFilter, boost }: RadarToolbarProps) {
  return (
    <div className="absolute left-4 top-4 z-10 flex max-w-[calc(100%-6rem)] flex-col items-start gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Pill variant="floating" size="md" role="status">
          <RadarDot />
          {detectedCount > 0 ? (
            <>
              <span className="font-mono">{detectedCount}</span> detectados
            </>
          ) : (
            "Escaneando…"
          )}
        </Pill>

        <button
          type="button"
          onClick={onScan}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-lime px-5 text-sm font-semibold text-on-lime shadow-panel transition-colors hover:bg-lime-soft"
        >
          <Icon name="radar" strokeWidth={2} />
          Escanear zona
        </button>
        {boost && (
          <Pill variant="floating" size="md">
            <Icon name={boost.icon} className="text-lime" />
            <span>
              {boost.reason}
              <span className="text-ink-muted"> · más {boost.types.map(typeLabel).join(" y ")}</span>
            </span>
          </Pill>
        )}
      </div>

      {/* Filtro por tipo: solo si hay más de un tipo para elegir */}
      {types.length > 1 && (
        <div role="group" aria-label="Filtrar por tipo" className="flex max-w-full gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
          <button
            type="button"
            onClick={() => onTypeFilter(null)}
            aria-pressed={typeFilter === null}
            className={`inline-flex h-9 items-center rounded-full border bg-surface px-4 text-sm font-medium shadow-panel transition-colors ${typeFilter === null ? "border-lime bg-elevated" : "border-line hover:border-line-strong"
              }`}
          >
            Todos
          </button>
          {types.map((type) => (
            <TypeChip
              key={type}
              type={type}
              selected={typeFilter === type}
              onClick={() => onTypeFilter(typeFilter === type ? null : type)}
            />
          ))}
        </div>
      )}
    </div>
  );
}