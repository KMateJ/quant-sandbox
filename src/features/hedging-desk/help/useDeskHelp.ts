import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { isTyping } from "../../../components/layout/isTyping";
import { prefersReducedMotion } from "../../../components/playback/useTicker";
import { POINT_MS } from "./help.config";
import type { HelpAnchor, HelpTab } from "./help.types";

export type DeskHelp = {
  open: boolean;
  tab: HelpTab;
  pointed: HelpAnchor | null;
  toggle: (tab?: HelpTab) => void;
  show: (tab: HelpTab) => void;
  close: () => void;
  point: (anchor: HelpAnchor) => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
};

/// Help drawer state for the desk: open flag, active tab, F1 / `?` shortcuts and the "show me" outline.
/// Inactive while the demo runs.
export function useDeskHelp(demo: boolean): DeskHelp {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<HelpTab>("next");
  const [pointed, setPointed] = useState<HelpAnchor | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const state = useRef({ open, tab, demo });
  useEffect(() => {
    state.current = { open, tab, demo };
  });

  const close = useCallback(() => setOpen(false), []);
  const show = useCallback((next: HelpTab) => {
    setTab(next);
    setOpen(true);
  }, []);
  const toggle = useCallback((next?: HelpTab) => {
    const cur = state.current;
    if (cur.open && (next === undefined || next === cur.tab)) setOpen(false);
    else show(next ?? cur.tab);
  }, [show]);
  const point = useCallback((anchor: HelpAnchor) => {
    if (window.matchMedia("(max-width: 900px)").matches) setOpen(false);
    setPointed(anchor);
    document.getElementById(`hd-${anchor}`)?.scrollIntoView({
      block: "center",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPointed(null), POINT_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (state.current.demo || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "F1" && !e.shiftKey) {
        e.preventDefault();
        toggle();
      } else if (e.key === "?" && !isTyping(e.target)) toggle();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  return { open: open && !demo, tab, pointed, toggle, show, close, point, buttonRef };
}
