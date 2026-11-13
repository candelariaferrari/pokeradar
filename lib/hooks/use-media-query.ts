import { useCallback, useSyncExternalStore } from "react";

/** true si el media query se cumple; se actualiza al cambiar el tamaño de pantalla */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false // en el servidor no hay pantalla: asumimos mobile
  );
}