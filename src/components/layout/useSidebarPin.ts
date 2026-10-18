import { useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "qs-sidebar-pinned";
const listeners = new Set<() => void>();

function readPinned(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "0";
  } catch {
    return true;
  }
}

function writePinned(pinned: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, pinned ? "1" : "0");
  } catch {
    // Storage unavailable (private mode); the toggle still works for this page view.
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && Boolean(target.closest("input, textarea, select, [contenteditable='true']"));

/// Sidebar pin state, remembered across visits; `[` toggles it from anywhere outside a text field.
/// Pre-rendered HTML always starts pinned, so hydration matches before the stored choice applies.
export function useSidebarPin() {
  const pinned = useSyncExternalStore(subscribe, readPinned, () => true);
  const toggle = useCallback(() => writePinned(!readPinned()), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "[" || event.ctrlKey || event.metaKey || event.altKey || isTyping(event.target)) return;
      event.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return { pinned, toggle };
}
