import type { PokemonType } from "@/lib/radar/regions";

const TYPES: Record<PokemonType, { label: string; dot: string; solid: string }> = {
  normal:   { label: "Normal",    dot: "bg-type-normal",   solid: "bg-type-normal text-on-lime" },
  fire:     { label: "Fuego",     dot: "bg-type-fire",     solid: "bg-type-fire text-on-lime" },
  water:    { label: "Agua",      dot: "bg-type-water",    solid: "bg-type-water text-on-lime" },
  grass:    { label: "Planta",    dot: "bg-type-grass",    solid: "bg-type-grass text-on-lime" },
  electric: { label: "Eléctrico", dot: "bg-type-electric", solid: "bg-type-electric text-on-lime" },
  ice:      { label: "Hielo",     dot: "bg-type-ice",      solid: "bg-type-ice text-on-lime" },
  fighting: { label: "Lucha",     dot: "bg-type-fighting", solid: "bg-type-fighting text-on-lime" },
  poison:   { label: "Veneno",    dot: "bg-type-poison",   solid: "bg-type-poison text-ink" },
  ground:   { label: "Tierra",    dot: "bg-type-ground",   solid: "bg-type-ground text-on-lime" },
  flying:   { label: "Volador",   dot: "bg-type-flying",   solid: "bg-type-flying text-on-lime" },
  psychic:  { label: "Psíquico",  dot: "bg-type-psychic",  solid: "bg-type-psychic text-on-lime" },
  bug:      { label: "Bicho",     dot: "bg-type-bug",      solid: "bg-type-bug text-on-lime" },
  rock:     { label: "Roca",      dot: "bg-type-rock",     solid: "bg-type-rock text-on-lime" },
  ghost:    { label: "Fantasma",  dot: "bg-type-ghost",    solid: "bg-type-ghost text-on-lime" },
  dragon:   { label: "Dragón",    dot: "bg-type-dragon",   solid: "bg-type-dragon text-on-lime" },
  dark:     { label: "Siniestro", dot: "bg-type-dark",     solid: "bg-type-dark text-on-lime" },
  steel:    { label: "Acero",     dot: "bg-type-steel",    solid: "bg-type-steel text-on-lime" },
  fairy:    { label: "Hada",      dot: "bg-type-fairy",    solid: "bg-type-fairy text-on-lime" },
};

interface TypeChipProps {
  type: PokemonType;
  solid?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export default function TypeChip({ type, solid = false, selected = false, onClick }: TypeChipProps) {
  const { label, dot, solid: solidClasses } = TYPES[type];

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={`inline-flex h-9 items-center gap-2 rounded-full border bg-surface pl-2 pr-3 text-sm font-medium shadow-panel transition-colors ${
          selected ? "border-lime bg-elevated" : "border-line hover:border-line-strong"
        }`}
      >
        <span aria-hidden="true" className={`size-4.5 rounded-full ${dot}`} />
        {label}
      </button>
    );
  }

  if (solid) {
    return (
      <span className={`inline-flex h-8 items-center rounded-full px-3 text-sm font-medium ${solidClasses}`}>
        {label}
      </span>
    );
  }

  return (
    <span className="inline-flex h-8 items-center gap-2 rounded-full border border-line bg-elevated pl-2 pr-3 text-sm font-medium">
      <span aria-hidden="true" className={`size-4.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
/** Nombre en español de un tipo ("water" → "Agua") */
export const typeLabel = (type: PokemonType) => TYPES[type].label;