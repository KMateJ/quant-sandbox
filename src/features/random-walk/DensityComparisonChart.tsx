import type { ReactNode } from "react";
import { LineChart, SERIES_ROLE } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { PinButton } from "../../components/ui";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import type { DensityPoint } from "../../lib/stochastic/rescaledWalk.types";
import { usePinnedCurves } from "../../components/lesson/usePinnedCurves";

type Props = {
  data: DensityPoint[];
  title: string;
  actions?: ReactNode;
  caption?: string;
  /// Offers Pin & compare; the pinned histogram is labelled with this text (e.g. the current step law and n).
  pinLabel?: string;
};

/// Empirical density of a standardised sample against the standard-normal density.
export default function DensityComparisonChart({ data, title, actions, caption, pinLabel }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const empirical: ChartSeries = {
    key: "empirical",
    label: t("stochEmpiricalDensity"),
    color: SERIES_ROLE.empirical,
    strokeWidth: 1.5,
    area: true,
    areaColor: SERIES_ROLE.empirical,
  };
  const normal: ChartSeries = {
    key: "normal",
    label: t("stochNormalDensity"),
    color: SERIES_ROLE.candidate,
    strokeWidth: 2,
    dash: "6 4",
  };
  const pin = usePinnedCurves(data, [empirical], [normal], pinLabel);
  const pinControl = pinLabel !== undefined && <PinButton pinned={pin.pinned} onPin={pin.pin} onClear={pin.clear} />;

  return (
    <ChartContainer
      className="stoch-distribution-frame"
      title={title}
      actions={(actions || pinControl) && <span className="stoch-chart-actions">{actions}{pinControl}</span>}
    >
      <div className="stoch-density-chart">
        <LineChart
          data={pin.data}
          xKey="x"
          series={pin.series}
          xDomain={[-4, 4]}
          isMobile={isMobile}
          tooltipLabel={(x) => `x = ${x.toFixed(2)}`}
          valueFormat={(value) => value.toFixed(3)}
        />
      </div>
      {caption && <p className="stoch-chart-caption">{caption}</p>}
    </ChartContainer>
  );
}
