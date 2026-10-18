import { useMemo, useState } from "react";
import { useUrlState } from "../../components/useUrlState";
import { useI18n } from "../../i18n";
import {
  alpha,
  assetRows,
  betaObservations,
  clamp,
  expectedReturn,
  marketRiskPremium,
  observationCorrelation,
  regressBeta,
  withAssetReturn,
  PRESET_ASSETS,
  RETURN_RANGE,
} from "./capm.math";
import { CAPM_URL_SCHEMA, MAX_BETA } from "./capm.url";

/// CAPM lab state: market and selected asset in the URL, draggable preset assets, and the beta sample.
export function useCapmLab() {
  const { t } = useI18n();
  const [state, setState] = useUrlState(CAPM_URL_SCHEMA);
  const { rf: riskFree, rm: marketReturn, beta, ret: actualReturn, disp: dispersion, seed } = state;
  const [presets, setPresets] = useState(PRESET_ASSETS);

  const required = expectedReturn(riskFree, beta, marketReturn);
  const premium = marketRiskPremium(riskFree, marketReturn);
  const jensenAlpha = alpha(actualReturn, riskFree, beta, marketReturn);

  const rows = useMemo(() => {
    const selected = { name: t("capmSelectedPoint"), beta, expectedReturn: actualReturn };
    return assetRows([...presets, selected], riskFree, marketReturn);
  }, [presets, beta, actualReturn, riskFree, marketReturn, t]);

  const observations = useMemo(
    () => betaObservations(beta, marketReturn, riskFree, dispersion, seed),
    [beta, marketReturn, riskFree, dispersion, seed]
  );
  const regression = useMemo(() => regressBeta(observations), [observations]);
  const corr = useMemo(() => observationCorrelation(observations), [observations]);

  const setMarketReturn = (rm: number) => setState({ rm: clamp(rm, ...RETURN_RANGE) });
  const setActualReturn = (ret: number) => setState({ ret: clamp(ret, ...RETURN_RANGE) });

  /// Asset `index` of `rows` dragged to return `y`; the last row is the selected asset.
  const dragAsset = (index: number, y: number) => {
    if (index === presets.length) setActualReturn(y);
    else setPresets((prev) => withAssetReturn(prev, index, y));
  };

  return {
    ...state,
    riskFree,
    marketReturn,
    actualReturn,
    dispersion,
    required,
    premium,
    jensenAlpha,
    rows,
    observations,
    regression,
    corr,
    maxBeta: MAX_BETA,
    presetsEdited: presets !== PRESET_ASSETS,
    setState,
    setRiskFree: (rf: number) => setState({ rf }),
    setMarketReturn,
    setBeta: (b: number) => setState({ beta: clamp(b, 0, MAX_BETA) }),
    setActualReturn,
    setDispersion: (disp: number) => setState({ disp }),
    setSeed: (s: number) => setState({ seed: s }),
    dragSelected: (x: number, y: number) => setState({ beta: clamp(x, 0, MAX_BETA), ret: clamp(y, ...RETURN_RANGE) }),
    dragAsset,
    resetPresets: () => setPresets(PRESET_ASSETS),
  };
}

export type CapmLab = ReturnType<typeof useCapmLab>;
