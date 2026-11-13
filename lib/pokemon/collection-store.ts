import { useSyncExternalStore } from "react";

import { TEAM_SIZE } from "./team";

export const MAX_FAVORITES = TEAM_SIZE;
const STORAGE_KEY = "pokeradar:collection:v1";

export interface Collection {
  discovered: number[];
  favorites: number[];
}

const EMPTY: Collection = { discovered: [], favorites: [] };

let state: Collection = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

/** Lee localStorage una sola vez (y valida lo que encuentra) */
function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    state = {
      discovered: Array.isArray(parsed.discovered) ? parsed.discovered : [],
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites.slice(0, MAX_FAVORITES) : [],
    };
  } catch {
    // Modo privado, datos corruptos, etc.: arrancamos de cero sin romper la app
  }
}

function save(next: Collection) {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Si no se puede guardar, la app sigue funcionando en memoria
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Si el usuario tiene la app abierta en otra pestaña, nos sincronizamos
  function onStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY) return;
    loaded = false;
    load();
    listener();
  }
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return EMPTY; // en el servidor no existe localStorage
}

export const collectionStore = {
  discover(id: number) {
    if (state.discovered.includes(id)) return;
    save({ ...state, discovered: [...state.discovered, id] });
  },

  toggleFavorite(id: number): boolean {
    if (state.favorites.includes(id)) {
      save({ ...state, favorites: state.favorites.filter((f) => f !== id) });
      return true;
    }
    if (state.favorites.length >= MAX_FAVORITES) return false;
    save({ ...state, favorites: [...state.favorites, id] });
    return true;
  },
};

/** Hook para leer la colección desde cualquier componente */
export function useCollection(): Collection {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}