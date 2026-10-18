import { useMemo, useState } from "react";
import type { MarketParams, PayoffShape, ReplicationMethod } from "./replication.types";
import { blPrice, buildPiecewise, densityCurve, replicate } from "./replication.math";
import { DEFAULT_MARKET, SHAPE_PRESETS, type ShapePresetKey } from "./replication.presets";

export const REPLICATION_METHODS: ReplicationMethod[] = ["calls", "puts", "carr-madan"];

const snap = (v: number, step: number) => Math.round(v / step) * step;

/// State and derived pricing for the payoff replication lab.
export function useReplication() {
  const [shape, setShape] = useState<PayoffShape>(SHAPE_PRESETS.tent);
  const [market, setMarket] = useState<MarketParams>(DEFAULT_MARKET);
  const [method, setMethod] = useState<ReplicationMethod>("carr-madan");
  const [showLegs, setShowLegs] = useState(true);

  const xMax = 2 * market.spot;
  const clampX = (x: number) => Math.min(xMax, Math.max(0.5, snap(x, 0.5)));

  const pw = useMemo(() => buildPiecewise(shape), [shape]);
  const portfolios = useMemo(
    () => REPLICATION_METHODS.map((m) => replicate(pw, market, m)),
    [pw, market]
  );
  const bl = useMemo(() => blPrice(pw, market, xMax), [pw, market, xMax]);
  const density = useMemo(() => densityCurve(market, xMax), [market, xMax]);
  const selected = portfolios.find((p) => p.method === method) ?? portfolios[0];

  const updateShape = (patch: Partial<PayoffShape>) => setShape((prev) => ({ ...prev, ...patch }));
  const updateMarket = (patch: Partial<MarketParams>) => setMarket((prev) => ({ ...prev, ...patch }));

  const addNode = (x: number, y: number) =>
    setShape((prev) => {
      const node = { x: clampX(x), y: snap(y, 0.5) };
      const rest = prev.nodes.filter((n) => Math.abs(n.x - node.x) > 0.25);
      return { ...prev, nodes: [...rest, node] };
    });

  const moveNode = (index: number, x: number, y: number) =>
    setShape((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n, i) => (i === index ? { x: clampX(x), y: snap(y, 0.5) } : n)),
    }));

  const removeNode = (index: number) =>
    setShape((prev) => ({ ...prev, nodes: prev.nodes.filter((_, i) => i !== index) }));

  const applyPreset = (key: ShapePresetKey) => setShape(SHAPE_PRESETS[key]);
  const clearNodes = () => updateShape({ nodes: [] });

  return {
    shape, market, method, setMethod, showLegs, setShowLegs, xMax, pw, portfolios, selected, bl, density,
    updateShape, updateMarket, addNode, moveNode, removeNode, applyPreset, clearNodes,
  };
}

export type ReplicationModel = ReturnType<typeof useReplication>;
