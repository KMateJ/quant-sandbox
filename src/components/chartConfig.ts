import { useEffect, useState } from "react";

/**
 * True while at least one chart (matching `selector`) is within the usable
 * viewport band, i.e. below the sticky topbar and above the fixed control dock.
 * Re-queried on every scroll so it stays correct even when charts re-render,
 * and the dock-height allowance keeps it honest on short phones.
 */
export function useChartInViewport(selector = ".chart-wrap"): boolean {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const TOPBAR = 56;
    const DOCK = 150;

    const check = () => {
      const nodes = document.querySelectorAll(selector);
      const usableBottom = window.innerHeight - DOCK;
      let visible = false;
      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        if (rect.bottom > TOPBAR && rect.top < usableBottom) {
          visible = true;
          break;
        }
      }
      setInView(visible);
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [selector]);

  return inView;
}
