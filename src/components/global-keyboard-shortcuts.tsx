"use client";

import { useKeyboardShortcuts, useShortcutToast, ShortcutToast } from "@/hooks/use-keyboard-shortcuts";
import { useEffect, useCallback, useRef, useState } from "react";
import { useMounted } from "@/hooks/use-mounted";

/**
 * GlobalKeyboardShortcuts - wraps the app to provide:
 *   / → open global search (Ctrl+K equivalent)
 *   m → mute toggle (simple theme flash feedback)
 *   w → scroll up
 *   s → scroll down
 *   a → go back in history
 *   d → go forward in history
 *   Enter → click focused/first CTA
 *   Esc → close overlays
 */
export function GlobalKeyboardShortcuts({ children }: { children: React.ReactNode }) {
  const { toast, show, dismiss } = useShortcutToast();
  const [muted, setMuted] = useState(false);

  const openSearch = useCallback(() => {
    // Trigger the global search dialog (simulates Ctrl+K)
    const event = new KeyboardEvent("keydown", {
      key: "k",
      code: "KeyK",
      ctrlKey: true,
      metaKey: false,
      bubbles: true,
    });
    window.dispatchEvent(event);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      show(next ? "🔇 Muted" : "🔊 Unmuted");
      return next;
    });
  }, [show]);

  const scrollUp = useCallback(() => {
    window.scrollBy({ top: -200, behavior: "smooth" });
  }, []);

  const scrollDown = useCallback(() => {
    window.scrollBy({ top: 200, behavior: "smooth" });
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1) window.history.back();
  }, []);

  const goForward = useCallback(() => {
    window.history.forward();
  }, []);

  const handleEnter = useCallback(() => {
    // Find and click the first visible CTA or focused element
    const focused = document.activeElement as HTMLElement;
    if (focused && focused !== document.body) {
      (focused as HTMLElement).click?.();
      return;
    }
    // Find the first prominent button/link
    const cta = document.querySelector('a[href], button:not([disabled])') as HTMLElement;
    if (cta) cta.click?.();
  }, []);

  const handleEscape = useCallback(() => {
    // Close any open dialogs/sheets by pressing Escape naturally
    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      code: "Escape",
      bubbles: true,
    });
    document.dispatchEvent(event);
  }, []);

  useKeyboardShortcuts({
    onSearch: openSearch,
    onMute: toggleMute,
    onUp: scrollUp,
    onDown: scrollDown,
    onLeft: goBack,
    onRight: goForward,
    onEnter: handleEnter,
    onEscape: handleEscape,
  });

  const mounted = useMounted();

  return (
    <>
      {children}
      {mounted && toast && <ShortcutToast message={toast} onDone={dismiss} />}
    </>
  );
}