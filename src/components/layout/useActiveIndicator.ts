import { useLayoutEffect, type RefObject } from "react";

/// Moves one shared indicator bar to the active row of `container` by writing CSS variables
/// (`--ind-y`, `--ind-h`, `--ind-o`), so a route change slides the bar instead of re-rendering it.
export function useActiveIndicator(container: RefObject<HTMLElement | null>, selector: string, key: unknown) {
  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    const place = () => {
      const active = root.querySelector<HTMLElement>(selector);
      root.style.setProperty("--ind-o", active ? "1" : "0");
      if (!active) return;
      // Measured against the container, not offsetTop: rows sit inside positioned wrappers (.side-node).
      const y = active.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop;
      root.style.setProperty("--ind-y", `${y}px`);
      root.style.setProperty("--ind-h", `${active.offsetHeight}px`);
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(root);
    return () => observer.disconnect();
  }, [container, selector, key]);
}

/// Scrolls `child` into view inside its nearest scrollable ancestor only (never the page itself).
export function revealInScroller(child: HTMLElement | null) {
  if (!child) return;
  let scroller = child.parentElement;
  while (scroller && !/(auto|scroll)/.test(getComputedStyle(scroller).overflowY)) scroller = scroller.parentElement;
  if (!scroller) return;
  const top = child.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
  const bottom = top + child.offsetHeight;
  if (top < 0) scroller.scrollBy({ top: top - 8, behavior: "smooth" });
  else if (bottom > scroller.clientHeight) scroller.scrollBy({ top: bottom - scroller.clientHeight + 8, behavior: "smooth" });
}
