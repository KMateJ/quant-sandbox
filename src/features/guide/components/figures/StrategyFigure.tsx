import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import { useI18n, type TranslationKey } from "../../../../i18n";
import { getPresetStrategy } from "../../../payoff-lab/payoff.presets";
import { STRATEGY_FIGURE_PRESETS, strategyRows, type StrategyFigurePreset } from "../../guide.figures.math";
import GuideFigure from "../GuideFigure";

const PRESET_LABEL: Record<StrategyFigurePreset, TranslationKey> = {
  "bull-call-spread": "gfBullCallSpread",
  "bear-put-spread": "gfBearPutSpread",
  "long-straddle": "gfStraddle",
  "long-strangle": "gfStrangle",
  "long-call-butterfly": "gfButterfly",
  "synthetic-long-forward": "gfSyntheticForward",
};

/// Common option strategies: each leg's payoff (thin) and their sum (thick) at maturity.
export default function StrategyFigure() {
  const { t } = useI18n();
  const [preset, setPreset] = useState<StrategyFigurePreset>("bull-call-spread");
  const legs = useMemo(() => getPresetStrategy(preset), [preset]);
  const data = useMemo(() => strategyRows(legs), [legs]);
  const legLabel = (i: number) => {
    const leg = legs[i];
    const qty = leg.quantity > 1 ? `${leg.quantity}× ` : "";
    return `${qty}${t(leg.direction === "long" ? "gfLong" : "gfShort")} ${t(leg.type === "put" ? "guidePut" : "guideCall")} ${leg.strike}`;
  };

  return (
    <GuideFigure title={t("gfStrategyTitle")} labId="payoff">
      <div className="gf-toolbar">
        <label className="gf-select">
          <span>{t("gfFieldStrategy")}</span>
          <select value={preset} onChange={(e) => setPreset(e.target.value as StrategyFigurePreset)}>
            {STRATEGY_FIGURE_PRESETS.map((key) => (
              <option key={key} value={key}>{t(PRESET_LABEL[key])}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfStrategyAria", { name: t(PRESET_LABEL[preset]) })}>
        <LineChart
          data={data}
          xKey="S"
          series={[
            ...legs.map((_, i) => ({ key: `leg${i}`, label: legLabel(i), color: SERIES_PALETTE[i + 1], strokeWidth: 1.25, dash: "5 3" })),
            { key: "total", label: t("gfTotalPayoff"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
          ]}
          referenceLines={[{ axis: "y", value: 0, color: "var(--border)" }]}
          curve="linear"
          tooltipLabel={(x) => `S_T = ${x.toFixed(0)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
    </GuideFigure>
  );
}
