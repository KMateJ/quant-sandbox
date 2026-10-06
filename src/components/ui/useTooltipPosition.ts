import { useLayoutEffect, useState, type RefObject } from "react";
import { positionTooltip } from "./tooltip.math";

/// Track portal geometry as the anchor, tooltip or scroll containers change.
export function useTooltipPosition(
  anchor: RefObject<HTMLElement | null>,
  bubble: RefObject<HTMLElement | null>,
) {
  const [position, setPosition] = useState<{ left: number; top: number }>();
  useLayoutEffect(() => {
    const update = () => {
      if (!anchor.current || !bubble.current) return;
      const next = positionTooltip(
        anchor.current.getBoundingClientRect(),
        bubble.current.getBoundingClientRect(),
        { width: document.documentElement.clientWidth, height: window.innerHeight },
      );
      setPosition((previous) => previous?.left === next.left && previous.top === next.top
        ? previous : next);
    };
    const observer = new ResizeObserver(update);
    if (anchor.current) observer.observe(anchor.current);
    if (bubble.current) observer.observe(bubble.current);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [anchor, bubble]);
  return position;
}
