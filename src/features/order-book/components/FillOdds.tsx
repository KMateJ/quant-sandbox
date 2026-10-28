import { LineChart } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { FlowSpec, Side } from "../../../lib/market/market.types";
import { fmtShares } from "../orderBook.math";
import { expectedWait, fillOdds } from "../queue.math";

/// Horizon of the fill-chance estimate, in seconds.
export const ODDS_HORIZON = 10;

type Props = { ahead: number; side: Side; spec: FlowSpec };

/// Estimated chance to fill within the horizon against shares ahead, with your position marked.
export default function FillOdds({ ahead, side, spec }: Props) {
  const { t } = useI18n();
  const top = Math.max(1500, ahead * 3);
  const data = Array.from({ length: 31 }, (_, i) => {
    const a = (top * i) / 30;
    return { ahead: a, p: fillOdds(a, spec, ODDS_HORIZON, side) * 100 };
  });
  const p = fillOdds(ahead, spec, ODDS_HORIZON, side);
  return (
    <div className="obk-odds">
      <p className="obk-odds-line">
        {t("obkOddsLine", { ahead: ahead.toLocaleString("en-US"), pct: Math.round(p * 100), s: ODDS_HORIZON, wait: Math.round(expectedWait(ahead, spec, side)) })}
      </p>
      <div className="chart-wrap obk-odds-chart">
        <LineChart
          data={data}
          xKey="ahead"
          series={[{ key: "p", label: t("obkOddsSeries", { s: ODDS_HORIZON }), color: "var(--primary)", strokeWidth: 2 }]}
          referenceLines={[{ axis: "x", value: ahead, dash: "4 3", color: "var(--muted)" }]}
          yDomain={[0, 100]}
          legend={false}
          xFormat={fmtShares}
          yFormat={(v) => `${v.toFixed(0)}%`}
          valueFormat={(v) => `${v.toFixed(0)}%`}
          tooltipLabel={(v) => t("obkAheadTip", { n: Math.round(v).toLocaleString("en-US") })}
        />
      </div>
      <p className="obk-hint">{t("obkOddsNote")}</p>
    </div>
  );
}
