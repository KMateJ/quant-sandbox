import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "../../i18n";
import { type SliderDescriptor } from "../../components/SliderDock";
import { useMediaQuery } from "../../components/useMediaQuery";
import { fellerMargin } from "./heston.math";
import type { GreeksComparison, HestonControlsSetters, HestonControlsState, HestonGreekProfilePoint, HestonPathPoint, HestonWorkerResponse, PriceComparisonPoint, SmilePoint } from "./heston.types";
import { formatNumber, parseNumber } from "./heston.utils";
import { useAdaptiveDebouncedValue } from "./useDebouncedValue";


// Fields that force a fresh Monte Carlo simulation. Everything else (S0, K, r)
// only reprices the cached draws, so those sliders get a near-instant delay.
const PRICING_EXPENSIVE_KEYS = [
  "v0",
  "theta",
  "kappa",
  "xi",
  "rho",
  "maturity",
  "pricingSteps",
  "pricingPaths",
] as const;


const PATHS_EXPENSIVE_KEYS = [
  "v0",
  "theta",
  "kappa",
  "xi",
  "rho",
  "maturity",
  "steps",
  "pathCount",
] as const;


const FAST_DELAY = 24;

const SLOW_DELAY = 180;


type PricingInput = Omit<HestonControlsState, "steps" | "pathCount">;

type PathsInput = HestonControlsState;
export function useHestonView() {
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

  const [priceComparisonData, setPriceComparisonData] = useState<
    PriceComparisonPoint[]
  >([]);
  const [smileData, setSmileData] = useState<SmilePoint[]>([]);
  const [greeksData, setGreeksData] = useState<GreeksComparison | null>(null);
  const [greeksProfileData, setGreeksProfileData] = useState<
    HestonGreekProfilePoint[]
  >([]);
  const [stockPathData, setStockPathData] = useState<HestonPathPoint[]>([]);
  const [variancePathData, setVariancePathData] = useState<HestonPathPoint[]>(
    []
  );
  const [appliedPaths, setAppliedPaths] = useState<HestonControlsState | null>(
    null
  );

  const pricingWorkerRef = useRef<Worker | null>(null);
  const latestPricingRequestIdRef = useRef(0);
  const pricingBusyRef = useRef(false);
  const pricingPendingRef = useRef<PricingInput | null>(null);
  const pathsWorkerRef = useRef<Worker | null>(null);
  const latestPathsRequestIdRef = useRef(0);
  const pathsBusyRef = useRef(false);
  const pathsPendingRef = useRef<PathsInput | null>(null);
  const pendingPathsConfigRef = useRef<HestonControlsState | null>(null);

  // Toggled when a worker is (re)created so the send effects re-run and
  // re-dispatch to the fresh worker — notably after React StrictMode remounts.
  const [pricingReady, setPricingReady] = useState(false);
  const [pathsReady, setPathsReady] = useState(false);

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

  const debouncedPricingControls = useAdaptiveDebouncedValue(
    pricingInput,
    PRICING_EXPENSIVE_KEYS,
    FAST_DELAY,
    SLOW_DELAY
  );
  const debouncedPathsControls = useAdaptiveDebouncedValue(
    pathsInput,
    PATHS_EXPENSIVE_KEYS,
    FAST_DELAY,
    SLOW_DELAY
  );

  // Only ever keep one request in flight per worker. New inputs that arrive
  // while the worker is busy are coalesced into a "pending" slot and sent once
  // the previous result comes back, so a fast drag can never backlog the queue.
  const sendPricing = useCallback((input: PricingInput) => {
    const worker = pricingWorkerRef.current;
    if (!worker) return;
    latestPricingRequestIdRef.current += 1;
    pricingBusyRef.current = true;
    worker.postMessage({
      kind: "pricing",
      requestId: latestPricingRequestIdRef.current,
      ...input,
    });
  }, []);

  const sendPaths = useCallback((input: PathsInput) => {
    const worker = pathsWorkerRef.current;
    if (!worker) return;
    latestPathsRequestIdRef.current += 1;
    pathsBusyRef.current = true;
    pendingPathsConfigRef.current = input;
    worker.postMessage({
      kind: "paths",
      requestId: latestPathsRequestIdRef.current,
      S0: input.S0,
      strike: input.strike,
      rate: input.rate,
      v0: input.v0,
      theta: input.theta,
      kappa: input.kappa,
      xi: input.xi,
      rho: input.rho,
      maturity: input.maturity,
      steps: input.steps,
      pathCount: input.pathCount,
    });
  }, []);

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
    pricingBusyRef.current = false;

    worker.onmessage = (event: MessageEvent<HestonWorkerResponse>) => {
      const response = event.data;
      if (response.kind !== "pricing") return;

      pricingBusyRef.current = false;

      if (response.requestId === latestPricingRequestIdRef.current) {
        setPriceComparisonData(response.priceComparisonData);
        setSmileData(response.smileData);
        setGreeksData(response.greeks);
        setGreeksProfileData(response.greeksProfile);
      }

      const pending = pricingPendingRef.current;
      if (pending) {
        pricingPendingRef.current = null;
        sendPricing(pending);
      }
    };

    setPricingReady(true);

    return () => {
      worker.terminate();
      pricingWorkerRef.current = null;
      setPricingReady(false);
    };
  }, [sendPricing]);

  useEffect(() => {
    const worker = new Worker(new URL("./heston.worker.ts", import.meta.url), {
      type: "module",
    });

    pathsWorkerRef.current = worker;
    pathsBusyRef.current = false;

    worker.onmessage = (event: MessageEvent<HestonWorkerResponse>) => {
      const response = event.data;
      if (response.kind !== "paths") return;

      pathsBusyRef.current = false;

      if (response.requestId === latestPathsRequestIdRef.current) {
        setStockPathData(response.stockData);
        setVariancePathData(response.varianceData);
        setAppliedPaths(pendingPathsConfigRef.current);
      }

      const pending = pathsPendingRef.current;
      if (pending) {
        pathsPendingRef.current = null;
        sendPaths(pending);
      }
    };

    setPathsReady(true);

    return () => {
      worker.terminate();
      pathsWorkerRef.current = null;
      setPathsReady(false);
    };
  }, [sendPaths]);

  useEffect(() => {
    if (!pricingWorkerRef.current) return;

    if (pricingBusyRef.current) {
      pricingPendingRef.current = debouncedPricingControls;
    } else {
      sendPricing(debouncedPricingControls);
    }
  }, [debouncedPricingControls, sendPricing, pricingReady]);

  useEffect(() => {
    if (!pathsWorkerRef.current) return;

    if (pathsBusyRef.current) {
      pathsPendingRef.current = debouncedPathsControls;
    } else {
      sendPaths(debouncedPathsControls);
    }
  }, [debouncedPathsControls, sendPaths, pathsReady]);

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
    { key: "v0", sectionId: "stochastic-volatility", symbol: "v₀", name: "v0", value: v0, min: 0.0001, max: 0.25, step: 0.0025, format: (v) => v.toFixed(4), onChange: setV0 },
    { key: "theta", sectionId: "mean-reversion", symbol: "θ", name: "θ", value: theta, min: 0.0001, max: 0.25, step: 0.0025, format: (v) => v.toFixed(4), onChange: setTheta },
    { key: "kappa", sectionId: "mean-reversion", symbol: "κ", name: "κ", value: kappa, min: 0.1, max: 10, step: 0.1, format: (v) => v.toFixed(2), onChange: setKappa },
    { key: "xi", sectionId: "vol-of-vol", symbol: "ξ", name: "ξ (vol-of-vol)", value: xi, min: 0.01, max: 2, step: 0.01, format: (v) => v.toFixed(2), onChange: setXi },
    { key: "rho", sectionId: "correlation", symbol: "ρ", name: "ρ", value: rho, min: -0.99, max: 0.99, step: 0.01, format: (v) => v.toFixed(2), onChange: setRho },
    { key: "T", symbol: "T", name: "T", value: maturity, min: 0.25, max: 10, step: 0.25, format: (v) => (language === "hu" ? `${v.toFixed(2)} év` : `${v.toFixed(2)} years`), onChange: setMaturity },
    { key: "steps", symbol: "steps", name: "Path steps", value: steps, min: 25, max: 500, step: 25, format: (v) => v.toFixed(0), onChange: setSteps },
    { key: "paths", symbol: "paths", name: "Visual paths", value: pathCount, min: 1, max: 30, step: 1, format: (v) => v.toFixed(0), onChange: setPathCount },
    { key: "pSteps", sectionId: "smile", symbol: "pSteps", name: "Pricing steps", value: pricingSteps, min: 25, max: 400, step: 25, format: (v) => v.toFixed(0), onChange: setPricingSteps },
    { key: "pPaths", sectionId: "smile", symbol: "pPaths", name: "Pricing paths", value: pricingPaths, min: 100, max: 2000, step: 100, format: (v) => v.toFixed(0), onChange: setPricingPaths },
  ];

  
  return { language, isMobile, S0, strike, theta, controlsOpen, setControlsOpen, priceComparisonData, smileData, greeksData, greeksProfileData, stockPathData, variancePathData, currentControls, pathsParams, feller, pathKeys, controlSetters, sliders };
}
