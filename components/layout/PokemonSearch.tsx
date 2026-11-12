import { useId, useState, type KeyboardEvent } from "react";
import Icon from "@/components/ui/Icon";
import PokemonSprite from "@/components/pokemon/PokemonSprite";
import { formatDexNumber, formatName } from "@/lib/pokemon/utils";
import { searchPokemon } from "@/lib/radar/scan";
import { REGIONS } from "@/lib/radar/regions";

interface PokemonSearchProps {
  onSelect: (id: number) => void;
}

export default function PokemonSearch({ onSelect }: PokemonSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();

  const results = searchPokemon(query);
  const showList = open && query.trim() !== "";
  const activeResult = results[activeIndex];

  function choose(id: number) {
    onSelect(id);
    setQuery("");
    setOpen(false);
    setActiveIndex(0);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!showList) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeResult) {
      e.preventDefault();
      choose(activeResult.id);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <label className="relative flex items-center">
        <span className="sr-only">Buscar Pokémon</span>
        <Icon name="search" className="pointer-events-none absolute left-4 text-ink-muted" />
        <input
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && activeResult ? `${listId}-${activeResult.id}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar Pokémon o N.º…"
          className="h-12 w-full rounded-full border border-line-strong bg-elevated pl-11 pr-4 text-[15px] placeholder:text-ink-muted focus:border-lime focus:outline-none focus:ring-4 focus:ring-lime-glow"
        />
      </label>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Resultados"
          className="absolute inset-x-0 top-full z-20 mt-2 rounded-md border border-line bg-surface p-1 shadow-panel"
        >
          {results.length === 0 ? (
            <li className="px-3 py-3 text-sm text-ink-muted">Ningún Pokémon con ese nombre en el radar.</li>
          ) : (
            results.map((pokemon, i) => {
              const region = REGIONS.find((r) => r.id === pokemon.region);
              return (
                <li
                  key={pokemon.id}
                  id={`${listId}-${pokemon.id}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={(e) => e.preventDefault()} // que el input no pierda el foco antes del clic
                  onClick={() => choose(pokemon.id)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex cursor-pointer items-center gap-3 rounded-sm px-2 py-1.5 ${
                    i === activeIndex ? "bg-elevated" : ""
                  }`}
                >
                  <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-elevated">
                    <PokemonSprite id={pokemon.id} className="size-[130%]" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[15px] font-medium">{formatName(pokemon.name)}</span>
                    <span className="truncate text-xs text-ink-muted">
                      <span className="font-mono">{formatDexNumber(pokemon.id)}</span> · {region?.name}
                    </span>
                  </span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}