"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";

type CopyStatus = "idle" | "copied" | "error";

export default function CopyLinkButton({ pokemonId }: { pokemonId: number }) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Si se cierra la ficha antes de los 2 segundos, cancelamos el timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function copyLink() {
    const url = `${window.location.origin}/pokemon/${pokemonId}`;
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("error"); // por ejemplo, si el navegador no da permiso
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus("idle"), 2000);
  }

  const copied = status === "copied";

  return (
    <div className="relative flex items-center">
      {/* Aviso: aparece a la izquierda del botón y lo leen los lectores de pantalla */}
      <span
        role="status"
        className={`pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-full bg-elevated px-3 py-1 text-xs font-medium transition-opacity ${status === "idle" ? "opacity-0" : "opacity-100"
          } ${status === "error" ? "text-danger" : "text-lime"}`}
      >
        {copied ? "Link copiado" : status === "error" ? "No se pudo copiar" : ""}
      </span>
      <Tooltip label="Copiar link">
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copiar link de este Pokémon"
          className="grid size-9 place-items-center rounded-full text-ink-muted hover:bg-elevated hover:text-ink"
        >
          <Icon name={copied ? "check" : "link"} className={copied ? "text-lime" : ""} />
        </button>
      </Tooltip>
    </div>
  );
}