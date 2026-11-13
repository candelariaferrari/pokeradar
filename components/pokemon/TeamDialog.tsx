"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";
import TeamCards from "@/components/pokemon/TeamCards";
import ShareTeamButton from "@/components/pokemon/ShareTeamButton";
import { TEAM_SIZE } from "@/lib/pokemon/team";
import type { PokemonRegionEntry } from "@/lib/pokemon/utils";

interface TeamDialogProps {
  team: PokemonRegionEntry[];
  open: boolean;
  onClose: () => void;
  onSelectPokemon: (id: number) => void;
}

/** El equipo completo encima del mapa, sin salir de la app */
export default function TeamDialog({ team, open, onClose, onSelectPokemon }: TeamDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // React decide si está abierto; el <dialog> nativo maneja foco, Escape y capa superior
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="team-dialog-title"
      onClose={onClose} // también se dispara con Escape
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // clic en el fondo oscuro
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(64rem,calc(100%-2rem))] overflow-y-auto rounded-lg border border-line bg-deep text-ink shadow-panel scrollbar-none backdrop:bg-deep/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Equipo de expedición · {team.length}/{TEAM_SIZE}
            </p>
            <h2 id="team-dialog-title" className="text-2xl font-bold tracking-tight lg:text-3xl">
              Tu equipo
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid size-10 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-elevated hover:text-ink"
          >
            <Icon name="close" />
          </button>
        </header>

        <TeamCards
          team={team}
          onSelect={(id) => {
            onClose();
            onSelectPokemon(id);
          }}
        />

        <ShareTeamButton ids={team.map((p) => p.id)} variant="button" />
      </div>
    </dialog>
  );
}
