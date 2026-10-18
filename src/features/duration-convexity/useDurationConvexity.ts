import { useMemo } from "react";
import { useUrlState } from "../../components/useUrlState";
import { bondUrlSchema } from "../../lib/urlSchemas";
import { urlNumber } from "../../lib/urlState";
import { bondMeasures, errorCurve, priceChangeCurve, shockResult } from "./durationConvexity.math";
import type { BondParams } from "./durationConvexity.types";

const MAX_BP = 200;
const STEPS = 80;

// The bond and the shock live in the URL, so a configuration can be shared or linked from a guide.
const SCHEMA = {
  ...bondUrlSchema({ face: 100, couponRate: 0.04, ytm: 0.06, years: 20, freq: 2 }),
  dy: urlNumber(150, -MAX_BP, MAX_BP, 0),
};

/// State and derived model for the Duration & Convexity experiment: a base bond,
/// a scrubbable yield shock, and the exact/approximate price responses.
export function useDurationConvexity() {
  // `state` keeps its identity until the URL changes, so one memo covers the whole model.
  const [state, setState] = useUrlState(SCHEMA);
  const { bond, shockBp, measures, curve, errors, result } = useMemo(() => {
    const { dy, ...bond } = state;
    const measures = bondMeasures(bond);
    return {
      bond: bond as BondParams,
      shockBp: dy,
      measures,
      curve: priceChangeCurve(bond, measures, MAX_BP, STEPS),
      errors: errorCurve(bond, measures, MAX_BP, STEPS),
      result: shockResult(bond, measures, dy),
    };
  }, [state]);

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
    maxBp: MAX_BP,
    measures, curve, errors, result,
  };
}

export type DcModel = ReturnType<typeof useDurationConvexity>;
