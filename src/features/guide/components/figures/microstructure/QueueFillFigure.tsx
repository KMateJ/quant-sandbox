import { useMemo, useState } from "react";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import {
  expectedWait, fillProbability, lambdaFromVolume, MEAN_SELL_SIZE, MY_SIZE, simulateMinute, type QueueFlow, type QueueState,
} from "../../../guide.micro.queuePosition.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { pct } from "../figureFormat";
import QueueFillBlocks from "./QueueFillBlocks";
import QueueFillCurve from "./QueueFillCurve";
import { useTweened } from "./useTweened";

const MAX_AHEAD = 2000;
const SEED = 4100;

/// The reader's limit order in a FIFO queue: how long it waits, and the chance it fills in the next minute.
export default function QueueFillFigure() {
  const { t } = useI18n();
  const [sellRate, setSellRate] = useState(300);
  const [cancelRate, setCancelRate] = useState(100);
  const [start, setStart] = useState(1260);
  const [state, setState] = useState<QueueState>({ ahead: 1260, filled: 0 });
  const [round, setRound] = useState(0);
  const flow = useMemo<QueueFlow>(() => ({ lambda: lambdaFromVolume(sellRate), meanSize: MEAN_SELL_SIZE, cancelRate }), [sellRate, cancelRate]);
  const shownAhead = useTweened(state.ahead);
  const shownFilled = useTweened(state.filled);
  const reset = (ahead: number) => {
    setStart(ahead);
    setState({ ahead, filled: 0 });
  };
  const simulate = () => {
    setState((s) => simulateMinute(s, flow, SEED + round));
    setRound((r) => r + 1);
  };
  const p = fillProbability({ ahead: state.ahead, horizon: 1, ...flow });
  const wait = expectedWait(state.ahead, sellRate, cancelRate);
  const perMinute = (v: number) => t("gfMsQfPerMinute", { v: v.toFixed(0) });
  const aria = t("gfMsQfBlocksAria", { ahead: state.ahead.toFixed(0), size: MY_SIZE, filled: state.filled.toFixed(0) });

  return (
    <GuideFigure title={t("gfMsQueueFillTitle")} labId="order-book">
      <div className="gf-sliders">
        <SliderField label={t("gfMsQfSellRate")} min={0} max={1000} step={50} value={sellRate} onChange={setSellRate} formatValue={perMinute} />
        <SliderField label={t("gfMsQfCancelRate")} min={0} max={400} step={20} value={cancelRate} onChange={setCancelRate} formatValue={perMinute} />
        <SliderField label={t("gfMsQfStart")} min={0} max={MAX_AHEAD} step={20} value={start} onChange={reset} formatValue={(v) => v.toFixed(0)} />
      </div>
      <QueueFillBlocks
        ahead={shownAhead} size={MY_SIZE} filled={shownFilled} maxAhead={MAX_AHEAD} ariaLabel={aria}
        front={t("gfMsQfFront")} back={t("gfMsQfBack")} you={t("gfMsQfYou")}
      />
      <div className="gf-toolbar">
        <button type="button" className="preset-btn" onClick={simulate}>{t("gfMsQfSimulate")}</button>
        <button type="button" className="preset-btn" onClick={() => reset(start)}>{t("gfMsQfReset")}</button>
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfMsQfCurveAria")}>
        <QueueFillCurve flow={flow} ahead={state.ahead} maxAhead={MAX_AHEAD} xLabel={t("gfMsQfAhead")} yLabel={t("gfMsQfFillProb")} />
      </div>
      <FigureReadout
        items={[
          { label: t("gfMsQfAhead"), value: state.ahead.toFixed(0) },
          { label: t("gfMsQfWait"), value: Number.isFinite(wait) ? t("gfMsQfMinutes", { v: wait.toFixed(2) }) : "–" },
          { label: t("gfMsQfFillProb"), value: pct(p, p < 0.001 ? 2 : 1), tone: "strong" },
          { label: t("gfMsQfFilled"), value: t("gfMsQfSharesOf", { v: state.filled.toFixed(0), size: MY_SIZE }), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
