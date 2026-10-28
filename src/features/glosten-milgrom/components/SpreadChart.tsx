import { ScatterChart } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { GmStep } from "../glostenMilgrom.types";
import { fmt3, fmtIndex } from "./gmChart";

/// Bayes spread (ask − bid) before each trade, with a "first → last" label.
export default function SpreadChart({ path }: { path: readonly GmStep[] }) {
  const { t } = useI18n();
  const pts = path.map((s, i) => ({ x: i + 1, y: s.ask - s.bid }));
  const first = pts[0]?.y ?? 0;
  const last = pts[pts.length - 1]?.y ?? 0;
  return (
    <div className="glm-spread">
      <p className="glm-caption">{t("glmSpreadLabel", { from: fmt3(first), to: fmt3(last) })}</p>
      <div className="chart-wrap glm-small-chart">
        <ScatterChart
          series={[{ key: "spread", label: t("glmSpread"), color: "var(--primary)", line: true, strokeWidth: 2, points: pts }]}
          xDomain={[1, Math.max(2, pts.length)]}
          yDomain={[0, Math.max(0.01, ...pts.map((p) => p.y)) * 1.1]}
          yFormat={(v) => v.toFixed(2)}
          xFormat={fmtIndex}
          xLabel={t("glmTradeAxis")}
          legend={false}
        />
      </div>
    </div>
  );
}
