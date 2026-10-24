import { useMemo, useState } from "react";
import { useUrlState } from "../../components/useUrlState";
import { keyRateDv01, mtmAttribution, parSwapRate, parallelDv01, swapLegs, swapMtm, type SwapSpec } from "../../lib/finance/swap";
import { MATURITIES, presetNodes } from "../yield-curve/presets";
import type { CurveNode, PresetId } from "../yield-curve/yieldCurve.types";
import { nodesFromUrl, urlFromNodes } from "../yield-curve/yieldCurve.url";
import { curveFromNodes } from "./swap.math";
import { SWAP_SCHEMA } from "./swap.url";

const MAX_RATE = 0.12;

/// Key-rate buckets that matter: drop nodes whose DV01 is under 0.1% of the largest.
function material(krd: { tenor: number; dv01: number }[]) {
  const max = Math.max(...krd.map((k) => Math.abs(k.dv01)));
  return krd.filter((k) => Math.abs(k.dv01) >= 1e-3 * max);
}

/// Curve from quotes, or null when the quotes cannot be bootstrapped (negative discount factor).
function tryCurve(nodes: CurveNode[]) {
  try {
    return curveFromNodes(nodes);
  } catch {
    return null;
  }
}

/// Interest rate swap lab state: terms, the editable curve, the par or locked fixed rate and every derived number.
export function useSwap() {
  const [url, setUrl] = useUrlState(SWAP_SCHEMA);
  const [selected, setSelected] = useState<number | null>(null);
  const { nodes, preset } = useMemo(() => nodesFromUrl(url.preset, url.n), [url.preset, url.n]);
  const lockNodes = useMemo(
    () => (url.k !== null && url.lk ? MATURITIES.map((m, i) => ({ ...m, rate: url.lk![i] / 100 })) : null),
    [url.k, url.lk],
  );
  const curve = useMemo(() => tryCurve(nodes), [nodes]);
  const terms = { notional: url.notional, tenor: url.tenor, freq: Number(url.freq), payer: url.side === "payer" };
  const par = curve ? parSwapRate(terms, curve) : NaN;
  const locked = url.k !== null;
  const spec: SwapSpec = { ...terms, fixedRate: locked ? url.k! / 100 : par };

  const derived = useMemo(() => {
    if (!curve) return null;
    return {
      legs: swapLegs(spec, curve),
      mtm: swapMtm(spec, curve),
      dv01: parallelDv01(spec, nodes, curveFromNodes),
      krd: material(keyRateDv01(spec, nodes, curveFromNodes)),
      attribution: lockNodes && tryCurve(lockNodes) ? mtmAttribution(spec, lockNodes, nodes, curveFromNodes) : null,
    };
    // spec is rebuilt each render from these primitives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curve, nodes, lockNodes, spec.notional, spec.tenor, spec.freq, spec.payer, spec.fixedRate]);

  const setCurve = (next: CurveNode[], id: PresetId | "custom") => setUrl(urlFromNodes(id, next));
  return {
    url,
    nodes,
    preset,
    curve,
    spec,
    par,
    locked,
    lockNodes,
    derived,
    selected,
    setSelected,
    setUrl,
    setRate: (i: number, rate: number) => setCurve(nodes.map((n, j) => (j === i ? { ...n, rate: Math.min(MAX_RATE, Math.max(0, rate)) } : n)), "custom"),
    setPreset: (id: PresetId) => setCurve(presetNodes(id), id),
    lock: () => Number.isFinite(par) && setUrl({ k: par * 100, lk: nodes.map((n) => n.rate * 100) }),
    unlock: () => setUrl({ k: null, lk: null }),
  };
}

export type SwapModel = ReturnType<typeof useSwap>;
