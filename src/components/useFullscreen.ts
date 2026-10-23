import { useCallback, useState, useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  document.addEventListener("fullscreenchange", onChange);
  return () => document.removeEventListener("fullscreenchange", onChange);
};
const fullscreenElement = () => document.fullscreenElement;
const fullscreenEnabled = () => Boolean(document.fullscreenEnabled);

/// Fullscreen control for one element: pass `target` as the element's callback ref, then call `toggle`.
/// `supported` is false during pre-render and on browsers without the Fullscreen API (e.g. iPhone).
export function useFullscreen<T extends HTMLElement>() {
  const [element, target] = useState<T | null>(null);
  const current = useSyncExternalStore(subscribe, fullscreenElement, () => null);
  const supported = useSyncExternalStore(subscribe, fullscreenEnabled, () => false);

  const toggle = useCallback(() => {
    // Browsers reject without a user gesture or when blocked by policy; the button then does nothing.
    const done = document.fullscreenElement ? document.exitFullscreen() : element?.requestFullscreen();
    done?.catch(() => {});
  }, [element]);

  return { target, supported, active: element !== null && current === element, toggle };
}
