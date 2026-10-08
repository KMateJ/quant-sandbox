import { ChartContainer } from "../../../components/layout";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { LineChart, type ChartSeries } from "../../../components/charts";
import { Tabs, type TabItem } from "../../../components/ui";
import type { HestonVolSurfaceData, SmilePoint } from "../heston.types";
import { useI18n } from "../../../i18n";
import { IntuitionTrigger } from "../../../components/intuition";
import HestonVolSurface from "./HestonVolSurface";

type ViewMode = "2d" | "3d";

type Props = {
  data: SmilePoint[];
  strikeRatio: number;
  vol3d: boolean;
  setVol3d: (value: boolean) => void;
  surface: HestonVolSurfaceData | null;
};

const series: ChartSeries[] = [
  { key: "bsIv", label: "BS implied vol", color: "#3b82f6" },
  { key: "hestonIv", label: "Heston implied vol", color: "#f59e0b" },
];

export default function HestonSmileChart({ data, strikeRatio, vol3d, setVol3d, surface }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const minIv =
    data.length > 0 ? Math.min(...data.map((d) => Math.min(d.bsIv, d.hestonIv))) : 0;
  const maxIv =
    data.length > 0 ? Math.max(...data.map((d) => Math.max(d.bsIv, d.hestonIv))) : 1;

  const yMin = Number(Math.max(0, minIv - 0.03).toFixed(4));
  const yMax = Number((maxIv + 0.03).toFixed(4));

  const viewTabs: TabItem<ViewMode>[] = [
    { id: "2d", label: t("hestonView2d") },
    { id: "3d", label: t("hestonView3d") },
  ];

  return (
    <ChartContainer
      title={t("hestonSmileTitle")}
      actions={
        <span className="chart-actions">
          <Tabs<ViewMode>
            segmented
            items={viewTabs}
            value={vol3d ? "3d" : "2d"}
            onChange={(id) => setVol3d(id === "3d")}
            ariaLabel={t("hestonView3d")}
          />
          <IntuitionTrigger sectionId="smile" />
        </span>
      }
    >
      {vol3d ? (
        <HestonVolSurface surface={surface} />
      ) : (
        <div className="chart-wrap">
          <LineChart
            data={data}
            xKey="moneyness"
            series={series}
            yDomain={[yMin, yMax]}
            referenceLines={[{ axis: "x", value: strikeRatio, color: "#94a3b8", dash: "4 4" }]}
            isMobile={isMobile}
            legend={false}
            tooltipLabel={(x) => `K / S₀ = ${x}`}
            valueFormat={(v) => v.toFixed(4)}
          />
        </div>
      )}
    </ChartContainer>
  );
}
