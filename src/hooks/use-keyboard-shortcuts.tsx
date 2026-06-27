"use client";

import { useEffect, useCallback, useRef, useState } from "react";

interface KeyboardShortcutsOptions {
  onSearch?: () => void;
  onMute?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  extraBindings?: Record<string, () => void>;
  disabled?: boolean;
}

const INPUT_TAGS = ["INPUT", "TEXTAREA", "SELECT"];

function isInputFocused(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement;
  if (!target) return false;
  if (INPUT_TAGS.includes(target.tagName)) return true;
  if (target.isContentEditable || target.getAttribute("contenteditable") === "true") return true;
  if (target.closest("[contenteditable=true]")) return true;
  return false;
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions) {
  const optsRef = useRef(options);
  optsRef.current = options;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (optsRef.current.disabled) return;
    const isInput = isInputFocused(e);
    const key = e.key.toLowerCase();

    if (key === "/" && !isInput) {
      e.preventDefault();
      optsRef.current.onSearch?.();
      return;
    }

    if (isInput && key !== "enter" && key !== "escape") return;

    switch (key) {
      case "m":
        e.preventDefault();
        optsRef.current.onMute?.();
        break;
      case "w":
        e.preventDefault();
        optsRef.current.onUp?.();
        break;
      case "s":
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          optsRef.current.onDown?.();
        }
        break;
      case "a":
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          optsRef.current.onLeft?.();
        }
        break;
      case "d":
        e.preventDefault();
        optsRef.current.onRight?.();
        break;
      case "enter":
        e.preventDefault();
        optsRef.current.onEnter?.();
        break;
      case "escape":
        optsRef.current.onEscape?.();
        break;
      default:
        if (optsRef.current.extraBindings?.[key]) {
          e.preventDefault();
          optsRef.current.extraBindings[key]();
        }
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export function useShortcutToast() {
  const [toast, setToast] = useState<string | null>(null);

  const show = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  const dismiss = useCallback(() => setToast(null), []);

  return { toast, show, dismiss };
}

export function ShortcutToast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-2 pointer-events-none">
      <div className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium shadow-lg">
        {message}
      </div>
    </div>
  );
}