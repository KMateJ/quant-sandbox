import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { diffusionSolution, makeTimes } from "./diffusion.math";
import { type SliderDescriptor } from "../../components/SliderDock";
import { useMediaQuery } from "../../components/useMediaQuery";
import { type ChartSeries } from "../../components/charts";
import { useI18n } from "../../i18n";


type ChartRow = {
  x: number;
  [key: string]: number;
};


const lineColors = [
  "#22c55e",
  "#84cc16",
  "#eab308",
  "#f97316",
  "#ef4444",
  "#38bdf8",
];


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


function formatNumber(value: number, decimals?: number) {
  if (decimals == null) return String(value);
  return String(Number(value.toFixed(decimals)));
}


function formatTimeLabel(t: number, language: "hu" | "en"): string {
  if (language === "hu") {
    if (t < 0) return `t=${t} múlt`;
    if (t > 0) return `t=${t} jövő`;
    return "t=0";
  }

  if (t < 0) return `t=${t} past`;
  if (t > 0) return `t=${t} future`;
  return "t=0";
}
export function useDiffusionView() {
  const { t, language } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [searchParams, setSearchParams] = useSearchParams();
  const queryString = searchParams.toString();

  const [controlsOpen, setControlsOpen] = useState(true);
  const [kappa, setKappa] = useState(() =>
    parseNumber(searchParams.get("kappa"), 0.003, 0.0001, 0.05, 4)
  );
  const [n, setN] = useState(() =>
    parseNumber(searchParams.get("n"), 4, 1, 12)
  );
  const [tMin, setTMin] = useState(() =>
    parseNumber(searchParams.get("tmin"), -2, -5, 0, 1)
  );
  const [tMax, setTMax] = useState(() =>
    parseNumber(searchParams.get("tmax"), 2, 0, 5, 1)
  );
  const [curveCount, setCurveCount] = useState(() =>
    parseNumber(searchParams.get("curves"), 5, 2, 6)
  );

  useEffect(() => {
    setKappa(parseNumber(searchParams.get("kappa"), 0.003, 0.0001, 0.05, 4));
    setN(parseNumber(searchParams.get("n"), 4, 1, 12));
    setTMin(parseNumber(searchParams.get("tmin"), -2, -5, 0, 1));
    setTMax(parseNumber(searchParams.get("tmax"), 2, 0, 5, 1));
    setCurveCount(parseNumber(searchParams.get("curves"), 5, 2, 6));
  }, [queryString, searchParams]);

  useEffect(() => {
    const next = new URLSearchParams();
    next.set("kappa", formatNumber(kappa, 4));
    next.set("n", formatNumber(n));
    next.set("tmin", formatNumber(tMin, 1));
    next.set("tmax", formatNumber(tMax, 1));
    next.set("curves", formatNumber(curveCount));

    const nextString = next.toString();
    if (nextString !== queryString) {
      setSearchParams(next, { replace: true });
    }
  }, [kappa, n, tMin, tMax, curveCount, queryString, setSearchParams]);

  const times = useMemo(
    () => makeTimes(tMin, tMax, curveCount),
    [tMin, tMax, curveCount]
  );

  const chartData = useMemo<ChartRow[]>(() => {
    const pointCount = 240;
    const xMin = 0;
    const xMax = 2 * Math.PI;

    return Array.from({ length: pointCount }, (_, i) => {
      const x = xMin + (i / (pointCount - 1)) * (xMax - xMin);
      const row: ChartRow = { x: Number(x.toFixed(4)) };

      for (const t of times) {
        row[formatTimeLabel(t, language)] = Number(
          diffusionSolution(x, kappa, n, t).toFixed(6)
        );
      }

      return row;
    });
  }, [times, kappa, n, language]);

  const amplitudeBound = useMemo(() => {
    const candidates = times.map((t) => Math.exp(-kappa * n * n * t));
    const maxAmp = Math.max(...candidates, 1);
    const padded = maxAmp * 1.15;
    return Number(Math.min(Math.max(padded, 1.2), 10).toFixed(2));
  }, [times, kappa, n]);

  const chartSeries = useMemo<ChartSeries[]>(
    () =>
      times.map((time, index) => ({
        key: formatTimeLabel(time, language),
        label: formatTimeLabel(time, language),
        color: lineColors[index % lineColors.length],
        strokeWidth: 2.5,
      })),
    [times, language]
  );

  const sliders: SliderDescriptor[] = [
    { key: "kappa", symbol: "κ", name: t("diffusionKappaLabel"), value: kappa, min: 0.0001, max: 0.05, step: 0.0005, format: (v) => v.toFixed(4), onChange: setKappa },
    { key: "n", symbol: "n", name: t("diffusionNLabel"), value: n, min: 1, max: 12, step: 1, format: (v) => v.toFixed(0), onChange: setN },
    { key: "tMin", symbol: "t₋", name: t("diffusionTMinLabel"), value: tMin, min: -5, max: 0, step: 0.1, format: (v) => v.toFixed(1), onChange: setTMin },
    { key: "tMax", symbol: "t₊", name: t("diffusionTMaxLabel"), value: tMax, min: 0, max: 5, step: 0.1, format: (v) => v.toFixed(1), onChange: setTMax },
    { key: "curveCount", symbol: "N", name: t("diffusionCurveCountLabel"), value: curveCount, min: 2, max: 6, step: 1, format: (v) => v.toFixed(0), onChange: setCurveCount },
  ];

  
  return { t, isMobile, controlsOpen, setControlsOpen, kappa, setKappa, n, setN, tMin, setTMin, tMax, setTMax, curveCount, setCurveCount, times, chartData, amplitudeBound, chartSeries, sliders };
}
