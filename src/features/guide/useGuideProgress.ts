import { useCallback, useEffect, useSyncExternalStore, type RefObject } from "react";
import type { GuideId } from "./guide.types";

const STORAGE_KEY = "qs-guide-read";
const EMPTY: readonly string[] = [];
const listeners = new Set<() => void>();
let cache: readonly string[] | null = null;

function read(): readonly string[] {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function markRead(id: GuideId) {
  const current = read();
  if (current.includes(id)) return;
  cache = [...current, id];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Storage unavailable (private mode): progress lives for this session only.
  }
  listeners.forEach((l) => l());
}

/// Marks the lesson read once the element at its end scrolls into view.
export function useMarkReadAtEnd(endRef: RefObject<HTMLElement | null>, id: GuideId) {
  useEffect(() => {
    const el = endRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        markRead(id);
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [endRef, id]);
}

/// Lessons this browser has read to the end, kept in localStorage.
export function useGuideProgress() {
  const readIds = useSyncExternalStore(subscribe, read, () => EMPTY);
  const isRead = useCallback((id: GuideId) => readIds.includes(id), [readIds]);
  return { isRead };
}
