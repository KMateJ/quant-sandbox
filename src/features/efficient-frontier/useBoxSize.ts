import { useLayoutEffect, useRef, useState } from "react";

/// Measures a container synchronously (ref-based) so the SVG renders on first
/// paint, without waiting for a ResizeObserver callback that can lag under CSS zoom.
export function useBoxSize() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () =>
      setSize((prev) => {
        const width = el.clientWidth;
        const height = el.clientHeight;
        return prev.width === width && prev.height === height ? prev : { width, height };
      });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, ...size };
}
