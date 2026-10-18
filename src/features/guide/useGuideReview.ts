import { useState, useSyncExternalStore } from "react";
import { useI18n } from "../../i18n";
import { guideContent } from "../../Language/guides";
import { collectChecks, recordAnswer, selectReviewQueue, type CheckRecord, type LessonCheck } from "./guide.check.logic";
import { guideLessons } from "./guide.meta";
import { useGuideReadLog } from "./useGuideProgress";

const STORAGE_KEY = "qs-guide-checks";
const EMPTY: Readonly<Record<string, CheckRecord>> = {};
const listeners = new Set<() => void>();
let cache: Readonly<Record<string, CheckRecord>> | null = null;
// Due dates are judged against page load; a tab left open overnight picks up new reviews on reload.
const loadedAt = typeof window === "undefined" ? 0 : Date.now();

function read(): Readonly<Record<string, CheckRecord>> {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    cache = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, CheckRecord>) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/// Stores the outcome of answering check `id` (in-lesson or in review); session-only without storage.
export function recordCheck(id: string, correct: boolean) {
  const current = read();
  cache = { ...current, [id]: recordAnswer(current[id], correct, Date.now()) };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Storage unavailable: the record lives for this session only.
  }
  listeners.forEach((l) => l());
}

const allLessonIds = guideLessons.map((l) => l.id);

/// Up to three checks due for review, in the current language. The selection is fixed once shown, so answering
/// one does not make it vanish mid-feedback; empty during pre-render and hydration.
export function useReviewQueue(): LessonCheck[] {
  const { language } = useI18n();
  const { readIds, readAt } = useGuideReadLog();
  const answers = useSyncExternalStore(subscribe, read, () => EMPTY);
  const [shown, setShown] = useState<string[] | null>(null);

  const checks = collectChecks(allLessonIds, guideContent, language);
  if (shown === null) {
    const due = selectReviewQueue({ checks, readIds, readAt, answers, now: loadedAt });
    if (due.length > 0) setShown(due.map((c) => c.block.id));
    return due;
  }
  return shown.flatMap((id) => checks.filter((c) => c.block.id === id));
}
