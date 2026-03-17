import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BinomialControls from "./components/BinomialControls";
import BinomialSummary from "./components/BinomialSummary";
import { buildBinomialTree } from "./binomial.math";
import type { OptionKind } from "./binomial.types";
import BinomialTreeChart from "./components/BinomealTreeCharts";
import BinomialExplanation from "./components/BinomealExplanation";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function parseNumber(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
  decimals?: number
) {
  if (value == null || value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const clamped = clamp(parsed, min, max);
  if (decimals == null) return clamped;
  return Number(clamped.toFixed(decimals));
}

function parseOptionKind(value: string | null): OptionKind {
  return value === "put" ? "put" : "call";
}

function parseBooleanFlag(value: string | null, fallback: boolean) {
  if (value == null) return fallback;
  return value === "1";
}

function formatNumber(value: number, decimals?: number) {
  if (decimals == null) return String(value);
  return String(Number(value.toFixed(decimals)));
}

export default function BinomialView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryString = searchParams.toString();

  const [S0, setS0] = useState(() => parseNumber(searchParams.get("s0"), 100, 20, 200));
  const [K, setK] = useState(() => parseNumber(searchParams.get("k"), 100, 20, 200));
  const [u, setU] = useState(() => parseNumber(searchParams.get("u"), 1.2, 1.01, 2, 2));
  const [d, setD] = useState(() => parseNumber(searchParams.get("d"), 0.85, 0.1, 0.99, 2));
  const [r, setR] = useState(() => parseNumber(searchParams.get("r"), 0.05, 0, 0.3, 2));
  const [steps, setSteps] = useState(() => parseNumber(searchParams.get("steps"), 4, 1, 8));
  const [optionKind, setOptionKind] = useState<OptionKind>(() =>
    parseOptionKind(searchParams.get("type"))
  );
  const [controlsOpen, setControlsOpen] = useState(true);
  const [showStockPrices, setShowStockPrices] = useState(() =>
    parseBooleanFlag(searchParams.get("stocks"), true)
  );
  const [showOptionValues, setShowOptionValues] = useState(() =>
    parseBooleanFlag(searchParams.get("values"), true)
  );
  const [treeOpen, setTreeOpen] = useState(true);

  useEffect(() => {
    setS0(parseNumber(searchParams.get("s0"), 100, 20, 200));
    setK(parseNumber(searchParams.get("k"), 100, 20, 200));
    setU(parseNumber(searchParams.get("u"), 1.2, 1.01, 2, 2));
    setD(parseNumber(searchParams.get("d"), 0.85, 0.1, 0.99, 2));
    setR(parseNumber(searchParams.get("r"), 0.05, 0, 0.3, 2));
    setSteps(parseNumber(searchParams.get("steps"), 4, 1, 8));
    setOptionKind(parseOptionKind(searchParams.get("type")));
    setShowStockPrices(parseBooleanFlag(searchParams.get("stocks"), true));
    setShowOptionValues(parseBooleanFlag(searchParams.get("values"), true));
  }, [queryString, searchParams]);

  useEffect(() => {
    const next = new URLSearchParams();
    next.set("s0", formatNumber(S0));
    next.set("k", formatNumber(K));
    next.set("u", formatNumber(u, 2));
    next.set("d", formatNumber(d, 2));
    next.set("r", formatNumber(r, 2));
    next.set("steps", formatNumber(steps));
    next.set("type", optionKind);
    if (!showStockPrices) next.set("stocks", "0");
    if (!showOptionValues) next.set("values", "0");

    const nextString = next.toString();
    if (nextString !== queryString) {
      setSearchParams(next, { replace: true });
    }
  }, [S0, K, u, d, r, steps, optionKind, showStockPrices, showOptionValues, queryString, setSearchParams]);

  const tree = useMemo(
    () =>
      buildBinomialTree({
        S0,
        K,
        u,
        d,
        r,
        steps,
        optionKind,
      }),
    [S0, K, u, d, r, steps, optionKind]
  );

  return (
    <div className="view-layout">
      <div className="view-controls">
        <BinomialControls
          S0={S0}
          K={K}
          u={u}
          d={d}
          r={r}
          steps={steps}
          optionKind={optionKind}
          controlsOpen={controlsOpen}
          onToggleControls={() => setControlsOpen((prev) => !prev)}
          onS0Change={setS0}
          onKChange={setK}
          onUChange={setU}
          onDChange={setD}
          onRChange={setR}
          onStepsChange={setSteps}
          onOptionKindChange={setOptionKind}
        />

        <div className="card" style={{ marginTop: 20 }}>
          <div className="metric-switch">
            <button
              type="button"
              className={showStockPrices ? "metric-button active" : "metric-button"}
              onClick={() => setShowStockPrices((prev) => !prev)}
            >
              Részvényárak
            </button>
            <button
              type="button"
              className={showOptionValues ? "metric-button active" : "metric-button"}
              onClick={() => setShowOptionValues((prev) => !prev)}
            >
              Opcióértékek
            </button>
          </div>
        </div>
      </div>

      <div className="view-main">
        <BinomialSummary tree={tree} />
        <BinomialTreeChart
          tree={tree}
          showStockPrices={showStockPrices}
          showOptionValues={showOptionValues}
          treeOpen={treeOpen}
          onToggleTree={() => setTreeOpen((prev) => !prev)}
        />
        <BinomialExplanation />
      </div>
    </div>
  );
}
