import { useCallback, useEffect, useState } from "react";

const ROOT_CLASS = "page-expanded";

/// In-browser "expand": the element covers the viewport (site header and sidebar hidden behind it)
/// without entering the browser's fullscreen mode. Escape collapses it; page scroll is locked meanwhile.
export function useExpandInPage() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const root = document.documentElement;
    root.classList.add(ROOT_CLASS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.fullscreenElement) setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.classList.remove(ROOT_CLASS);
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  const toggle = useCallback(() => setExpanded((v) => !v), []);
  return { expanded, toggle };
}
