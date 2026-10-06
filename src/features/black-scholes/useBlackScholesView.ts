import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { blackScholesCall, blackScholesPut, blackScholesDelta, blackScholesPutDelta, blackScholesGamma, blackScholesVega, blackScholesTheta, blackScholesPutTheta, blackScholesRho, blackScholesPutRho, makeMaturities } from "./blackScholes.math";
import { type SliderDescriptor } from "../../components/SliderDock";
import { useMediaQuery } from "../../components/useMediaQuery";
import { type ChartSeries } from "../../components/charts";
import { useI18n } from "../../i18n";


type ChartRow = {
  S: number;
  [key: string]: number;
};


const lineColors = [
  "#1d4ed8",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];


type MetricKey = "price" | "delta" | "gamma" | "vega" | "theta" | "rho";

type OptionType = "call" | "put";


function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}


function parseNumber(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
  decimals?: number
) {
  if (value == null || value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const clamped = clamp(parsed, min, max);
  if (decimals == null) return clamped;
  return Number(clamped.toFixed(decimals));
}


function parseMetric(value: string | null): MetricKey {
  if (
    value === "price" ||
    value === "delta" ||
    value === "gamma" ||
    value === "vega" ||
    value === "theta" ||
    value === "rho"
  ) {
    return value;
  }

  return "price";
}


function parseOptionType(value: string | null): OptionType {
  return value === "put" ? "put" : "call";
}


function formatNumber(value: number, decimals?: number) {
  if (decimals == null) return String(value);
  return String(Number(value.toFixed(decimals)));
}


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
  const [searchParams, setSearchParams] = useSearchParams();
  const queryString = searchParams.toString();

  const [strike, setStrike] = useState(() =>
    parseNumber(searchParams.get("k"), 100, 20, 200)
  );
  const [rate, setRate] = useState(() =>
    parseNumber(searchParams.get("r"), 0.05, 0, 0.2, 3)
  );
  const [volatility, setVolatility] = useState(() =>
    parseNumber(searchParams.get("sigma"), 0.2, 0.01, 1, 2)
  );
  const [maxMaturity, setMaxMaturity] = useState(() =>
    parseNumber(searchParams.get("tmax"), 5, 0.25, 20, 2)
  );
  const [curveCount, setCurveCount] = useState(() =>
    parseNumber(searchParams.get("curves"), 5, 2, 6)
  );
  const [controlsOpen, setControlsOpen] = useState(true);
  const [metric, setMetric] = useState<MetricKey>(() =>
    parseMetric(searchParams.get("metric"))
  );
  const [optionType, setOptionType] = useState<OptionType>(() =>
    parseOptionType(searchParams.get("type"))
  );
  useEffect(() => {
    setStrike(parseNumber(searchParams.get("k"), 100, 20, 200));
    setRate(parseNumber(searchParams.get("r"), 0.05, 0, 0.2, 3));
    setVolatility(parseNumber(searchParams.get("sigma"), 0.2, 0.01, 1, 2));
    setMaxMaturity(parseNumber(searchParams.get("tmax"), 5, 0.25, 20, 2));
    setCurveCount(parseNumber(searchParams.get("curves"), 5, 2, 6));
    setMetric(parseMetric(searchParams.get("metric")));
    setOptionType(parseOptionType(searchParams.get("type")));
  }, [queryString, searchParams]);

  useEffect(() => {
    const next = new URLSearchParams();
    next.set("k", formatNumber(strike));
    next.set("r", formatNumber(rate, 3));
    next.set("sigma", formatNumber(volatility, 2));
    next.set("tmax", formatNumber(maxMaturity, 2));
    next.set("curves", formatNumber(curveCount));
    next.set("metric", metric);
    next.set("type", optionType);

    const nextString = next.toString();
    if (nextString !== queryString) {
      setSearchParams(next, { replace: true });
    }
  }, [
    strike,
    rate,
    volatility,
    maxMaturity,
    curveCount,
    metric,
    optionType,
    queryString,
    setSearchParams,
  ]);

  const maturities = useMemo(
    () => makeMaturities(maxMaturity, curveCount),
    [maxMaturity, curveCount]
  );

  const yDomain = useMemo<[number, number]>(() => {
    if (metric === "price") return [0, 175];
    if (metric === "delta") return optionType === "put" ? [-1, 0] : [0, 1];
    if (metric === "gamma") return [0, 0.12];
    if (metric === "vega") return [0, 100];
    if (metric === "theta") return optionType === "put" ? [-25, 15] : [-30, 10];
    if (metric === "rho") return optionType === "put" ? [-250, 0] : [0, 250];
    return [0, 200];
  }, [metric, optionType]);

  const chartData = useMemo<ChartRow[]>(() => {
    const sMin = 10;
    const sMax = 200;
    const pointCount = 140;

    const metricFn = (S: number, T: number) => {
      switch (metric) {
        case "price":
          return optionType === "call"
            ? blackScholesCall(S, strike, T, rate, volatility)
            : blackScholesPut(S, strike, T, rate, volatility);

        case "delta":
          return optionType === "call"
            ? blackScholesDelta(S, strike, T, rate, volatility)
            : blackScholesPutDelta(S, strike, T, rate, volatility);

        case "gamma":
          return blackScholesGamma(S, strike, T, rate, volatility);

        case "vega":
          return blackScholesVega(S, strike, T, rate, volatility);

        case "theta":
          return optionType === "call"
            ? blackScholesTheta(S, strike, T, rate, volatility)
            : blackScholesPutTheta(S, strike, T, rate, volatility);

        case "rho":
          return optionType === "call"
            ? blackScholesRho(S, strike, T, rate, volatility)
            : blackScholesPutRho(S, strike, T, rate, volatility);

        default:
          return optionType === "call"
            ? blackScholesCall(S, strike, T, rate, volatility)
            : blackScholesPut(S, strike, T, rate, volatility);
      }
    };

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
        color: lineColors[index % lineColors.length],
        strokeWidth: 2.5,
      })),
    [maturities]
  );

  const tooltipDigits = metric === "gamma" ? 5 : metric === "delta" ? 4 : 3;

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
      onChange: setStrike,
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
      onChange: setRate,
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
      onChange: setVolatility,
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
      onChange: setMaxMaturity,
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
      onChange: setCurveCount,
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

  
  return { t, language, isMobile, strike, rate, volatility, maxMaturity, curveCount, controlsOpen, setControlsOpen, metric, setMetric, optionType, setOptionType, maturities, yDomain, chartData, atmPrice, chartSeries, tooltipDigits, sliders, metricOptions, getMetricTitle };
}
