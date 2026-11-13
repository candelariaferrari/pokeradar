import { useSyncExternalStore } from "react";

const STORAGE_KEY = "pokeradar:sound:v1";
let enabled = false; 
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

/** Hook */
export function useSoundOn(): boolean {
  return useSyncExternalStore(subscribe, isSoundOn, () => false);
}

/** Generador de sonidos (Web Audio API, sin archivos) */

let context: AudioContext | null = null;

/** Espera a que el audio esté "despierto" antes de programar los tonos */
function withContext(play: (ac: AudioContext) => void) {
  if (typeof window === "undefined") return;
  context ??= new AudioContext();
  const ac = context;
  if (ac.state === "running") {
    play(ac);
    return;
  }
  ac.resume()
    .then(() => play(ac))
    .catch(() => {}); // si el navegador no lo permite, silencio sin romper nada
}

interface ToneOptions {
  type?: OscillatorType;
  volume?: number;
  delay?: number;
}

function tone(
  ac: AudioContext,
  from: number,
  to: number,
  duration: number,
  { type = "sine", volume = 0.07, delay = 0 }: ToneOptions = {}
) {
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

type Sound = (ac: AudioContext, count: number) => void;

const SOUNDS = {
  /** Barrido de radar */
  scan(ac) {
    tone(ac, 420, 1200, 0.45, { volume: 0.05 });
  },
  /** Un "blip" por Pokémon, al ritmo de la animación de entrada de los marcadores */
  detect(ac, count) {
    for (let i = 0; i < count; i++) {
      tone(ac, 1100 + i * 45, 1100 + i * 45, 0.06, { type: "triangle", volume: 0.025, delay: 0.25 + i * 0.07 });
    }
  },
  /** Viaje a otra región: sube mientras vuela la cámara y "aterriza" con dos notas */
  travel(ac) {
    tone(ac, 220, 560, 0.9, { volume: 0.04 });
    tone(ac, 784, 784, 0.12, { type: "triangle", volume: 0.05, delay: 1.05 });
    tone(ac, 1175, 1175, 0.22, { type: "triangle", volume: 0.04, delay: 1.17 });
  },
  /** Bip corto al elegir un Pokémon */
  select(ac) {
    tone(ac, 880, 1320, 0.09, { type: "triangle", volume: 0.06 });
  },
  /** Dos notas que suben: se sumó al equipo */
  favoriteAdd(ac) {
    tone(ac, 660, 660, 0.1, { type: "triangle" });
    tone(ac, 990, 990, 0.18, { type: "triangle", delay: 0.09 });
  },
  /** Una nota que baja: salió del equipo */
  favoriteRemove(ac) {
    tone(ac, 660, 440, 0.16, { type: "triangle", volume: 0.05 });
  },
} satisfies Record<string, Sound>;

export type SoundName = keyof typeof SOUNDS;

/** Reproduce un sonido solo si el usuario los activó. `count`: cuántos Pokémon aparecen */
export function playSound(name: SoundName, count = 0) {
  if (!isSoundOn()) return;
  withContext((ac) => SOUNDS[name](ac, count));
}

/** Para el botón del header: activa/desactiva y da una confirmación audible */
export function toggleSound() {
  const next = !isSoundOn();
  setSoundOn(next);
  if (next) withContext((ac) => SOUNDS.select(ac));
}