import { useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

const THRESHOLD = 6;

export type TileDrag = { id: string; x: number; y: number } | null;

/// Pointer drag of a tile with a ghost; a move under a few pixels stays a click. `onDrop` gets the id and
/// whether the pointer was released over `target`. The click that follows a real drag is swallowed.
export function useTileDrag(target: RefObject<HTMLElement | null>, onDrop: (id: string, inside: boolean) => void) {
  const [drag, setDrag] = useState<TileDrag>(null);
  const start = useRef<{ id: string; x: number; y: number } | null>(null);
  const moved = useRef(false);

  const onPointerDown = (id: string) => (e: ReactPointerEvent) => {
    start.current = { id, x: e.clientX, y: e.clientY };
    moved.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const s = start.current;
    if (!s) return;
    if (!moved.current && Math.hypot(e.clientX - s.x, e.clientY - s.y) < THRESHOLD) return;
    moved.current = true;
    setDrag({ id: s.id, x: e.clientX, y: e.clientY });
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const s = start.current;
    start.current = null;
    setDrag(null);
    if (!s || !moved.current) return;
    const box = target.current?.getBoundingClientRect();
    const inside = !!box && e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom;
    onDrop(s.id, inside);
  };
  /// True (and clears the flag) when the click ends a drag and must be ignored.
  const swallowClick = () => {
    const was = moved.current;
    moved.current = false;
    return was;
  };
  return { drag, bind: (id: string) => ({ onPointerDown: onPointerDown(id), onPointerMove, onPointerUp, onPointerCancel: onPointerUp }), swallowClick };
}
