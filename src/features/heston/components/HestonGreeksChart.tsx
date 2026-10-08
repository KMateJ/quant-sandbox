import { useMemo, useState } from "react";
import { ChartContainer } from "../../../components/layout";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { LineChart, type ChartSeries } from "../../../components/charts";
import { Tabs, type TabItem } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { GreekKey, HestonGreekProfilePoint, HestonGreeksSurfaceData } from "../heston.types";
import { IntuitionTrigger } from "../../../components/intuition";
import { HESTON_GREEKS } from "../heston.greeks";
import HestonGreeksSurface from "./HestonGreeksSurface";

type ViewMode = "2d" | "3d";

type Props = {
  data: HestonGreekProfilePoint[];
  strike: number;
  greeks3d: boolean;
  setGreeks3d: (value: boolean) => void;
  surface: HestonGreeksSurfaceData | null;
};

export default function HestonGreeksChart({ data, strike, greeks3d, setGreeks3d, surface }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [metric, setMetric] = useState<GreekKey>("delta");
  const [showBs, setShowBs] = useState(true);
  const [showHeston, setShowHeston] = useState(true);

  const bsKey = `${metric}_bs`;
  const hestonKey = `${metric}_heston`;

  const series = useMemo<ChartSeries[]>(() => {
    const list: ChartSeries[] = [];
    if (showBs)
      list.push({ key: bsKey, label: "Black–Scholes", color: "#3b82f6", strokeWidth: 2 });
    if (showHeston)
      list.push({ key: hestonKey, label: "Heston (MC)", color: "#f59e0b", strokeWidth: 2 });
    return list;
  }, [showBs, showHeston, bsKey, hestonKey]);

  const metricTabs: TabItem[] = HESTON_GREEKS.map((m) => ({ id: m.key, label: t(m.labelKey) }));
  const viewTabs: TabItem<ViewMode>[] = [
    { id: "2d", label: t("hestonView2d") },
    { id: "3d", label: t("hestonView3d") },
  ];

  return (
    <ChartContainer
      title={t("hestonGreeksChartTitle")}
      actions={
        <span className="chart-actions">
          <Tabs<ViewMode>
            segmented
            items={viewTabs}
            value={greeks3d ? "3d" : "2d"}
            onChange={(id) => setGreeks3d(id === "3d")}
            ariaLabel={t("hestonView3d")}
          />
          <IntuitionTrigger sectionId={metric} />
        </span>
      }
    >
      <div className="chart-toolbar">
        <Tabs
          items={metricTabs}
          value={metric}
          onChange={(id) => setMetric(id as GreekKey)}
          ariaLabel={t("hestonGreeksChartTitle")}
        />
        {!greeks3d && (
          <div className="series-toggles">
            <button
              type="button"
              className={showBs ? "series-toggle active" : "series-toggle"}
              aria-pressed={showBs}
              onClick={() => setShowBs((v) => !v)}
            >
              <span className="series-toggle-dot" style={{ background: "#3b82f6" }} />
              Black–Scholes
            </button>
            <button
              type="button"
              className={showHeston ? "series-toggle active" : "series-toggle"}
              aria-pressed={showHeston}
              onClick={() => setShowHeston((v) => !v)}
            >
              <span className="series-toggle-dot" style={{ background: "#f59e0b" }} />
              Heston
            </button>
          </div>
        )}
      </div>

      {greeks3d ? (
        <HestonGreeksSurface surface={surface} metric={metric} />
      ) : (
        <div className="chart-wrap">
          <LineChart
            data={data}
            xKey="S"
            series={series}
            referenceLines={[{ axis: "x", value: strike, color: "#94a3b8", dash: "4 4" }]}
            isMobile={isMobile}
            legend={false}
            tooltipLabel={(x) => `S = ${x}`}
            valueFormat={(v) => v.toFixed(4)}
          />
        </div>
      )}
    </ChartContainer>
  );
}
