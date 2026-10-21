import { useLayoutEffect } from "react";

/// Sticky, independently scrolling control columns (every layout variant).
const STICKY_SELECTOR = ".workspace.cols-sidebar > .panel:first-child, .view-controls, .stoch-sidebar";
const BOTTOM_GAP = 16;

/// Caps each sticky control column at the viewport space actually left below it.
/// A static `100vh - offset` overflows while the column still sits below the page
/// header, hiding its bottom until the page scrolls; this tracks the real position.
export function useStickyFit(): void {
  useLayoutEffect(() => {
    let frame = 0;
    const fit = () => {
      frame = 0;
      for (const el of document.querySelectorAll<HTMLElement>(STICKY_SELECTOR)) {
        if (getComputedStyle(el).position !== "sticky") {
          el.style.removeProperty("--fit-max-h");
          continue;
        }
        const stickyTop = parseFloat(getComputedStyle(el).top) || 0;
        const top = Math.max(el.getBoundingClientRect().top, stickyTop);
        el.style.setProperty("--fit-max-h", `${Math.max(160, window.innerHeight - top - BOTTOM_GAP)}px`);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(fit);
    };

    // Fit synchronously on layout changes (observer callbacks run before paint): a lazily
    // mounted column would otherwise paint one frame at the CSS fallback height.
    const resize = new ResizeObserver(fit);
    resize.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    fit();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
}
