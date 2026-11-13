import PokemonPageShell from "@/components/pokemon/PokemonPageShell";

export default function Loading() {
  return (
    <PokemonPageShell wide>
      <div className="flex flex-col gap-3" aria-busy="true">
        <span className="h-4 w-40 animate-pulse rounded-sm bg-line" />
        <span className="h-9 w-72 animate-pulse rounded-sm bg-line" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <span key={i} className="h-72 animate-pulse rounded-lg bg-surface" />
        ))}
      </div>
    </PokemonPageShell>
  );
}