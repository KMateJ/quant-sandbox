import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "../../i18n";
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

  return (
    <div className="view-layout">
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

      <div className="view-main">
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
    </div>
  );
}