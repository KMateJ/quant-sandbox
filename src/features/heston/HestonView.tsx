import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "../../i18n";
import SliderDock, { type SliderDescriptor } from "../../components/SliderDock";
import { useMediaQuery } from "../../components/useMediaQuery";
import HestonControls from "./components/HestonControls";
import HestonExplanation from "./components/HestonExplanation";
import HestonPathsChart from "./components/HestonPathsChart";
import HestonPriceComparisonChart from "./components/HestonPriceComparisonChart";
import HestonSmileChart from "./components/HestonSmileChart";
import HestonVarianceChart from "./components/HestonVarianceChart";
import { fellerMargin } from "./heston.math";
import type {
  HestonControlsSetters,
  HestonControlsState,
  HestonPathPoint,
  HestonWorkerResponse,
  PriceComparisonPoint,
  SmilePoint,
} from "./heston.types";
import { formatNumber, parseNumber } from "./heston.utils";
import { useDebouncedValue } from "./useDebouncedValue";

export default function HestonView() {
  const { language } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [searchParams, setSearchParams] = useSearchParams();
  const queryString = searchParams.toString();

  const [S0, setS0] = useState(() =>
    parseNumber(searchParams.get("s0"), 100, 20, 200)
  );
  const [strike, setStrike] = useState(() =>
    parseNumber(searchParams.get("k"), 100, 20, 200)
  );
  const [rate, setRate] = useState(() =>
    parseNumber(searchParams.get("r"), 0.05, 0, 0.2, 3)
  );
  const [v0, setV0] = useState(() =>
    parseNumber(searchParams.get("v0"), 0.04, 0.0001, 0.25, 4)
  );
  const [theta, setTheta] = useState(() =>
    parseNumber(searchParams.get("theta"), 0.04, 0.0001, 0.25, 4)
  );
  const [kappa, setKappa] = useState(() =>
    parseNumber(searchParams.get("kappa"), 2, 0.1, 10, 2)
  );
  const [xi, setXi] = useState(() =>
    parseNumber(searchParams.get("xi"), 0.5, 0.01, 2, 2)
  );
  const [rho, setRho] = useState(() =>
    parseNumber(searchParams.get("rho"), -0.7, -0.99, 0.99, 2)
  );
  const [maturity, setMaturity] = useState(() =>
    parseNumber(searchParams.get("t"), 1, 0.25, 10, 2)
  );
  const [steps, setSteps] = useState(() =>
    parseNumber(searchParams.get("steps"), 150, 25, 500)
  );
  const [pathCount, setPathCount] = useState(() =>
    parseNumber(searchParams.get("paths"), 5, 1, 6)
  );
  const [pricingSteps, setPricingSteps] = useState(() =>
    parseNumber(searchParams.get("pricingSteps"), 80, 25, 400)
  );
  const [pricingPaths, setPricingPaths] = useState(() =>
    parseNumber(searchParams.get("pricingPaths"), 250, 50, 2000)
  );

  const [controlsOpen, setControlsOpen] = useState(true);
  const [stockChartOpen, setStockChartOpen] = useState(true);
  const [varChartOpen, setVarChartOpen] = useState(true);
  const [comparisonChartOpen, setComparisonChartOpen] = useState(true);
  const [smileChartOpen, setSmileChartOpen] = useState(true);

  const [priceComparisonData, setPriceComparisonData] = useState<
    PriceComparisonPoint[]
  >([]);
  const [smileData, setSmileData] = useState<SmilePoint[]>([]);
  const [stockPathData, setStockPathData] = useState<HestonPathPoint[]>([]);
  const [variancePathData, setVariancePathData] = useState<HestonPathPoint[]>(
    []
  );
  const [appliedPaths, setAppliedPaths] = useState<HestonControlsState | null>(
    null
  );
  const [isUpdatingPaths, setIsUpdatingPaths] = useState(false);
  const [pathsRerunNonce, setPathsRerunNonce] = useState(0);

  const pricingWorkerRef = useRef<Worker | null>(null);
  const latestPricingRequestIdRef = useRef(0);
  const pathsWorkerRef = useRef<Worker | null>(null);
  const latestPathsRequestIdRef = useRef(0);
  const pendingPathsConfigRef = useRef<HestonControlsState | null>(null);

  useEffect(() => {
    setS0(parseNumber(searchParams.get("s0"), 100, 20, 200));
    setStrike(parseNumber(searchParams.get("k"), 100, 20, 200));
    setRate(parseNumber(searchParams.get("r"), 0.05, 0, 0.2, 3));
    setV0(parseNumber(searchParams.get("v0"), 0.04, 0.0001, 0.25, 4));
    setTheta(parseNumber(searchParams.get("theta"), 0.04, 0.0001, 0.25, 4));
    setKappa(parseNumber(searchParams.get("kappa"), 2, 0.1, 10, 2));
    setXi(parseNumber(searchParams.get("xi"), 0.5, 0.01, 2, 2));
    setRho(parseNumber(searchParams.get("rho"), -0.7, -0.99, 0.99, 2));
    setMaturity(parseNumber(searchParams.get("t"), 1, 0.25, 10, 2));
    setSteps(parseNumber(searchParams.get("steps"), 150, 25, 500));
    setPathCount(parseNumber(searchParams.get("paths"), 5, 1, 30));
    setPricingSteps(
      parseNumber(searchParams.get("pricingSteps"), 80, 25, 400)
    );
    setPricingPaths(
      parseNumber(searchParams.get("pricingPaths"), 250, 50, 2000)
    );
  }, [queryString, searchParams]);

  const currentControls: HestonControlsState = useMemo(
    () => ({
      S0,
      strike,
      rate,
      v0,
      theta,
      kappa,
      xi,
      rho,
      maturity,
      steps,
      pathCount,
      pricingSteps,
      pricingPaths,
    }),
    [
      S0,
      strike,
      rate,
      v0,
      theta,
      kappa,
      xi,
      rho,
      maturity,
      steps,
      pathCount,
      pricingSteps,
      pricingPaths,
    ]
  );

  const pricingInput = useMemo(
    () => ({
      S0,
      strike,
      rate,
      v0,
      theta,
      kappa,
      xi,
      rho,
      maturity,
      pricingSteps,
      pricingPaths,
    }),
    [
      S0,
      strike,
      rate,
      v0,
      theta,
      kappa,
      xi,
      rho,
      maturity,
      pricingSteps,
      pricingPaths,
    ]
  );

  const pathsInput = useMemo(
    () => ({
      S0,
      strike,
      rate,
      v0,
      theta,
      kappa,
      xi,
      rho,
      maturity,
      steps,
      pathCount,
      pricingSteps,
      pricingPaths,
    }),
    [
      S0,
      strike,
      rate,
      v0,
      theta,
      kappa,
      xi,
      rho,
      maturity,
      steps,
      pathCount,
      pricingSteps,
      pricingPaths,
    ]
  );

  const debouncedPricingControls = useDebouncedValue(pricingInput, 300);
  const debouncedPathsControls = useDebouncedValue(pathsInput, 300);

  useEffect(() => {
    const next = new URLSearchParams();
    next.set("s0", formatNumber(S0));
    next.set("k", formatNumber(strike));
    next.set("r", formatNumber(rate, 3));
    next.set("v0", formatNumber(v0, 4));
    next.set("theta", formatNumber(theta, 4));
    next.set("kappa", formatNumber(kappa, 2));
    next.set("xi", formatNumber(xi, 2));
    next.set("rho", formatNumber(rho, 2));
    next.set("t", formatNumber(maturity, 2));
    next.set("steps", formatNumber(steps));
    next.set("paths", formatNumber(pathCount));
    next.set("pricingSteps", formatNumber(pricingSteps));
    next.set("pricingPaths", formatNumber(pricingPaths));

    const nextString = next.toString();
    if (nextString !== queryString) {
      setSearchParams(next, { replace: true });
    }
  }, [
    S0,
    strike,
    rate,
    v0,
    theta,
    kappa,
    xi,
    rho,
    maturity,
    steps,
    pathCount,
    pricingSteps,
    pricingPaths,
    queryString,
    setSearchParams,
  ]);

  useEffect(() => {
    const worker = new Worker(new URL("./heston.worker.ts", import.meta.url), {
      type: "module",
    });

    pricingWorkerRef.current = worker;

    worker.onmessage = (event: MessageEvent<HestonWorkerResponse>) => {
      const response = event.data;
      if (response.kind !== "pricing") return;
      if (response.requestId !== latestPricingRequestIdRef.current) return;

      setPriceComparisonData(response.priceComparisonData);
      setSmileData(response.smileData);
    };

    return () => {
      worker.terminate();
      pricingWorkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const worker = new Worker(new URL("./heston.worker.ts", import.meta.url), {
      type: "module",
    });

    pathsWorkerRef.current = worker;

    worker.onmessage = (event: MessageEvent<HestonWorkerResponse>) => {
      const response = event.data;
      if (response.kind !== "paths") return;
      if (response.requestId !== latestPathsRequestIdRef.current) return;

      setStockPathData(response.stockData);
      setVariancePathData(response.varianceData);
      setAppliedPaths(pendingPathsConfigRef.current);
      setIsUpdatingPaths(false);
    };

    return () => {
      worker.terminate();
      pathsWorkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!pricingWorkerRef.current) return;

    const requestId = latestPricingRequestIdRef.current + 1;
    latestPricingRequestIdRef.current = requestId;

    pricingWorkerRef.current.postMessage({
      kind: "pricing",
      requestId,
      ...debouncedPricingControls,
    });
  }, [debouncedPricingControls]);

  useEffect(() => {
    if (!pathsWorkerRef.current) return;

    const requestId = latestPathsRequestIdRef.current + 1;
    latestPathsRequestIdRef.current = requestId;
    pendingPathsConfigRef.current = debouncedPathsControls;
    setIsUpdatingPaths(true);

    pathsWorkerRef.current.postMessage({
      kind: "paths",
      requestId,
      S0: debouncedPathsControls.S0,
      strike: debouncedPathsControls.strike,
      rate: debouncedPathsControls.rate,
      v0: debouncedPathsControls.v0,
      theta: debouncedPathsControls.theta,
      kappa: debouncedPathsControls.kappa,
      xi: debouncedPathsControls.xi,
      rho: debouncedPathsControls.rho,
      maturity: debouncedPathsControls.maturity,
      steps: debouncedPathsControls.steps,
      pathCount: debouncedPathsControls.pathCount,
    });
  }, [debouncedPathsControls, pathsRerunNonce]);

  const handleUpdatePaths = () => {
    setPathsRerunNonce((prev) => prev + 1);
  };

  const pathsParams = appliedPaths ?? debouncedPathsControls;

  const feller = useMemo(
    () => fellerMargin(kappa, theta, xi),
    [kappa, theta, xi]
  );

  const pathKeys = useMemo(
    () => Array.from({ length: pathsParams.pathCount }, (_, i) => `path-${i + 1}`),
    [pathsParams.pathCount]
  );

  const controlSetters: HestonControlsSetters = {
    setS0,
    setStrike,
    setRate,
    setV0,
    setTheta,
    setKappa,
    setXi,
    setRho,
    setMaturity,
    setSteps,
    setPathCount,
    setPricingSteps,
    setPricingPaths,
  };

  const sliders: SliderDescriptor[] = [
    { key: "S0", symbol: "S₀", name: "S0", value: S0, min: 20, max: 200, step: 1, format: (v) => v.toFixed(0), onChange: setS0 },
    { key: "K", symbol: "K", name: "K (strike)", value: strike, min: 20, max: 200, step: 1, format: (v) => v.toFixed(0), onChange: setStrike },
    { key: "r", symbol: "r", name: "r", value: rate, min: 0, max: 0.2, step: 0.005, format: (v) => v.toFixed(3), onChange: setRate },
    { key: "v0", symbol: "v₀", name: "v0", value: v0, min: 0.0001, max: 0.25, step: 0.0025, format: (v) => v.toFixed(4), onChange: setV0 },
    { key: "theta", symbol: "θ", name: "θ", value: theta, min: 0.0001, max: 0.25, step: 0.0025, format: (v) => v.toFixed(4), onChange: setTheta },
    { key: "kappa", symbol: "κ", name: "κ", value: kappa, min: 0.1, max: 10, step: 0.1, format: (v) => v.toFixed(2), onChange: setKappa },
    { key: "xi", symbol: "ξ", name: "ξ (vol-of-vol)", value: xi, min: 0.01, max: 2, step: 0.01, format: (v) => v.toFixed(2), onChange: setXi },
    { key: "rho", symbol: "ρ", name: "ρ", value: rho, min: -0.99, max: 0.99, step: 0.01, format: (v) => v.toFixed(2), onChange: setRho },
    { key: "T", symbol: "T", name: "T", value: maturity, min: 0.25, max: 10, step: 0.25, format: (v) => (language === "hu" ? `${v.toFixed(2)} év` : `${v.toFixed(2)} years`), onChange: setMaturity },
    { key: "steps", symbol: "steps", name: "Path steps", value: steps, min: 25, max: 500, step: 25, format: (v) => v.toFixed(0), onChange: setSteps },
    { key: "paths", symbol: "paths", name: "Visual paths", value: pathCount, min: 1, max: 30, step: 1, format: (v) => v.toFixed(0), onChange: setPathCount },
    { key: "pSteps", symbol: "pSteps", name: "Pricing steps", value: pricingSteps, min: 25, max: 400, step: 25, format: (v) => v.toFixed(0), onChange: setPricingSteps },
    { key: "pPaths", symbol: "pPaths", name: "Pricing paths", value: pricingPaths, min: 100, max: 2000, step: 100, format: (v) => v.toFixed(0), onChange: setPricingPaths },
  ];

  return (
    <div className="view-layout">
      {!isMobile ? (
        <div className="view-controls">
          <HestonControls
            language={language}
            controlsOpen={controlsOpen}
            setControlsOpen={setControlsOpen}
            values={currentControls}
            setters={controlSetters}
            feller={feller}
          />
        </div>
      ) : null}

      <div className="view-main view-main--docked">
        <HestonPathsChart
          data={stockPathData}
          pathKeys={pathKeys}
          strike={pathsParams.strike}
          isOpen={stockChartOpen}
          setIsOpen={setStockChartOpen}
          onUpdate={handleUpdatePaths}
          isUpdating={isUpdatingPaths}
        />

        <HestonVarianceChart
          data={variancePathData}
          pathKeys={pathKeys}
          theta={pathsParams.theta}
          isOpen={varChartOpen}
          setIsOpen={setVarChartOpen}
          onUpdate={handleUpdatePaths}
          isUpdating={isUpdatingPaths}
        />

        <HestonPriceComparisonChart
          data={priceComparisonData}
          strike={strike}
          isOpen={comparisonChartOpen}
          setIsOpen={setComparisonChartOpen}
        />

        <HestonSmileChart
          data={smileData}
          strikeRatio={Number((strike / S0).toFixed(3))}
          isOpen={smileChartOpen}
          setIsOpen={setSmileChartOpen}
        />

        <HestonExplanation />
      </div>

      {isMobile ? <SliderDock sliders={sliders} /> : null}
    </div>
  );
}