"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `false` on the server and `true` on the client after hydration.
 * Uses useSyncExternalStore to avoid the React 19 "set-state-in-effect" lint error.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}