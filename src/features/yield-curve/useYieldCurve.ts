import { useCallback, useMemo, useState } from "react";
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

  const term = useMemo(() => buildTermStructure(nodes), [nodes]);

  const setRate = useCallback((index: number, rate: number) => {
    setNodes((prev) =>
      prev.map((n, i) => (i === index ? { ...n, rate } : n))
    );
    setPreset("custom");
  }, []);

  const setAllRates = useCallback((rates: number[]) => {
    setNodes((prev) => prev.map((n, i) => ({ ...n, rate: rates[i] ?? n.rate })));
    setPreset("custom");
  }, []);

  const applyPreset = useCallback((id: PresetId) => {
    setNodes(presetNodes(id));
    setPreset(id);
  }, []);

  return {
    nodes,
    preset,
    term,
    selected,
    setSelected,
    setRate,
    setAllRates,
    applyPreset,
  };
}

export type YieldCurveModel = ReturnType<typeof useYieldCurve>;
