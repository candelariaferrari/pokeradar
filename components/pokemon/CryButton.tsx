"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";

interface CryButtonProps {
  src: string;
  name: string;
}

export default function CryButton({ src, name }: CryButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<"idle" | "playing" | "error">("idle");

  useEffect(() => {
    return () => audioRef.current?.pause();
  }, []);

  async function play() {
    try {
      audioRef.current?.pause();
      const audio = new Audio(src);
      audio.volume = 0.5;
      audio.onended = () => setState("idle");
      audioRef.current = audio;
      setState("playing");
      await audio.play();
    } catch {
      setState("error"); 
    }
  }

  const playing = state === "playing";

  return (
    <Tooltip label={state === "error" ? "Audio no disponible" : "Escuchar grito"}>
      <button
        type="button"
        onClick={play}
        disabled={state === "error"}
        aria-label={state === "error" ? "El grito no está disponible" : `Escuchar el grito de ${name}`}
        className={`grid size-9 place-items-center rounded-full border transition-colors hover:border-lime hover:text-lime disabled:cursor-not-allowed disabled:opacity-45 ${
          playing ? "border-lime text-lime" : "border-line bg-elevated text-ink-muted"
        }`}
      >
        <Icon name="volume" size={14} className={playing ? "animate-pulse" : ""} />
      </button>
    </Tooltip>
  );
}