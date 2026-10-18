import { useMemo } from "react";
import SectionCard from "../../../../components/SectionCard";
import { ScatterChart } from "../../../../components/charts";
import { useI18n } from "../../../../i18n";
import { payoffYDomain } from "../replication.math";
import { METHOD_LABEL_KEYS } from "../replication.labels";
import { legSeries, strikeLines, sumSeries, targetSeries } from "../replication.series";
import type { ReplicationModel } from "../useReplication";

/// Small multiples: each portfolio's legs stacked over the target, so the shared sum is visible.
export default function PortfolioCompare({ model }: { model: ReplicationModel }) {
  const { t } = useI18n();
  const { portfolios, pw, tradable, shape, xMax } = model;
  const yDomain = useMemo(() => payoffYDomain(pw, shape.nodes, xMax), [pw, shape.nodes, xMax]);

  return (
    <SectionCard title={t("replCompareTitle")} subtitle={t("replCompareSubtitle")}>
      <div className="repl-compare">
        {portfolios.map((p) => (
          <figure key={p.method} className="repl-compare-cell">
            <figcaption>
              <span>{t(METHOD_LABEL_KEYS[p.method])}</span>
              <span className="repl-compare-meta">
                {t("replCompareLegs", { n: p.legs.length })} · {p.total.toFixed(4)}
              </span>
            </figcaption>
            <div className="repl-compare-chart">
              <ScatterChart
                series={[
                  targetSeries(pw, xMax, t("replChartTarget"), true),
                  ...legSeries(p, xMax, t),
                  sumSeries(p, tradable, xMax, t("replChartSum")),
                ]}
                xDomain={[0, xMax]}
                yDomain={yDomain}
                referenceLines={strikeLines(p)}
                legend={false}
                isMobile
                xFormat={(v) => v.toFixed(0)}
                yFormat={(v) => v.toFixed(0)}
                yNumTicks={4}
              />
            </div>
          </figure>
        ))}
      </div>
    </SectionCard>
  );
}
