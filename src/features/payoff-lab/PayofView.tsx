import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { PresetKey, StrategyLeg, ViewMode } from "./payoff.types";
import {
  addSyntheticOverlay,
  buildChartData,
  collectRelevantStrikes,
  detectSyntheticLongForward,
  detectSyntheticShortForward,
} from "./payoff.math";
import { getPresetStrategy } from "./payoff.presets";
import PayoffBuilder from "./Components/PayoffBuilder";
import PayoffChart from "./Components/PayoffChart";
import PayoffSummary from "./Components/PayoffSummary";
import PayoffExplanation from "./Components/PayoffExplanation";

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
];

function isValidMode(value: string | null): value is ViewMode {
  return value === "payoff" || value === "profit";
}

function isValidPreset(value: string | null): value is PresetKey {
  return value !== null && PRESET_KEYS.includes(value as PresetKey);
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
      return [...base, serializeNumber(leg.strike), serializeNumber(leg.premium)].join(",") ;

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

function serializeLegs(legs: StrategyLeg[]): string {
  return legs.map(serializeLeg).join(";");
}

function parseLeg(segment: string, index: number): StrategyLeg | null {
  const parts = segment.split(",");
  const [type, direction, quantityRaw] = parts;

  if (
    !type ||
    !direction ||
    !quantityRaw ||
    !["call", "put", "forward", "stock", "cash"].includes(type) ||
    !["long", "short"].includes(direction)
  ) {
    return null;
  }

  const quantity = Number(quantityRaw);
  if (!Number.isFinite(quantity) || quantity <= 0) return null;

  const common = {
    id: createLegId(index),
    type: type as StrategyLeg["type"],
    direction: direction as StrategyLeg["direction"],
    quantity,
  } satisfies Pick<StrategyLeg, "id" | "type" | "direction" | "quantity">;

  if (type === "call" || type === "put") {
    const strike = toFiniteNumber(parts[3]);
    if (strike === null) return null;

    return {
      ...common,
      type,
      strike,
      premium: toFiniteNumber(parts[4]) ?? 0,
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

type UrlState = {
  mode: ViewMode;
  showComponents: boolean;
  selectedPreset: PresetKey | null;
  legs: StrategyLeg[];
};

function readUrlState(searchParams: URLSearchParams): UrlState {
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
      legs: parsedLegs,
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
  };
}

function buildSearchParams(
  mode: ViewMode,
  showComponents: boolean,
  selectedPreset: PresetKey | null,
  legs: StrategyLeg[]
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
  }

  return nextParams;
}

export default function PayoffView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialState = useMemo(() => readUrlState(searchParams), [searchParams]);

  const [legs, setLegs] = useState<StrategyLeg[]>(initialState.legs);
  const [mode, setMode] = useState<ViewMode>(initialState.mode);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [chartOpen, setChartOpen] = useState(true);
  const [showComponents, setShowComponents] = useState(initialState.showComponents);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey | null>(
    initialState.selectedPreset
  );

  const paramsString = searchParams.toString();

  useEffect(() => {
    const nextState = readUrlState(searchParams);
    const nextSerializedLegs = serializeLegs(nextState.legs);

    setMode((prev) => (prev === nextState.mode ? prev : nextState.mode));
    setShowComponents((prev) =>
      prev === nextState.showComponents ? prev : nextState.showComponents
    );
    setSelectedPreset((prev) =>
      prev === nextState.selectedPreset ? prev : nextState.selectedPreset
    );
    setLegs((prev) =>
      serializeLegs(prev) === nextSerializedLegs ? prev : nextState.legs
    );
  }, [paramsString, searchParams]);

  useEffect(() => {
    const nextParams = buildSearchParams(mode, showComponents, selectedPreset, legs);
    const nextParamsString = nextParams.toString();

    if (nextParamsString !== paramsString) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [legs, mode, paramsString, selectedPreset, setSearchParams, showComponents]);

  const baseChartData = useMemo(
    () => buildChartData(legs, mode, 10, 200, 140, showComponents),
    [legs, mode, showComponents]
  );

  const syntheticDetected = useMemo(() => {
    const longForward = detectSyntheticLongForward(legs);
    const shortForward = detectSyntheticShortForward(legs);
    return longForward.detected || shortForward.detected;
  }, [legs]);

  const chartData = useMemo(
    () => addSyntheticOverlay(baseChartData, legs, mode),
    [baseChartData, legs, mode]
  );

  const strikes = useMemo(() => collectRelevantStrikes(legs), [legs]);

  return (
    <div className="view-layout">
      <div className="view-controls">
        <PayoffBuilder
          legs={legs}
          mode={mode}
          controlsOpen={controlsOpen}
          selectedPreset={selectedPreset}
          showComponents={showComponents}
          onToggleControls={() => setControlsOpen((prev) => !prev)}
          onModeChange={setMode}
          onPresetChange={setSelectedPreset}
          onShowComponentsChange={setShowComponents}
          onChange={setLegs}
        />
      </div>

      <div className="view-main">
        <PayoffSummary legs={legs} mode={mode} />
        <PayoffChart
          chartData={chartData}
          strikes={strikes}
          showComponents={showComponents}
          syntheticDetected={syntheticDetected}
          chartOpen={chartOpen}
          onToggleChart={() => setChartOpen((prev) => !prev)}
        />
        <PayoffExplanation />
      </div>
    </div>
  );
}
