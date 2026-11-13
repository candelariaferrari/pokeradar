"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { teamPath } from "@/lib/pokemon/team";

type ShareStatus = "idle" | "copied" | "error";

interface ShareTeamButtonProps {
  ids: number[];
  variant?: "icon" | "button";
}

export default function ShareTeamButton({ ids, variant = "icon" }: ShareTeamButtonProps) {
  const [status, setStatus] = useState<ShareStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function share() {
    const url = `${window.location.origin}${teamPath(ids)}`;

    // En el celular: menú nativo para compartir (WhatsApp, Telegram, etc.)
    if (navigator.share) {
      try {
        await navigator.share({ title: "Mi equipo PokéradAR", url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return; // lo cerró
      }
    }

    // En la compu (o si falló lo anterior): copiar el link
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus("idle"), 2000);
  }

  const message = status === "copied" ? "Link copiado" : status === "error" ? "No se pudo copiar" : "";

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={share}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-[1.5px] border-lime px-5 text-sm font-semibold text-lime transition-colors hover:bg-lime-glow"
      >
        <Icon name={status === "copied" ? "check" : "link"} size={18} />
        <span role="status">{message || "Compartir equipo"}</span>
      </button>
    );
  }

  return (
    <div className="relative flex items-center">
      <span
        role="status"
        className={`pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-full bg-elevated px-3 py-1 text-xs font-medium transition-opacity ${
          status === "idle" ? "opacity-0" : "opacity-100"
        } ${status === "error" ? "text-danger" : "text-lime"}`}
      >
        {message}
      </span>
      <Tooltip label="Compartir equipo">
        <button
          type="button"
          onClick={share}
          aria-label="Compartir equipo"
          className="grid size-9 place-items-center rounded-full text-ink-muted hover:bg-elevated hover:text-ink"
        >
          <Icon name={status === "copied" ? "check" : "link"} className={status === "copied" ? "text-lime" : ""} />
        </button>
      </Tooltip>
    </div>
  );
}