import { useMemo, useRef, useState } from "react";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { makeRng } from "../../../../../lib/math/random";
import { endpointHistogram, walkEndpoint } from "../../../guide.interactive2.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";
import GaltonHistogramSvg from "./GaltonHistogramSvg";
import { prefersReducedMotion, useTicker } from "./useTicker";

const STEPS = [10, 20, 40] as const;
const MAX_WALKERS = 5000;
const INITIAL = 500;

// A deterministic first batch, so the figure (and its pre-rendered HTML) opens with a visible histogram.
const firstBatch = (n: number) => {
  const rng = makeRng(5);
  return Array.from({ length: INITIAL }, () => walkEndpoint(rng, n));
};

/// Walkers take ±1 steps and land in an endpoint histogram; the bell curve N(0, n) appears as they pile up.
export default function GaltonWalkFigure() {
  const { t } = useI18n();
  const [n, setN] = useState<number>(20);
  const [endpoints, setEndpoints] = useState<number[]>(() => firstBatch(20));
  const [running, setRunning] = useState(false);
  const rng = useRef(makeRng(11));
  const add = (count: number) => {
    const more = Array.from({ length: count }, () => walkEndpoint(rng.current, n));
    setEndpoints((prev) => [...prev, ...more].slice(0, MAX_WALKERS));
  };
  const reset = (steps = n) => {
    setRunning(false);
    rng.current = makeRng(11);
    setN(steps);
    setEndpoints(firstBatch(steps));
  };
  useTicker(running, 60, () => {
    if (endpoints.length >= MAX_WALKERS) return false;
    add(25);
  }, () => setRunning(false));

  const bins = useMemo(() => endpointHistogram(endpoints, n), [endpoints, n]);
  const mean = endpoints.reduce((a, b) => a + b, 0) / Math.max(endpoints.length, 1);
  const variance = endpoints.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(endpoints.length - 1, 1);

  return (
    <GuideFigure title={t("gi2GaltonTitle")} labId="brownian-motion">
      <div className="gf-toolbar">
        <SegmentedControl<number> ariaLabel={t("gfFieldSteps")} value={n} onChange={(v) => reset(v)} options={STEPS.map((v) => ({ value: v, label: `n = ${v}` }))} />
        {!prefersReducedMotion() && (
          <button type="button" className="preset-btn" onClick={() => setRunning((r) => !r)}>{t(running ? "gi2Pause" : "gi2Play")}</button>
        )}
        <button type="button" className="preset-btn" onClick={() => add(1)}>+1</button>
        <button type="button" className="preset-btn" onClick={() => add(500)}>+500</button>
        <button type="button" className="preset-btn" onClick={() => reset()}>{t("gi2Reset")}</button>
      </div>
      <GaltonHistogramSvg bins={bins} label={t("gi2GaltonAria", { count: endpoints.length, n })} />
      <FigureReadout
        items={[
          { label: t("gi2Walkers"), value: String(endpoints.length) },
          { label: t("gi2SampleMean"), value: endpoints.length ? fmt(mean, 2) : "–" },
          { label: t("gi2SampleVariance"), value: endpoints.length > 1 ? `${fmt(variance, 2)} (n = ${n})` : "–", tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
