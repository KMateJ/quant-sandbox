import { useI18n } from "../../../../../i18n";
import { blackScholesCall, normalCdf } from "../../../../black-scholes/blackScholes.math";
import { MC_SETUP, estimateTrail, mcStats } from "../../../guide.interactive.mcHistogram.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import McHistogramChart from "./McHistogramChart";
import { useMcHistogramSim } from "./McHistogramSim";
import { formatCount } from "./McHistogramFormat";
import McHistogramStrip from "./McHistogramStrip";

const { S0, K, r, sigma, T } = MC_SETUP;
const BS = blackScholesCall(S0, K, T, r, sigma);
const D2 = (Math.log(S0 / K) + (r - 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
const ADD_STEPS = [1, 100, 1000];

/// Live Monte Carlo: draws of S_T fill a histogram while the running call estimate closes in on Black–Scholes.
export default function McHistogramFigure() {
  const { t } = useI18n();
  const { state, playing, setPlaying, add, reset } = useMcHistogramSim();
  const stats = mcStats(state, MC_SETUP);
  const trail = estimateTrail(state, MC_SETUP);

  return (
    <GuideFigure title={t("ixMcTitle")} labId="monte-carlo">
      <div className="gf-toolbar ixmc-controls" role="group" aria-label={t("ixMcControlsAria")}>
        <button type="button" className="preset-btn preset-btn--active ixmc-play" aria-pressed={playing} onClick={() => setPlaying(!playing)}>
          {playing ? t("ixMcPause") : t("ixMcPlay")}
        </button>
        {ADD_STEPS.map((k) => (
          <button key={k} type="button" className="preset-btn" onClick={() => add(k)}>+{k}</button>
        ))}
        <button type="button" className="preset-btn" onClick={reset} disabled={state.n === 0}>{t("ixMcReset")}</button>
        <span className="ixmc-last" aria-live="polite">
          {state.n === 0 ? t("ixMcEmpty") : Number.isFinite(state.lastPrice) && t("ixMcLast", { s: fmt(state.lastPrice, 2) })}
        </span>
      </div>
      <div className="gf-chart ixmc-hist" role="img" aria-label={t("ixMcHistAria")}>
        <McHistogramChart state={state} />
      </div>
      <div className="ixmc-strip-head">
        <span className="ixmc-key ixmc-key--estimate">{t("ixMcEstimateLabel")}</span>
        <span className="ixmc-key ixmc-key--bs">{t("ixMcBsLabel", { v: fmt(BS, 2) })}</span>
      </div>
      <div className="ixmc-strip" role="img" aria-label={t("ixMcStripAria")}>
        <McHistogramStrip trail={trail} bs={BS} />
      </div>
      <FigureReadout
        items={[
          { label: t("ixMcDraws"), value: formatCount(state.n) },
          { label: t("ixMcEstimate"), value: fmt(stats.estimate, 3), tone: "strong" },
          { label: t("ixMcSe"), value: fmt(stats.se, 3) },
          { label: `${t("ixMcItm")} (${t("ixMcItmHint", { v: fmt(normalCdf(D2), 3) })})`, value: Number.isFinite(stats.itmShare) ? pct(stats.itmShare, 1) : "–", tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
