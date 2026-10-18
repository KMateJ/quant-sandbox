import type { MarketParams, PayoffNode, PayoffShape } from "./replication.types";
import { DEFAULT_MARKET, SHAPE_PRESETS } from "./replication.presets";

/// Search params holding the replication lab: nodes, shape settings, market.
const KEYS = { nodes: "rn", shape: "rs", market: "rm" } as const;
const MARKET_FIELDS: (keyof MarketParams)[] = ["spot", "rate", "sigma", "maturity", "skew", "strikeStep"];

const num = (v: number) => String(Number(v.toFixed(6)));

function parseNumbers(raw: string | null, count: number): number[] | null {
  if (!raw) return null;
  const values = raw.split(",").map(Number);
  return values.length === count && values.every(Number.isFinite) ? values : null;
}

function parseNodes(raw: string | null): PayoffNode[] | null {
  if (raw === null) return null;
  if (raw === "") return [];
  const nodes = raw.split(";").map((part) => {
    const [x, y, s] = part.split("_").map(Number);
    const node: PayoffNode = { x, y };
    if (Number.isFinite(s)) node.steepness = s;
    return node;
  });
  return nodes.every((n) => Number.isFinite(n.x) && Number.isFinite(n.y) && n.x > 0) ? nodes : null;
}

/// Reads the lab state from the URL, falling back to the default preset and market.
export function readReplicationUrl(params: URLSearchParams): { shape: PayoffShape; market: MarketParams } {
  const fallback = SHAPE_PRESETS.tent;
  const nodes = parseNodes(params.get(KEYS.nodes));
  const shape = parseNumbers(params.get(KEYS.shape), 3);
  const market = parseNumbers(params.get(KEYS.market), MARKET_FIELDS.length);
  return {
    shape: shape && nodes
      ? { nodes, steepness: shape[0], leftSlope: shape[1], rightSlope: shape[2] }
      : fallback,
    market: market
      ? (Object.fromEntries(MARKET_FIELDS.map((key, i) => [key, market[i]])) as MarketParams)
      : DEFAULT_MARKET,
  };
}

/// Writes the lab state into a copy of `params`, keeping unrelated keys.
export function writeReplicationUrl(params: URLSearchParams, shape: PayoffShape, market: MarketParams) {
  const next = new URLSearchParams(params);
  next.set(KEYS.nodes, shape.nodes
    .map((n) => [n.x, n.y, ...(n.steepness === undefined ? [] : [n.steepness])].map(num).join("_"))
    .join(";"));
  next.set(KEYS.shape, [shape.steepness, shape.leftSlope, shape.rightSlope].map(num).join(","));
  next.set(KEYS.market, MARKET_FIELDS.map((key) => num(market[key])).join(","));
  return next;
}
