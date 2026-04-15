import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BinomialControls from "./components/BinomialControls";
import BinomialSummary from "./components/BinomialSummary";
import { buildBinomialTree, buildRateTree } from "./binomial.math";
import type { OptionKind, TreeMode } from "./binomial.types";
import BinomialTreeChart from "./components/BinomealTreeCharts";
import BinomialExplanation from "./components/BinomealExplanation";
import { useI18n } from "../../i18n";

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

function parseTreeMode(value: string | null): TreeMode {
  return value === "rates" ? "rates" : "equity";
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
  const { language, t } = useI18n();

  const [mode, setMode] = useState<TreeMode>(() => parseTreeMode(searchParams.get("mode")));
  const [S0, setS0] = useState(() => parseNumber(searchParams.get("s0"), 100, 20, 200));
  const [K, setK] = useState(() => parseNumber(searchParams.get("k"), 100, 20, 200));
  const [u, setU] = useState(() => parseNumber(searchParams.get("u"), 1.2, 1.01, 2, 2));
  const [d, setD] = useState(() => parseNumber(searchParams.get("d"), 0.85, 0.1, 0.99, 2));
  const [r, setR] = useState(() => parseNumber(searchParams.get("r"), 0.05, 0, 0.3, 2));
  const [q, setQ] = useState(() => parseNumber(searchParams.get("q"), 0.5, 0, 1, 2));
  const [h, setH] = useState(() => parseNumber(searchParams.get("h"), 0.18, 0.02, 0.7, 2));
  const [steps, setSteps] = useState(() => parseNumber(searchParams.get("steps"), 4, 1, 8));
  const [optionKind, setOptionKind] = useState<OptionKind>(() => parseOptionKind(searchParams.get("type")));
  const [controlsOpen, setControlsOpen] = useState(true);
  const [showPrimaryMetric, setShowPrimaryMetric] = useState(() =>
    parseBooleanFlag(searchParams.get("primary"), true)
  );
  const [showSecondaryMetric, setShowSecondaryMetric] = useState(() =>
    parseBooleanFlag(searchParams.get("secondary"), true)
  );
  const [treeOpen, setTreeOpen] = useState(true);

  useEffect(() => {
    setMode(parseTreeMode(searchParams.get("mode")));
    setS0(parseNumber(searchParams.get("s0"), 100, 20, 200));
    setK(parseNumber(searchParams.get("k"), 100, 20, 200));
    setU(parseNumber(searchParams.get("u"), 1.2, 1.01, 2, 2));
    setD(parseNumber(searchParams.get("d"), 0.85, 0.1, 0.99, 2));
    setR(parseNumber(searchParams.get("r"), 0.05, 0, 0.3, 2));
    setQ(parseNumber(searchParams.get("q"), 0.5, 0, 1, 2));
    setH(parseNumber(searchParams.get("h"), 0.18, 0.02, 0.7, 2));
    setSteps(parseNumber(searchParams.get("steps"), 4, 1, 8));
    setOptionKind(parseOptionKind(searchParams.get("type")));
    setShowPrimaryMetric(parseBooleanFlag(searchParams.get("primary"), true));
    setShowSecondaryMetric(parseBooleanFlag(searchParams.get("secondary"), true));
  }, [queryString, searchParams]);

  useEffect(() => {
    const next = new URLSearchParams();
    next.set("mode", mode);
    next.set("s0", formatNumber(S0));
    next.set("k", formatNumber(K));
    next.set("u", formatNumber(u, 2));
    next.set("d", formatNumber(d, 2));
    next.set("r", formatNumber(r, 2));
    next.set("q", formatNumber(q, 2));
    next.set("h", formatNumber(h, 2));
    next.set("steps", formatNumber(steps));
    next.set("type", optionKind);
    if (!showPrimaryMetric) next.set("primary", "0");
    if (!showSecondaryMetric) next.set("secondary", "0");

    const nextString = next.toString();
    if (nextString !== queryString) {
      setSearchParams(next, { replace: true });
    }
  }, [
    mode,
    S0,
    K,
    u,
    d,
    r,
    q,
    h,
    steps,
    optionKind,
    showPrimaryMetric,
    showSecondaryMetric,
    queryString,
    setSearchParams,
  ]);

  const tree = useMemo(() => {
    if (mode === "rates") {
      return buildRateTree({
        r0: r,
        h,
        q,
        steps,
      });
    }

    return buildBinomialTree({
      S0,
      K,
      u,
      d,
      r,
      steps,
      optionKind,
    });
  }, [mode, S0, K, u, d, r, q, h, steps, optionKind]);

  const primaryToggleLabel =
    mode === "rates"
      ? language === "hu"
        ? "Kamatok"
        : "Rates"
      : t("binomialToggleStocks");

  const secondaryToggleLabel =
    mode === "rates"
      ? language === "hu"
        ? "Kötvényértékek"
        : "Bond values"
      : t("binomialToggleValues");

  return (
    <div className="view-layout">
      <div className="view-controls">
        <BinomialControls
          mode={mode}
          S0={S0}
          K={K}
          u={u}
          d={d}
          r={r}
          q={q}
          h={h}
          steps={steps}
          optionKind={optionKind}
          controlsOpen={controlsOpen}
          onToggleControls={() => setControlsOpen((prev) => !prev)}
          onModeChange={setMode}
          onS0Change={setS0}
          onKChange={setK}
          onUChange={setU}
          onDChange={setD}
          onRChange={setR}
          onQChange={setQ}
          onHChange={setH}
          onStepsChange={setSteps}
          onOptionKindChange={setOptionKind}
        />

        <div className="card" style={{ marginTop: 20 }}>
          <div className="metric-switch">
            <button
              type="button"
              className={showPrimaryMetric ? "metric-button active" : "metric-button"}
              onClick={() => setShowPrimaryMetric((prev) => !prev)}
            >
              {primaryToggleLabel}
            </button>
            <button
              type="button"
              className={showSecondaryMetric ? "metric-button active" : "metric-button"}
              onClick={() => setShowSecondaryMetric((prev) => !prev)}
            >
              {secondaryToggleLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="view-main">
        <BinomialSummary tree={tree} />
        <BinomialTreeChart
          tree={tree}
          showPrimaryMetric={showPrimaryMetric}
          showSecondaryMetric={showSecondaryMetric}
          treeOpen={treeOpen}
          onToggleTree={() => setTreeOpen((prev) => !prev)}
        />
        <BinomialExplanation mode={mode} />
      </div>
    </div>
  );
}
