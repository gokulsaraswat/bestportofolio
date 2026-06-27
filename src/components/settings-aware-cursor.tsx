"use client";

import { useAppSettings } from "@/hooks/use-app-settings";
import { CustomCursor } from "@/components/custom-cursor";

/**
 * Conditionally renders the custom cursor based on admin settings.
 * Wrap your layout with this component.
 *
 * Usage in layout.tsx:
 *   <SettingsAwareCursor />
 */
export function SettingsAwareCursor() {
  const { enableCustomCursor, loading } = useAppSettings();

  if (loading) return null;
  if (!enableCustomCursor) return null;

  return <CustomCursor />;
}