import { useEffect, useRef, useState } from "react";

/**
 * Recharts (v3) clears the tooltip only on `mouseleave`; on touch devices the
 * finger lift fires `touchend`, which it ignores, so the tooltip sticks. This
 * ref listens for touch end/cancel and synthesises the `mouseout` that React
 * turns into the `onMouseLeave` Recharts needs to hide the tooltip.
 */
export function useChartTouchDismiss<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const dismiss = (event: TouchEvent) => {
      // Stop the browser from replaying compatibility mouse events that would
      // immediately re-open the tooltip after the finger is lifted.
      if (event.cancelable) event.preventDefault();

      const wrapper = node.querySelector<HTMLElement>(".recharts-wrapper");
      if (!wrapper) return;

      wrapper.dispatchEvent(
        new MouseEvent("mouseout", {
          bubbles: true,
          cancelable: true,
          view: window,
          relatedTarget: null,
        })
      );
    };

    node.addEventListener("touchend", dismiss, { passive: false });
    node.addEventListener("touchcancel", dismiss, { passive: false });
    return () => {
      node.removeEventListener("touchend", dismiss);
      node.removeEventListener("touchcancel", dismiss);
    };
  }, []);

  return ref;
}

export type ChartMargin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

/**
 * Tighter margins on phones so the plotting area fills the card instead of
 * wasting space around a small chart.
 */
export function chartMargin(isMobile: boolean): ChartMargin {
  return isMobile
    ? { top: 8, right: 8, bottom: 4, left: 0 }
    : { top: 10, right: 20, bottom: 10, left: 10 };
}

export function axisTickStyle(isMobile: boolean) {
  return { fontSize: isMobile ? 11 : 12 };
}

export function yAxisWidth(isMobile: boolean): number {
  return isMobile ? 40 : 60;
}

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
