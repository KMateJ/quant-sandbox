import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { isTyping } from "../layout/isTyping";
import { prefersReducedMotion } from "../playback/useTicker";

export type HelpTab = "next" | "whatIf" | "guide";
export const HELP_TABS: readonly HelpTab[] = ["next", "whatIf", "guide"];
const POINT_MS = 2500;
const POINTED = "gdesk-pointed";

export type GameHelp = {
  open: boolean;
  tab: HelpTab;
  pointed: string | null;
  toggle(tab?: HelpTab): void;
  show(tab: HelpTab): void;
  close(): void;
  point(anchor: string): void;
  buttonRef: RefObject<HTMLButtonElement | null>;
};

/// Help drawer state: open flag, tab, F1 / `?` shortcuts and "Show me", which outlines the element
/// `#<idPrefix><anchor>` for a moment. Inactive while `disabled` (the demo runs).
export function useGameHelp({ disabled, idPrefix }: { disabled: boolean; idPrefix: string }): GameHelp {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<HelpTab>("next");
  const [pointed, setPointed] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const state = useRef({ open, tab, disabled });
  useEffect(() => {
    state.current = { open, tab, disabled };
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
  const point = useCallback((anchor: string) => {
    if (window.matchMedia("(max-width: 900px)").matches) setOpen(false);
    setPointed(anchor);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPointed(null), POINT_MS);
  }, []);

  useEffect(() => {
    if (!pointed) return;
    const el = document.getElementById(idPrefix + pointed);
    if (!el) return;
    el.classList.add(POINTED);
    el.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    return () => el.classList.remove(POINTED);
  }, [pointed, idPrefix]);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (state.current.disabled || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "F1" && !e.shiftKey) {
        e.preventDefault();
        toggle();
      } else if (e.key === "?" && !isTyping(e.target)) toggle();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  return { open: open && !disabled, tab, pointed, toggle, show, close, point, buttonRef };
}
