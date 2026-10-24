import { useCallback, useEffect } from "react";
import { isTyping } from "../layout/isTyping";
import { prefersReducedMotion, useTicker } from "../playback/useTicker";
import { endDemo, requestDemoButtonFocus, setDemoPosition, useDemoPosition } from "./demoPosition";

const FOCUS = "gdesk-demo-focus";

export type DemoPlayer = {
  index: number; total: number; playing: boolean; atStart: boolean; atEnd: boolean;
  play(): void; pause(): void; toggle(): void; next(): void; back(): void; goTo(i: number): void;
  takeOver(): void; exit(): void;
};

type Options = {
  deskId: string;
  total: number;
  holdMs: (i: number) => number;
  /// Restores step `i` (book, screen, ticket); runs whenever the step changes.
  onEnter: (i: number) => void;
  /// Element id to lift while step `i` shows, or null.
  focusId: (i: number) => string | null;
  onTakeOver: () => void;
  onExit: () => void;
  /// False outside demo mode.
  active: boolean;
};

/// Drives a scripted playthrough: position, autoplay (unless reduced motion), ← → Space Esc, and the
/// `gdesk-demo-focus` class on the narrated element. Returns null when not active.
export function useDemoPlayer({ deskId, total, holdMs, onEnter, focusId, onTakeOver, onExit, active }: Options): DemoPlayer | null {
  const { index, playing, started, ended } = useDemoPosition(deskId);

  // A bar mounting on a fresh or ended run starts a new demo; a remount on a screen switch keeps the position.
  useEffect(() => {
    if (!active) return;
    setDemoPosition(deskId, (p) =>
      p.started && !p.ended ? p : { index: 0, playing: !prefersReducedMotion(), started: true, ended: false },
    );
  }, [active, deskId]);
  const running = active && started && !ended;
  const atStart = index === 0;
  const atEnd = index >= total - 1;

  useEffect(() => {
    if (running) onEnter(index);
    // onEnter is a fresh closure each render; the step index is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, index]);

  const id = running ? focusId(index) : null;
  useEffect(() => {
    if (!id) return;
    let el: HTMLElement | null = null;
    const frame = requestAnimationFrame(() => {
      el = document.getElementById(id);
      el?.classList.add(FOCUS);
      el?.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    });
    return () => {
      cancelAnimationFrame(frame);
      el?.classList.remove(FOCUS);
    };
  }, [id]);

  const next = useCallback(
    () => setDemoPosition(deskId, (p) => (p.index >= total - 1 ? { ...p, playing: false } : { ...p, index: p.index + 1 })),
    [deskId, total],
  );
  const back = useCallback(() => setDemoPosition(deskId, (p) => ({ ...p, index: Math.max(0, p.index - 1) })), [deskId]);
  const goTo = useCallback(
    (i: number) => setDemoPosition(deskId, (p) => ({ ...p, index: Math.min(total - 1, Math.max(0, i)) })),
    [deskId, total],
  );
  const play = useCallback(() => setDemoPosition(deskId, (p) => ({ ...p, playing: true })), [deskId]);
  const pause = useCallback(() => setDemoPosition(deskId, (p) => ({ ...p, playing: false })), [deskId]);
  const toggle = useCallback(() => setDemoPosition(deskId, (p) => ({ ...p, playing: !p.playing })), [deskId]);
  const takeOver = useCallback(() => {
    endDemo(deskId);
    onTakeOver();
  }, [deskId, onTakeOver]);
  const exit = useCallback(() => {
    endDemo(deskId);
    requestDemoButtonFocus(deskId);
    onExit();
  }, [deskId, onExit]);

  useTicker(running && playing && !atEnd, holdMs(index), next, pause);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || isTyping(e.target)) return;
      if (e.key === " " && e.target instanceof HTMLButtonElement) return;
      const handlers: Record<string, () => void> = { ArrowRight: next, ArrowLeft: back, " ": toggle, Escape: exit };
      const handler = handlers[e.key];
      if (!handler) return;
      e.preventDefault();
      handler();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, next, back, toggle, exit]);

  if (!active) return null;
  return { index, total, playing, atStart, atEnd, play, pause, toggle, next, back, goTo, takeOver, exit };
}
