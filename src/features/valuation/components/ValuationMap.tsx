import { useCallback } from "react";
import { HeatmapPicker } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { VALUE_MAP_GROWTH, VALUE_MAP_WACC, mapValue } from "../valuation.math";

type Props = {
  fcf1: number;
  growth: number;
  years: number;
  wacc: number;
  terminalGrowth: number;
  onPick: (wacc: number, terminalGrowth: number) => void;
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Enterprise value over a WACC × g∞ grid; picking a cell sets both inputs.
export default function ValuationMap({ fcf1, growth, years, wacc, terminalGrowth, onPick }: Props) {
  const { t } = useI18n();
  const value = useCallback((w: number, g: number) => mapValue(fcf1, growth, years, w, g), [fcf1, growth, years]);

  return (
    <>
      <HeatmapPicker
        xValues={VALUE_MAP_WACC}
        yValues={VALUE_MAP_GROWTH}
        value={value}
        selected={{ x: wacc, y: terminalGrowth }}
        onPick={onPick}
        scale="sequential"
        isValid={(w, g) => g < w}
        colorTransform={Math.log}
        xLabel={t("valuationWaccLabel")}
        yLabel={t("valuationTerminalGrowthLabel")}
        xFormat={(v) => `${(v * 100).toFixed(0)}%`}
        yFormat={pct}
        valueFormat={(v) => v.toFixed(0)}
        ariaLabel={t("valuationMapAria")}
        height={300}
      />
      <p className="npv-chart-hint">{t("valuationMapHint")}</p>
    </>
  );
}
