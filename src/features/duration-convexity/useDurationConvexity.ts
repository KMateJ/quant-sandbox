import { useMemo, useState } from "react";
import { bondMeasures, errorCurve, priceChangeCurve, shockResult } from "./durationConvexity.math";
import type { BondParams } from "./durationConvexity.types";

const MAX_BP = 200;
const STEPS = 80;

/// State and derived model for the Duration & Convexity experiment: a base bond,
/// a scrubbable yield shock, and the exact/approximate price responses.
export function useDurationConvexity() {
  const [face, setFace] = useState(100);
  const [couponRate, setCouponRate] = useState(0.04);
  const [years, setYears] = useState(20);
  const [freq, setFreq] = useState(2);
  const [ytm, setYtm] = useState(0.06);
  const [shockBp, setShockBp] = useState(150);

  const params: BondParams = { face, couponRate, ytm, years, freq };

  const measures = useMemo(
    () => bondMeasures(params),
    [face, couponRate, ytm, years, freq]
  );
  const curve = useMemo(
    () => priceChangeCurve(params, measures, MAX_BP, STEPS),
    [measures, face, couponRate, ytm, years, freq]
  );
  const errors = useMemo(
    () => errorCurve(params, measures, MAX_BP, STEPS),
    [measures, face, couponRate, ytm, years, freq]
  );
  const result = useMemo(
    () => shockResult(params, measures, shockBp),
    [measures, shockBp, face, couponRate, ytm, years, freq]
  );

  return {
    face, setFace,
    couponRate, setCouponRate,
    years, setYears,
    freq, setFreq,
    ytm, setYtm,
    shockBp, setShockBp,
    maxBp: MAX_BP,
    measures, curve, errors, result,
  };
}

export type DcModel = ReturnType<typeof useDurationConvexity>;
