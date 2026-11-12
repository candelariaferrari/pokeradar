"use client";

import PokemonPageShell from "@/components/pokemon/PokemonPageShell";
import ErrorState from "@/components/ui/ErrorState";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PokemonError({ reset }: ErrorPageProps) {
  return (
    <PokemonPageShell>
      <ErrorState
        title="No pudimos leer la señal"
        message="La PokéAPI no respondió. Revisá tu conexión y volvé a intentar."
        onRetry={reset}
      />
    </PokemonPageShell>
  );
}