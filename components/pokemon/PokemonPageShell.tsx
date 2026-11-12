import type { ReactNode } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function PokemonPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-deep/90 px-4 backdrop-blur">
        <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-[15px] hover:bg-elevated">
          <Icon name="arrow-left" size={20} />
          Mapa
        </Link>
        <span className="text-lg font-bold tracking-tight">
          Pokérad<span className="text-lime">AR</span>
        </span>
      </header>
      <main className="mx-auto flex max-w-xl flex-col gap-6 p-4 pb-10 sm:p-6">{children}</main>
    </div>
  );
}