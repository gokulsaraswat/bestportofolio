"use client";

import { useState, useEffect, useCallback } from "react";

interface AppSettings {
  enableCustomCursor?: boolean;
  cursorMagneticSnap?: boolean;
  enableAutoEmbeds?: boolean;
  enableAnimations?: boolean;
  [key: string]: unknown;
}

const DEFAULTS: AppSettings = {
  enableCustomCursor: false,
  cursorMagneticSnap: true,
  enableAutoEmbeds: true,
  enableAnimations: true,
};

let cachedSettings: AppSettings | null = null;
let fetchPromise: Promise<AppSettings> | null = null;

export function useAppSettings(): AppSettings & { loading: boolean } {
  const [settings, setSettings] = useState<AppSettings>(cachedSettings || DEFAULTS);
  const [loading, setLoading] = useState(!cachedSettings);

  const fetchSettings = useCallback(async () => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return cachedSettings;
    }

    if (fetchPromise) return fetchPromise;

    fetchPromise = (async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          const merged = { ...DEFAULTS, ...data };
          cachedSettings = merged;
          setSettings(merged);
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
        fetchPromise = null;
      }
      return cachedSettings || DEFAULTS;
    })();

    return fetchPromise;
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  return { ...settings, loading };
}

/** Quick check — can be used outside React */
export function getSetting(key: string): boolean {
  return !!(cachedSettings?.[key] ?? DEFAULTS[key]);
}