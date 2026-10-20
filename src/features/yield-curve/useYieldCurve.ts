import { useCallback, useMemo, useRef, useState } from "react";
import type { CurveNode, PresetId } from "./yieldCurve.types";
import { presetNodes } from "./presets";
import { buildTermStructure } from "./yieldCurve.math";

/// Shared term-structure model for the Yield Curve Lab. Holds the par-rate nodes
/// (the single source of truth) and derives zero rates, discount factors and
/// forwards. Every view reads and mutates this one state so the representations
/// stay linked.
export function useYieldCurve() {
  const [nodes, setNodes] = useState<CurveNode[]>(() => presetNodes("normal"));
  const [preset, setPreset] = useState<PresetId | "custom">("normal");
  const [selected, setSelected] = useState(5);
  const [before, setBefore] = useState<CurveNode[]>(nodes);
  const [error, setError] = useState(false);
  const [version, setVersion] = useState(0);
  const current = useRef(nodes);
  const edit = useRef<{ before: CurveNode[]; captured: boolean } | null>(null);

  const term = useMemo(() => buildTermStructure(nodes), [nodes]);
  const beforeTerm = useMemo(() => buildTermStructure(before), [before]);

  const beginEdit = useCallback((index: number) => {
    setSelected(index);
    if (!edit.current) edit.current = { before: current.current, captured: false };
  }, []);

  const endEdit = useCallback(() => { edit.current = null; }, []);

  const commit = useCallback((next: CurveNode[], nextPreset: PresetId | "custom") => {
    if (next.some((n) => !Number.isFinite(n.rate) || n.rate < 0 || n.rate > 0.12)) {
      setError(true);
      return;
    }
    try {
      buildTermStructure(next);
    } catch (cause) {
      if (!(cause instanceof RangeError)) throw cause;
      setError(true);
      return;
    }
    setError(false);
    if (next.every((n, i) => n.rate === current.current[i].rate)) return;
    if (!edit.current?.captured) {
      setBefore(edit.current?.before ?? current.current);
      if (edit.current) edit.current.captured = true;
    }
    current.current = next;
    setNodes(next);
    setPreset(nextPreset);
    setVersion((v) => v + 1);
  }, []);

  const setRate = useCallback((index: number, rate: number) => {
    setSelected(index);
    commit(current.current.map((n, i) => i === index ? { ...n, rate } : n), "custom");
  }, [commit]);

  const setAllRates = useCallback((rates: number[]) => {
    endEdit();
    commit(current.current.map((n, i) => ({ ...n, rate: rates[i] ?? n.rate })), "custom");
  }, [commit, endEdit]);

  /// Sets every par rate without closing the current edit, so a sketch stroke counts as one before/after change.
  const sketchRates = useCallback((rates: number[]) => {
    commit(current.current.map((n, i) => ({ ...n, rate: rates[i] ?? n.rate })), "custom");
  }, [commit]);

  const applyPreset = useCallback((id: PresetId) => {
    endEdit();
    commit(presetNodes(id), id);
    setPreset(id);
  }, [commit, endEdit]);

  /// Replaces the curve (e.g. from the URL) as one change; invalid or identical curves are ignored.
  const load = useCallback((next: CurveNode[], nextPreset: PresetId | "custom") => {
    endEdit();
    commit(next, nextPreset);
  }, [commit, endEdit]);

  const reset = useCallback(() => {
    endEdit();
    const initial = presetNodes("normal");
    current.current = initial;
    setNodes(initial);
    setBefore(initial);
    setPreset("normal");
    setVersion((v) => v + 1);
    setSelected(5);
    setError(false);
  }, [endEdit]);

  return {
    nodes,
    /// Bumps on every committed change, so a URL writer can skip the initial render.
    version,
    preset,
    term,
    beforeTerm,
    error,
    selected,
    setSelected,
    setRate,
    setAllRates,
    sketchRates,
    applyPreset,
    load,
    beginEdit,
    endEdit,
    reset,
  };
}

export type YieldCurveModel = ReturnType<typeof useYieldCurve>;
