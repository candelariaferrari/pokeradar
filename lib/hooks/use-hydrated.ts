import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** mostrar un skeleton */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}