import { useMemo, useState } from "react";
import { useUrlState } from "../../components/useUrlState";
import { bondUrlSchema } from "../../lib/urlSchemas";
import { urlBool, urlEnum, urlNumber } from "../../lib/urlState";
import {
  bondMeasures, drawShock, errorCurve, priceChangeCurve, shockResult, zeroConvexity, zeroPriceChangePct, zeroWithDuration,
} from "./durationConvexity.math";
import type { BondParams } from "./durationConvexity.types";

const MAX_BP = 200;
const PREDICT_MAX_BP = 250;
const STEPS = 80;

// The bond and the shock live in the URL, so a configuration can be shared or linked from a guide.
const SCHEMA = {
  ...bondUrlSchema({ face: 100, couponRate: 0.04, ytm: 0.06, years: 20, freq: 2 }),
  dy: urlNumber(150, -MAX_BP, MAX_BP, 0),
  mode: urlEnum(["explore", "predict"] as const, "explore"),
  twin: urlBool(false),
};

/// State and derived model for the Duration & Convexity experiment: a base bond,
/// a scrubbable yield shock, and the exact/approximate price responses.
export function useDurationConvexity() {
  // `state` keeps its identity until the URL changes, so one memo covers the whole model.
  const [state, setState] = useUrlState(SCHEMA);
  // Predict rounds draw their own shock from the round number, so a shared link reproduces round 1.
  const [round, setRound] = useState(1);
  const predict = state.mode === "predict";
  const maxBp = predict ? PREDICT_MAX_BP : MAX_BP;
  const { bond, shockBp, measures, curve, errors, result, twinData } = useMemo(() => {
    const { dy, mode, twin, ...bond } = state;
    const measures = bondMeasures(bond);
    const shock = mode === "predict" ? drawShock(round) : dy;
    // Same modified duration, zero-coupon: the cash flows sit exactly at the duration, so convexity differs.
    const years = zeroWithDuration(measures.modified, bond.ytm, bond.freq);
    const twinData = twin ? {
      years,
      convexity: zeroConvexity(years, bond.ytm, bond.freq),
      pct: (bp: number) => zeroPriceChangePct(years, bond.ytm, bond.freq, bp),
    } : null;
    return {
      bond: bond as BondParams,
      shockBp: shock,
      measures,
      curve: priceChangeCurve(bond, measures, maxBp, STEPS),
      errors: errorCurve(bond, measures, maxBp, STEPS),
      result: shockResult(bond, measures, shock),
      twinData,
    };
  }, [state, round, maxBp]);

  return {
    ...bond,
    bond,
    setBond: (patch: Partial<BondParams>) => setState(patch),
    setFace: (face: number) => setState({ face }),
    setCouponRate: (couponRate: number) => setState({ couponRate }),
    setYears: (years: number) => setState({ years }),
    setFreq: (freq: number) => setState({ freq }),
    setYtm: (ytm: number) => setState({ ytm }),
    shockBp,
    setShockBp: (dy: number) => setState({ dy }),
    maxBp,
    mode: state.mode,
    setMode: (mode: "explore" | "predict") => setState({ mode }),
    twin: twinData,
    setTwin: (twin: boolean) => setState({ twin }),
    round,
    nextRound: () => setRound((r) => r + 1),
    measures, curve, errors, result,
  };
}

export type DcModel = ReturnType<typeof useDurationConvexity>;
