import { useEffect, useSyncExternalStore } from "react";
import { useLocation } from "react-router-dom";
import { useActiveModule } from "./useActiveModule";

export type LastLab = { id: string; href: string; at: number };

const STORAGE_KEY = "qs-last-lab";
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedLab: LastLab | null = null;

function read(): LastLab | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (raw === cachedRaw) return cachedLab;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    cachedLab = parsed?.id && parsed?.href ? (parsed as LastLab) : null;
  } catch {
    cachedLab = null;
  }
  return cachedLab;
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

/// Saves the active lab (id + path + query) whenever the location changes.
export function useRecordLastLab(): void {
  const { activeModule } = useActiveModule();
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!activeModule?.category || activeModule.category === "guides") return;
    const lab: LastLab = { id: activeModule.id, href: pathname + search, at: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lab));
    } catch {
      // Storage unavailable (private mode); Continue simply stays empty.
    }
    listeners.forEach((notify) => notify());
  }, [activeModule, pathname, search]);
}

/// The lab the reader last opened on this device, or null (always null before hydration).
export function useLastLab(): LastLab | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
