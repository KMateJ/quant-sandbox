import { useCallback, useEffect, useMemo, type RefObject } from "react";
import { isTyping } from "../../../components/layout/isTyping";
import { prefersReducedMotion, useTicker } from "../../../components/playback";
import { STOCK_ID } from "../engine/desk.config";
import type { HedgingDeskModel } from "../useHedgingDesk";
import { runDemo } from "./demo.math";
import type { DemoStep } from "./demo.types";
import { endDemo, requestDemoButtonFocus, setDemoPosition, useDemoPosition } from "./demoStore";

/// Playback state and controls of the scripted playthrough.
export type DemoModel = {
  steps: DemoStep[]; index: number; step: DemoStep; total: number; atStart: boolean; atEnd: boolean;
  playing: boolean; play(): void; pause(): void; toggle(): void; next(): void; back(): void; goTo(i: number): void;
  takeOver(): void; exit(): void;
};

/// Drives the demo: restores step `k`'s book, screen and ticket, marks the highlighted anchor on the
/// desk root via `rootFrom` (any element inside `.hdesk`), auto-plays and handles arrow/space/escape.
/// Returns null outside demo mode.
export function useDemo(desk: HedgingDeskModel, rootFrom: RefObject<HTMLElement | null>): DemoModel | null {
  const { demo, mission, market, seed, dispatch, setScreen, setTicketId, setSide, setQty, takeOver, exitDemo } = desk;
  const run = useMemo(() => runDemo(mission, market, seed), [mission, market, seed]);
  const { index, playing, started, ended } = useDemoPosition();

  // A bar mounting on a fresh or ended run starts a new demo (auto-play unless reduced motion);
  // a bar remounting on the screen switch to the debrief keeps the position.
  useEffect(() => {
    setDemoPosition((p) =>
      p.started && !p.ended ? p : { index: 0, playing: !prefersReducedMotion(), started: true, ended: false },
    );
  }, []);
  const active = demo && started && !ended;
  const total = run.steps.length;
  const step = run.steps[index];
  const atStart = index === 0;
  const atEnd = index === total - 1;
  const screen = desk.url.screen;

  // Restore before switching screens, so the debrief mounts on a settled demo book.
  useEffect(() => {
    if (!active) return;
    const s = run.steps[index];
    dispatch({ type: "restore", state: run.states[index] });
    if (screen !== s.screen) setScreen(s.screen);
    if (s.ticket) {
      setTicketId(s.ticket.id);
      setSide(s.ticket.side);
      setQty(String(s.ticket.qty));
    } else setTicketId(STOCK_ID);
    // `screen` is read but not a trigger: the step decides the screen, not the other way round.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, index, run, dispatch, setScreen, setTicketId, setSide, setQty]);

  // The one DOM write: the root carries the anchor so CSS can lift that panel and dim the rest.
  useEffect(() => {
    if (!demo || typeof document === "undefined") return;
    const root = rootFrom.current?.closest<HTMLElement>(".hdesk");
    if (!root) return;
    root.dataset.demoAnchor = step.anchor;
    const frame = requestAnimationFrame(() =>
      document.getElementById(`hd-${step.anchor}`)?.scrollIntoView({
        block: "nearest",
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      }),
    );
    return () => {
      cancelAnimationFrame(frame);
      delete root.dataset.demoAnchor;
    };
  }, [demo, step.anchor, screen, rootFrom]);

  const next = useCallback(
    () => setDemoPosition((p) => (p.index >= total - 1 ? { ...p, playing: false } : { ...p, index: p.index + 1 })),
    [total],
  );
  const back = useCallback(() => setDemoPosition((p) => ({ ...p, index: Math.max(0, p.index - 1) })), []);
  const goTo = useCallback(
    (i: number) => setDemoPosition((p) => ({ ...p, index: Math.min(total - 1, Math.max(0, i)) })),
    [total],
  );
  const play = useCallback(() => setDemoPosition((p) => ({ ...p, playing: true })), []);
  const pause = useCallback(() => setDemoPosition((p) => ({ ...p, playing: false })), []);
  const toggle = useCallback(() => setDemoPosition((p) => ({ ...p, playing: !p.playing })), []);
  const take = useCallback(() => {
    endDemo();
    takeOver();
  }, [takeOver]);
  const exit = useCallback(() => {
    endDemo();
    requestDemoButtonFocus();
    exitDemo();
  }, [exitDemo]);

  useTicker(active && playing && !atEnd, step.holdMs, next, pause);

  useEffect(() => {
    if (!demo) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || isTyping(e.target)) return;
      // Let a focused button handle its own Space activation.
      if (e.key === " " && e.target instanceof HTMLButtonElement) return;
      const handlers: Record<string, () => void> = { ArrowRight: next, ArrowLeft: back, " ": toggle, Escape: exit };
      const handler = handlers[e.key];
      if (!handler) return;
      e.preventDefault();
      handler();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [demo, next, back, toggle, exit]);

  if (!demo) return null;
  return {
    steps: run.steps, index, step, total, atStart, atEnd, playing,
    play, pause, toggle, next, back, goTo, takeOver: take, exit,
  };
}
