import type { MarketParams, PayoffShape } from "./replication.types";

export type ShapePresetKey = "tent" | "digital" | "butterfly" | "range" | "capped";

export const SHAPE_PRESET_KEYS: ShapePresetKey[] = ["tent", "digital", "butterfly", "range", "capped"];

export const SHAPE_PRESETS: Record<ShapePresetKey, PayoffShape> = {
  tent: {
    nodes: [{ x: 70, y: 5 }, { x: 90, y: 5 }, { x: 105, y: 25 }, { x: 125, y: 25 }, { x: 140, y: 10 }],
    steepness: 0.6,
    leftSlope: 0,
    rightSlope: 0,
  },
  digital: { nodes: [{ x: 95, y: 0 }, { x: 105, y: 10 }], steepness: 0.95, leftSlope: 0, rightSlope: 0 },
  butterfly: { nodes: [{ x: 80, y: 0 }, { x: 100, y: 20 }, { x: 120, y: 0 }], steepness: 0, leftSlope: 0, rightSlope: 0 },
  range: {
    nodes: [{ x: 80, y: 0 }, { x: 90, y: 10 }, { x: 110, y: 10 }, { x: 120, y: 0 }],
    steepness: 0.9,
    leftSlope: 0,
    rightSlope: 0,
  },
  capped: { nodes: [{ x: 60, y: 0 }, { x: 100, y: 0 }, { x: 130, y: 30 }], steepness: 0, leftSlope: 0, rightSlope: 0 },
};

export const DEFAULT_MARKET: MarketParams = { spot: 100, rate: 0.04, sigma: 0.25, maturity: 1, skew: 0, strikeStep: 0 };
