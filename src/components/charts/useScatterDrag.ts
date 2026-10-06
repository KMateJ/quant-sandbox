import { useRef, type PointerEvent, type RefObject } from "react";

type Options = {
  svgRef: RefObject<SVGSVGElement | null>;
  toData: (event: PointerEvent<SVGSVGElement>) => [number, number] | null;
  onDrag?: (x: number, y: number, index: number) => void;
  onDragStart?: (index: number) => void;
  onDragEnd?: () => void;
};

/// Pointer capture keeps a drag attached to its original node, including on touch.
export function useScatterDrag({ svgRef, toData, onDrag, onDragStart, onDragEnd }: Options) {
  const drag = useRef<{ index: number; pointer: number } | null>(null);
  const end = () => {
    if (!drag.current) return;
    drag.current = null;
    onDragEnd?.();
  };
  return {
    start: (event: PointerEvent<SVGCircleElement>, index: number) => {
      if (event.button !== 0 || !onDrag) return;
      event.preventDefault();
      drag.current = { index, pointer: event.pointerId };
      svgRef.current?.setPointerCapture(event.pointerId);
      onDragStart?.(index);
    },
    handlers: {
      onPointerMove: (event: PointerEvent<SVGSVGElement>) => {
        if (!drag.current || drag.current.pointer !== event.pointerId) return;
        event.preventDefault();
        const point = toData(event);
        if (!point) return;
        const [x, y] = point;
        onDrag?.(x, y, drag.current.index);
      },
      onPointerUp: end,
      onPointerCancel: end,
      onLostPointerCapture: end,
    },
  };
}
