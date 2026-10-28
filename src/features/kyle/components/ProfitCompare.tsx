import { ScatterChart } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import { biggestMistake } from "../kyle.math";
import type { AuctionRow } from "../kyle.types";
import type { KyleLab } from "../useKyleLab";
import { fmtIndex, fmtMoney } from "./kyleFormat";

const cumulative = (vals: number[]) => {
  let acc = 0;
  return [0, ...vals.map((v) => (acc += v))].map((y, x) => ({ x, y }));
};

/// Cumulative profit by auction, you vs the optimal insider vs noise traders, plus your biggest gap-closing mistake.
export default function ProfitCompare({ lab }: { lab: KyleLab }) {
  const { t } = useI18n();
  const { shown, optimal, draw, params } = lab;
  const k = shown.length;
  const noise = (rows: AuctionRow[]) => rows.map((r) => (draw.v - r.pAfter) * r.u);
  const worst = biggestMistake(shown, draw.v, lab.lambda, params.n);
  return (
    <ChartContainer title={t("kylProfitTitle")}>
      <div className="chart-wrap kyl-profit-chart">
        <ScatterChart
          series={[
            { key: "you", label: t("kylYou"), color: "var(--primary)", line: true, strokeWidth: 2.4, legend: true, points: cumulative(shown.map((r) => r.profit)) },
            { key: "opt", label: t("kylOptimal"), color: "var(--muted)", line: true, dash: "4 4", strokeWidth: 1.8, legend: true, points: cumulative(optimal.slice(0, k).map((r) => r.profit)) },
            { key: "noise", label: t("kylNoiseTraders"), color: "var(--negative)", line: true, strokeWidth: 1.6, legend: true, points: cumulative(noise(shown)) },
          ]}
          xDomain={[0, params.n]}
          xFormat={fmtIndex}
          yFormat={(v) => fmtMoney(v)}
          xLabel={t("kylAuctionAxis")}
        />
      </div>
      {worst && k > 0 && (
        <p className="kyl-caption">
          {t("kylWorst", { n: worst.n, you: Math.round(worst.you * 100), opt: Math.round(worst.opt * 100) })}
        </p>
      )}
    </ChartContainer>
  );
}
