import PokemonPageShell from "@/components/pokemon/PokemonPageShell";
import PokemonProfileSkeleton from "@/components/pokemon/PokemonProfileSkeleton";

export default function Loading() {
  return (
    <PokemonPageShell>
      <PokemonProfileSkeleton />
    </PokemonPageShell>
  );
}