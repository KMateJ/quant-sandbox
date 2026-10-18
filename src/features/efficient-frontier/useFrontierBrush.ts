import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { brushKeyStep, nearestReturnIndex } from "./frontierBrush.math";
import type { OptPoint } from "./portfolioOptimization.types";

/// Shared "active point" across the frontier chart, the composition chart and the weights panel:
/// hovering previews a frontier portfolio, clicking (or scrubbing) pins it as the selection.
export function useFrontierBrush(branch: OptPoint[], selected: OptPoint, selectReturn: (ret: number) => void) {
  const [hover, setHover] = useState<number | null>(null);
  const selectedIndex = useMemo(() => nearestReturnIndex(branch, selected.ret), [branch, selected]);
  const hoverIndex = hover != null && hover < branch.length ? hover : null;

  return {
    branch,
    selectedIndex,
    hoverIndex,
    activeIndex: hoverIndex ?? selectedIndex,
    /// The portfolio every linked view shows: the hovered one while previewing, else the selection.
    active: hoverIndex != null ? branch[hoverIndex] : selected,
    hover: setHover,
    select: (index: number) => {
      setHover(null);
      if (branch[index]) selectReturn(branch[index].ret);
    },
  };
}

export type FrontierBrush = ReturnType<typeof useFrontierBrush>;

/// Pointer + keyboard handlers for a brushable element: hover previews, press-and-drag scrubs the
/// selection (mouse, pen and touch via pointer capture), arrows/Home/End step along the frontier.
export function useBrushHandlers(brush: FrontierBrush, indexAt: (event: PointerEvent<Element>) => number) {
  const scrubbing = useRef(false);
  return {
    onPointerDown: (event: PointerEvent<Element>) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      scrubbing.current = true;
      brush.select(indexAt(event));
    },
    onPointerMove: (event: PointerEvent<Element>) => {
      const index = indexAt(event);
      if (scrubbing.current) brush.select(index);
      else if (event.pointerType === "mouse") brush.hover(index);
    },
    onPointerUp: () => {
      scrubbing.current = false;
    },
    onPointerCancel: () => {
      scrubbing.current = false;
    },
    onPointerLeave: () => brush.hover(null),
    onKeyDown: (event: KeyboardEvent<Element>) => {
      const next = brushKeyStep(brush.selectedIndex, brush.branch.length, event.key, event.shiftKey);
      if (next === null) return;
      event.preventDefault();
      brush.select(next);
    },
  };
}
