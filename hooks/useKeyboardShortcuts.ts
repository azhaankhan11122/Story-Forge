"use client";

import { useEffect } from "react";

interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  meta?: boolean;
  handler: (e: KeyboardEvent) => void;
}

export function useKeyboardShortcuts(
  handlers: ShortcutHandler[],
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable;
      if (isInput) return;

      for (const h of handlers) {
        const keyMatch = e.key.toLowerCase() === h.key.toLowerCase();
        const ctrlMatch = h.ctrl ? e.ctrlKey : true;
        const metaMatch = h.meta ? e.metaKey : true;
        const shiftMatch = h.shift ? e.shiftKey : true;

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch) {
          e.preventDefault();
          h.handler(e);
          return;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers, enabled]);
}
