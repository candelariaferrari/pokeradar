import { useSyncExternalStore } from "react";

const STORAGE_KEY = "pokeradar:sound:v1";
let enabled = false; // apagado por defecto
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    enabled = localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    // modo privado, etc.: queda apagado
  }
}

export function isSoundOn(): boolean {
  load();
  return enabled;
}

export function setSoundOn(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {}
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Hook: ¿están activados los sonidos? */
export function useSoundOn(): boolean {
  return useSyncExternalStore(subscribe, isSoundOn, () => false);
}

/** Generador de sonidos (Web Audio API, sin archivos) */

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!context) context = new AudioContext();
  if (context.state === "suspended") void context.resume();
  return context;
}

interface ToneOptions {
  type?: OscillatorType;
  volume?: number;
  delay?: number;
}

function tone(from: number, to: number, duration: number, { type = "sine", volume = 0.07, delay = 0 }: ToneOptions = {}) {
  const ac = getContext();
  if (!ac) return;

  const start = ac.currentTime + delay;
  const oscillator = ac.createOscillator();
  const gain = ac.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(from, start);
  oscillator.frequency.exponentialRampToValueAtTime(to, start + duration);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain).connect(ac.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
}

const SOUNDS = {
  /** Barrido de radar + dos "pings" */
  scan() {
    tone(420, 1200, 0.45, { volume: 0.05 });
    tone(1200, 1200, 0.1, { delay: 0.5, volume: 0.05 });
    tone(1200, 1200, 0.1, { delay: 0.72, volume: 0.03 });
  },
  /** Bip corto al elegir un Pokémon */
  select() {
    tone(880, 1320, 0.09, { type: "triangle", volume: 0.06 });
  },
  /** Dos notas que suben: se sumó al equipo */
  favoriteAdd() {
    tone(660, 660, 0.1, { type: "triangle" });
    tone(990, 990, 0.18, { type: "triangle", delay: 0.09 });
  },
  /** Una nota que baja: salió del equipo */
  favoriteRemove() {
    tone(660, 440, 0.16, { type: "triangle", volume: 0.05 });
  },
};

export type SoundName = keyof typeof SOUNDS;

/** Reproduce un sonido solo si el usuario los activó */
export function playSound(name: SoundName) {
  if (!isSoundOn()) return;
  SOUNDS[name]();
}

/** Para el botón del header: activa/desactiva y da una confirmación audible */
export function toggleSound() {
  const next = !isSoundOn();
  setSoundOn(next);
  if (next) SOUNDS.select();
}