import { guideTracks, trackLessons } from "./guide.meta";
import type { GuideId } from "./guide.types";
import { useGuideProgress } from "./useGuideProgress";

/// Read count, total and next unread lesson of the guide track behind a sidebar module id ("guide-<track>").
export function useTrackProgress(moduleId: string): { read: number; total: number; nextId?: GuideId } | null {
  const { isRead } = useGuideProgress();
  const track = guideTracks.find((tr) => `guide-${tr.id}` === moduleId);
  if (!track) return null;
  const lessons = trackLessons(track);
  return {
    read: lessons.filter((l) => isRead(l.id)).length,
    total: lessons.length,
    nextId: lessons.find((l) => !isRead(l.id))?.id,
  };
}
