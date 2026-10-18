import type { Direction, InstrumentType, PositionGroup, PresetKey, StrategyLeg, ViewMode } from "./payoff.types";
import { getPresetStrategy } from "./payoff.presets";
import { liveGroups } from "./payoff.positions";


const DEFAULT_LEGS: StrategyLeg[] = [
  {
    id: "initial-call",
    type: "call",
    direction: "long",
    quantity: 1,
    strike: 100,
    premium: 8,
  },
  {
    id: "initial-put",
    type: "put",
    direction: "short",
    quantity: 1,
    strike: 100,
    premium: 8,
  },
];


const PRESET_KEYS: PresetKey[] = [
  "long-call",
  "long-put",
  "covered-call",
  "protective-put",
  "synthetic-long-forward",
  "synthetic-short-forward",
  "long-stock",
  "cash",
  "long-call-butterfly",
  "bull-call-spread",
  "bear-put-spread",
  "long-straddle",
  "short-straddle",
  "long-strangle",
  "short-strangle",
  "collar",
  "risk-reversal",
  "box-spread",
  "digital-call",
  "digital-put",
  "asset-call",
  "gap-call",
  "double-digital",
  "supershare",
];


const INSTRUMENT_TYPES: InstrumentType[] = [
  "call",
  "put",
  "forward",
  "stock",
  "cash",
  "digital-call",
  "digital-put",
  "asset-call",
  "asset-put",
  "gap-call",
  "gap-put",
  "double-digital",
  "supershare",
];


function isValidMode(value: string | null): value is ViewMode {
  return value === "payoff" || value === "profit";
}


function isValidPreset(value: string | null): value is PresetKey {
  return value !== null && PRESET_KEYS.includes(value as PresetKey);
}


function isValidInstrumentType(value: string): value is InstrumentType {
  return INSTRUMENT_TYPES.includes(value as InstrumentType);
}


function toFiniteNumber(value: string | undefined): number | null {
  if (value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}


function serializeNumber(value: number | undefined): string {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : "";
}


function createLegId(index: number) {
  return `url-leg-${index + 1}`;
}


function serializeLeg(leg: StrategyLeg): string {
  const base = [leg.type, leg.direction, String(leg.quantity)];

  switch (leg.type) {
    case "call":
    case "put":
    case "asset-call":
    case "asset-put":
      return [...base, serializeNumber(leg.strike), serializeNumber(leg.premium)].join(",");

    case "digital-call":
    case "digital-put":
      return [
        ...base,
        serializeNumber(leg.strike),
        serializeNumber(leg.premium),
        serializeNumber(leg.payout),
      ].join(",");

    case "gap-call":
    case "gap-put":
      return [
        ...base,
        serializeNumber(leg.triggerStrike),
        serializeNumber(leg.settlementStrike),
        serializeNumber(leg.premium),
      ].join(",");

    case "double-digital":
      return [
        ...base,
        serializeNumber(leg.lowerStrike),
        serializeNumber(leg.upperStrike),
        serializeNumber(leg.premium),
        serializeNumber(leg.payout),
      ].join(",");

    case "supershare":
      return [
        ...base,
        serializeNumber(leg.lowerStrike),
        serializeNumber(leg.upperStrike),
        serializeNumber(leg.premium),
      ].join(",");

    case "forward":
      return [
        ...base,
        serializeNumber(leg.forwardPrice),
        serializeNumber(leg.strike),
      ].join(",");

    case "stock":
      return [...base, serializeNumber(leg.entryPrice)].join(",");

    case "cash":
      return [...base, serializeNumber(leg.cashAmount), serializeNumber(leg.rate)].join(",");

    default:
      return base.join(",");
  }
}


/// URL encoding of strategy legs, as read back by the `legs` search param.
export function serializeLegs(legs: StrategyLeg[]): string {
  return legs.map(serializeLeg).join(";");
}


function parseLeg(segment: string, index: number): StrategyLeg | null {
  const parts = segment.split(",");
  const [type, direction, quantityRaw] = parts;

  if (
    !type ||
    !direction ||
    !quantityRaw ||
    !isValidInstrumentType(type) ||
    !["long", "short"].includes(direction)
  ) {
    return null;
  }

  const quantity = Number(quantityRaw);
  if (!Number.isFinite(quantity) || quantity <= 0) return null;

  const common = {
    id: createLegId(index),
    type,
    direction: direction as StrategyLeg["direction"],
    quantity,
  } satisfies Pick<StrategyLeg, "id" | "type" | "direction" | "quantity">;

  if (["call", "put", "asset-call", "asset-put"].includes(type)) {
    const strike = toFiniteNumber(parts[3]);
    if (strike === null) return null;

    return {
      ...common,
      type,
      strike,
      premium: toFiniteNumber(parts[4]) ?? 0,
    };
  }

  if (type === "digital-call" || type === "digital-put") {
    const strike = toFiniteNumber(parts[3]);
    if (strike === null) return null;

    return {
      ...common,
      type,
      strike,
      premium: toFiniteNumber(parts[4]) ?? 0,
      payout: toFiniteNumber(parts[5]) ?? 1,
    };
  }

  if (type === "gap-call" || type === "gap-put") {
    const triggerStrike = toFiniteNumber(parts[3]);
    const settlementStrike = toFiniteNumber(parts[4]);
    if (triggerStrike === null || settlementStrike === null) return null;

    return {
      ...common,
      type,
      triggerStrike,
      settlementStrike,
      premium: toFiniteNumber(parts[5]) ?? 0,
    };
  }

  if (type === "double-digital") {
    const lowerStrike = toFiniteNumber(parts[3]);
    const upperStrike = toFiniteNumber(parts[4]);
    if (lowerStrike === null || upperStrike === null) return null;

    return {
      ...common,
      type,
      lowerStrike,
      upperStrike,
      premium: toFiniteNumber(parts[5]) ?? 0,
      payout: toFiniteNumber(parts[6]) ?? 1,
    };
  }

  if (type === "supershare") {
    const lowerStrike = toFiniteNumber(parts[3]);
    const upperStrike = toFiniteNumber(parts[4]);
    if (lowerStrike === null || upperStrike === null) return null;

    return {
      ...common,
      type,
      lowerStrike,
      upperStrike,
      premium: toFiniteNumber(parts[5]) ?? 0,
    };
  }

  if (type === "forward") {
    const forwardPrice = toFiniteNumber(parts[3]);
    if (forwardPrice === null) return null;

    return {
      ...common,
      type,
      forwardPrice,
      strike: toFiniteNumber(parts[4]) ?? forwardPrice,
    };
  }

  if (type === "stock") {
    const entryPrice = toFiniteNumber(parts[3]);
    if (entryPrice === null) return null;

    return {
      ...common,
      type,
      entryPrice,
    };
  }

  const cashAmount = toFiniteNumber(parts[3]);
  if (cashAmount === null) return null;

  return {
    ...common,
    type: "cash",
    cashAmount,
    rate: toFiniteNumber(parts[4]) ?? 0.05,
  };
}


function parseLegs(value: string | null): StrategyLeg[] | null {
  if (value === null) return null;
  if (value === "") return [];

  const segments = value
    .split(";")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (!segments.length) return [];

  const parsed = segments.map((segment, index) => parseLeg(segment, index));

  if (parsed.some((leg) => leg === null)) {
    return null;
  }

  return parsed as StrategyLeg[];
}


// #region Positions

const POSITION_SEP = "|";
const FIELD_SEP = "~";
const cleanName = (name: string) => name.replace(/[~|]/g, " ").trim().slice(0, 40) || "Position";

/// Positions as `name~direction~quantity~i.j.k`, where i, j, k are member leg indices.
export function serializeGroups(legs: StrategyLeg[], groups: PositionGroup[]): string {
  return liveGroups(legs, groups)
    .map((g) => {
      const members = legs.flatMap((leg, i) => (leg.groupId === g.id ? [i] : [])).join(".");
      return [cleanName(g.name), g.direction, String(g.quantity), members].join(FIELD_SEP);
    })
    .join(POSITION_SEP);
}

/// Restores positions and tags their member legs; malformed entries are skipped.
function parseGroups(value: string | null, legs: StrategyLeg[]): { legs: StrategyLeg[]; groups: PositionGroup[] } {
  if (!value) return { legs, groups: [] };
  const groups: PositionGroup[] = [];
  const tagged = [...legs];
  value.split(POSITION_SEP).forEach((entry, n) => {
    const [name, direction, quantityRaw, membersRaw] = entry.split(FIELD_SEP);
    const quantity = Number(quantityRaw);
    const members = (membersRaw ?? "").split(".").map(Number).filter((i) => Number.isInteger(i) && tagged[i]);
    if (!name || !["long", "short"].includes(direction) || !(quantity > 0) || !members.length) return;
    const id = `url-pos-${n + 1}`;
    groups.push({ id, name, direction: direction as Direction, quantity });
    members.forEach((i) => { tagged[i] = { ...tagged[i], groupId: id }; });
  });
  return { legs: tagged, groups };
}

// #endregion

export type UrlState = {
  mode: ViewMode;
  showComponents: boolean;
  selectedPreset: PresetKey | null;
  legs: StrategyLeg[];
  groups: PositionGroup[];
};


/// Builder state from the URL: explicit legs (+ positions) win over a preset, else the default.
export function readUrlState(searchParams: URLSearchParams): UrlState {
  const mode = isValidMode(searchParams.get("mode"))
    ? (searchParams.get("mode") as ViewMode)
    : "payoff";

  const showComponents = searchParams.get("components") === "1";
  const parsedLegs = parseLegs(searchParams.get("legs"));

  if (parsedLegs !== null) {
    return {
      mode,
      showComponents,
      selectedPreset: null,
      ...parseGroups(searchParams.get("positions"), parsedLegs),
    };
  }

  const preset = isValidPreset(searchParams.get("preset"))
    ? (searchParams.get("preset") as PresetKey)
    : null;

  return {
    mode,
    showComponents,
    selectedPreset: preset,
    legs: preset ? getPresetStrategy(preset) : DEFAULT_LEGS,
    groups: [],
  };
}


/// URL for a builder state; positions are only written alongside explicit legs.
export function buildSearchParams(
  mode: ViewMode,
  showComponents: boolean,
  selectedPreset: PresetKey | null,
  legs: StrategyLeg[],
  groups: PositionGroup[] = []
): URLSearchParams {
  const nextParams = new URLSearchParams();

  if (mode !== "payoff") {
    nextParams.set("mode", mode);
  }

  if (showComponents) {
    nextParams.set("components", "1");
  }

  if (selectedPreset) {
    nextParams.set("preset", selectedPreset);
  } else {
    nextParams.set("legs", serializeLegs(legs));
    const positions = serializeGroups(legs, groups);
    if (positions) nextParams.set("positions", positions);
  }

  return nextParams;
}
