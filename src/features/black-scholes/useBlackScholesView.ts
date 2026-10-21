import { useMemo } from "react";
import { blackScholesCall, blackScholesPut, makeMaturities, evaluateMetric, buildMetricSurface, metricFrame, type MetricSurface } from "./blackScholes.math";
import type { MetricKey, OptionType } from "./blackScholes.types";
import { BLACK_SCHOLES_URL } from "./blackScholes.url";
import { type SliderDescriptor } from "../../components/SliderDock";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useUrlState } from "../../components/useUrlState";
import { type ChartSeries, SERIES_PALETTE } from "../../components/charts";
import { useI18n } from "../../i18n";

type ChartRow = {
  S: number;
  [key: string]: number;
};
function getMetricTitle(
  metric: MetricKey,
  optionType: OptionType,
  t: (key: string) => string
): string {
  const optionLabel =
    optionType === "call"
      ? t("blackScholesOptionCall")
      : t("blackScholesOptionPut");

  switch (metric) {
    case "price":
      return `${t("blackScholesTitlePrefix")} ${optionLabel} ${t("blackScholesMetricPriceAccusative")}`;
    case "delta":
      return `${t("blackScholesTitlePrefix")} ${optionLabel} Delta`;
    case "gamma":
      return `${t("blackScholesTitlePrefix")} ${optionLabel} Gamma`;
    case "vega":
      return `${t("blackScholesTitlePrefix")} ${optionLabel} Vega`;
    case "theta":
      return `${t("blackScholesTitlePrefix")} ${optionLabel} Theta`;
    case "rho":
      return `${t("blackScholesTitlePrefix")} ${optionLabel} Rho`;
    default:
      return `${t("blackScholesTitlePrefix")} ${optionLabel} ${t("blackScholesMetricPriceAccusative")}`;
  }
}
export function useBlackScholesView() {
  const { t, language } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [s, set] = useUrlState(BLACK_SCHOLES_URL);
  const { k: strike, r: rate, sigma: volatility, tmax: maxMaturity, curves: curveCount, metric, type: optionType } = s;
  const view3d = s.view === "3d";
  const setMetric = (v: MetricKey) => set({ metric: v });
  const setOptionType = (v: OptionType) => set({ type: v });
  const setView3d = (v: boolean) => set({ view: v ? "3d" : "2d" });

  const maturities = useMemo(
    () => makeMaturities(maxMaturity, curveCount),
    [maxMaturity, curveCount]
  );
  const chartData = useMemo<ChartRow[]>(() => {
    const sMin = 10;
    const sMax = 200;
    const pointCount = 140;

    const metricFn = (S: number, T: number) =>
      evaluateMetric(metric, optionType, S, strike, T, rate, volatility);

    return Array.from({ length: pointCount }, (_, i) => {
      const S = sMin + (i / (pointCount - 1)) * (sMax - sMin);
      const row: ChartRow = {
        S: Number(S.toFixed(2)),
      };

      for (const T of maturities) {
        row[`T=${T}`] = Number(metricFn(S, T).toFixed(6));
      }

      return row;
    });
  }, [maturities, strike, rate, volatility, metric, optionType]);

  const yDomain = useMemo(
    () => metricFrame(metric, optionType, chartData.flatMap((row) => maturities.map((T) => row[`T=${T}`]))),
    [chartData, maturities, metric, optionType]
  );
  const atmPrice = useMemo(() => {
    const value =
      optionType === "call"
        ? blackScholesCall(strike, strike, 1, rate, volatility)
        : blackScholesPut(strike, strike, 1, rate, volatility);

    return value.toFixed(3);
  }, [strike, rate, volatility, optionType]);

  const chartSeries = useMemo<ChartSeries[]>(
    () =>
      maturities.map((T, index) => ({
        key: `T=${T}`,
        label: `T=${T}`,
        color: SERIES_PALETTE[index % SERIES_PALETTE.length],
        strokeWidth: 2.5,
      })),
    [maturities]
  );

  const tooltipDigits = metric === "gamma" ? 5 : metric === "delta" ? 4 : 3;

  const metricLabel = useMemo(() => {
    if (metric === "price") return t("blackScholesMetricPrice");
    return metric.charAt(0).toUpperCase() + metric.slice(1);
  }, [metric, t]);

  const surface = useMemo<MetricSurface | null>(() => {
    if (!view3d) return null;
    return buildMetricSurface(
      metric,
      optionType,
      { sMin: 10, sMax: 200, nS: 48, tMin: 0.05, tMax: maxMaturity, nT: 40 },
      strike,
      rate,
      volatility
    );
  }, [view3d, metric, optionType, maxMaturity, strike, rate, volatility]);

  const sliders: SliderDescriptor[] = [
    {
      key: "k",
      sectionId: "price",
      symbol: "K",
      name: t("blackScholesStrikeLabel"),
      value: strike,
      min: 20,
      max: 200,
      step: 1,
      format: (v) => String(v),
      onChange: (v) => set({ k: v }),
    },
    {
      key: "r",
      sectionId: "rho",
      symbol: "r",
      name: t("blackScholesRateLabel"),
      value: rate,
      min: 0,
      max: 0.2,
      step: 0.005,
      format: (v) => v.toFixed(3),
      onChange: (v) => set({ r: v }),
    },
    {
      key: "sigma",
      sectionId: "vega",
      symbol: "σ",
      name: t("blackScholesVolatilityLabel"),
      value: volatility,
      min: 0.01,
      max: 1,
      step: 0.01,
      format: (v) => v.toFixed(2),
      onChange: (v) => set({ sigma: v }),
    },
    {
      key: "tmax",
      sectionId: "theta",
      symbol: "T",
      name: t("blackScholesMaxMaturityLabel"),
      value: maxMaturity,
      min: 0.25,
      max: 20,
      step: 0.25,
      format: (v) => v.toFixed(2),
      onChange: (v) => set({ tmax: v }),
    },
    {
      key: "curves",
      symbol: "N",
      name: t("blackScholesCurveCountLabel"),
      value: curveCount,
      min: 2,
      max: 6,
      step: 1,
      format: (v) => String(v),
      onChange: (v) => set({ curves: v }),
    },
  ];

  const metricOptions: { key: MetricKey; label: string }[] = [
    { key: "price", label: t("blackScholesMetricPrice") },
    { key: "delta", label: "Delta" },
    { key: "gamma", label: "Gamma" },
    { key: "vega", label: "Vega" },
    { key: "theta", label: "Theta" },
    { key: "rho", label: "Rho" },
  ];

  
  return { t, language, isMobile, strike, rate, volatility, maxMaturity, curveCount, metric, setMetric, optionType, setOptionType, maturities, yDomain, chartData, atmPrice, chartSeries, tooltipDigits, sliders, metricOptions, getMetricTitle, view3d, setView3d, surface, metricLabel };
}
