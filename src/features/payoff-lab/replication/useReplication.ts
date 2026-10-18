import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { MarketParams, PayoffShape, ReplicationMethod } from "./replication.types";
import { blPrice, buildPiecewise, densityCurve, gridConvergence, optionSizing, replicateAll } from "./replication.math";
import { SHAPE_PRESETS, type ShapePresetKey } from "./replication.presets";
import { readReplicationUrl, writeReplicationUrl } from "./replication.url";

export const REPLICATION_METHODS: ReplicationMethod[] = ["calls", "puts", "carr-madan"];
export const STRIKE_STEPS = [0, 0.5, 1, 2.5, 5, 10];
const CONVERGENCE_STEPS = [10, 5, 2.5, 1, 0.5];
/// Above this many options at one strike, steep edges are flagged as impractical.
export const LARGE_POSITION = 10;

const snap = (v: number, step: number) => Math.round(v / step) * step;

/// State and derived pricing for the payoff replication lab; mirrored to the URL while `active`.
export function useReplication(active: boolean) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [initial] = useState(() => readReplicationUrl(searchParams));
  const [shape, setShape] = useState<PayoffShape>(initial.shape);
  const [market, setMarket] = useState<MarketParams>(initial.market);
  const [method, setMethod] = useState<ReplicationMethod>("carr-madan");
  const [showLegs, setShowLegs] = useState(true);

  useEffect(() => {
    if (!active) return;
    const next = writeReplicationUrl(searchParams, shape, market);
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
  }, [active, shape, market, searchParams, setSearchParams]);

  const xMax = 2 * market.spot;
  const clampX = (x: number) => Math.min(xMax, Math.max(0.5, snap(x, 0.5)));

  const pw = useMemo(() => buildPiecewise(shape), [shape]);
  const { tradable, portfolios } = useMemo(() => replicateAll(pw, market, REPLICATION_METHODS), [pw, market]);
  const bl = useMemo(() => blPrice(pw, market, xMax), [pw, market, xMax]);
  const convergence = useMemo(() => gridConvergence(pw, market, bl.price, CONVERGENCE_STEPS), [pw, market, bl.price]);
  const density = useMemo(() => densityCurve(market, xMax), [market, xMax]);
  const selected = portfolios.find((p) => p.method === method) ?? portfolios[0];
  const sizing = useMemo(() => optionSizing(selected), [selected]);

  const updateShape = (patch: Partial<PayoffShape>) => setShape((prev) => ({ ...prev, ...patch }));
  const updateMarket = (patch: Partial<MarketParams>) => setMarket((prev) => ({ ...prev, ...patch }));

  const updateNode = (index: number, patch: Partial<PayoffShape["nodes"][number]>) =>
    setShape((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n, i) => (i === index ? { ...n, ...patch } : n)),
    }));

  const addNode = (x: number, y: number) =>
    setShape((prev) => {
      const node = { x: clampX(x), y: snap(y, 0.5) };
      const rest = prev.nodes.filter((n) => Math.abs(n.x - node.x) > 0.25);
      return { ...prev, nodes: [...rest, node] };
    });

  const moveNode = (index: number, x: number, y: number) => updateNode(index, { x: clampX(x), y: snap(y, 0.5) });
  const setEdgeSteepness = (index: number, steepness: number) => updateNode(index, { steepness });

  /// The shape-wide slider resets every per-edge override.
  const setSteepness = (steepness: number) =>
    setShape((prev) => ({ ...prev, steepness, nodes: prev.nodes.map(({ x, y }) => ({ x, y })) }));

  const removeNode = (index: number) =>
    setShape((prev) => ({ ...prev, nodes: prev.nodes.filter((_, i) => i !== index) }));

  const applyPreset = (key: ShapePresetKey) => setShape(SHAPE_PRESETS[key]);
  const clearNodes = () => updateShape({ nodes: [] });

  return {
    shape, market, method, setMethod, showLegs, setShowLegs, xMax, pw, tradable, portfolios, selected, sizing,
    bl, convergence, density, updateShape, updateMarket, addNode, moveNode, setEdgeSteepness, setSteepness,
    removeNode, applyPreset, clearNodes,
  };
}

export type ReplicationModel = ReturnType<typeof useReplication>;
