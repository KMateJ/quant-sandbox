/// A coupon bond position: annual coupon rate, whole years to maturity, face amount.
export type Holding = { coupon: number; maturity: number; face: number };

/// Price of 1 unit of face of an annual-coupon bond at yield `y` (1 = par).
export function pricePerFace(coupon: number, maturity: number, y: number): number {
  let p = 0;
  for (let t = 1; t <= maturity; t++) p += coupon / (1 + y) ** t;
  return p + 1 / (1 + y) ** maturity;
}

/// Macaulay duration (years) of an annual-coupon bond at yield `y`.
export function macaulay(coupon: number, maturity: number, y: number): number {
  let s = 0;
  for (let t = 1; t <= maturity; t++) s += (t * (coupon + (t === maturity ? 1 : 0))) / (1 + y) ** t;
  return s / pricePerFace(coupon, maturity, y);
}

/// Convexity (years²) of an annual-coupon bond at yield `y`.
export function convexityOf(coupon: number, maturity: number, y: number): number {
  let s = 0;
  for (let t = 1; t <= maturity; t++) s += (t * (t + 1) * (coupon + (t === maturity ? 1 : 0))) / (1 + y) ** (t + 2);
  return s / pricePerFace(coupon, maturity, y);
}

/// PV, modified duration and convexity of a set of holdings at one flat yield `y` (value-weighted).
export function portfolioRisk(holdings: Holding[], y: number): { pv: number; dMod: number; convexity: number } {
  let pv = 0;
  let dur = 0;
  let cvx = 0;
  for (const h of holdings) {
    const v = h.face * pricePerFace(h.coupon, h.maturity, y);
    pv += v;
    dur += v * macaulay(h.coupon, h.maturity, y);
    cvx += v * convexityOf(h.coupon, h.maturity, y);
  }
  return pv > 0 ? { pv, dMod: dur / pv / (1 + y), convexity: cvx / pv } : { pv: 0, dMod: 0, convexity: 0 };
}

/// Weights over assets with the given durations whose value-weighted duration equals `target`: the two assets
/// bracketing it share the money (a target past the longest asset goes all in the longest, below the shortest all in the shortest).
export function matchWeights(durations: number[], target: number): number[] {
  const weights = durations.map(() => 0);
  const order = durations.map((_, i) => i).sort((a, b) => durations[a] - durations[b]);
  if (target <= durations[order[0]]) return Object.assign(weights, { [order[0]]: 1 });
  const last = order[order.length - 1];
  if (target >= durations[last]) return Object.assign(weights, { [last]: 1 });
  for (let k = 1; k < order.length; k++) {
    const lo = order[k - 1];
    const hi = order[k];
    if (target <= durations[hi]) {
      weights[lo] = (durations[hi] - target) / (durations[hi] - durations[lo]);
      weights[hi] = 1 - weights[lo];
      return weights;
    }
  }
  return weights;
}

/// Faces of a short and a long bond whose PV equals the PV of a liability `liabFace` due in `liabT` years and
/// whose duration equals the liability's (a 2×2 solve), all at flat yield `y`.
export function immunizingFaces(short: Holding, long: Holding, liabFace: number, liabT: number, y: number): [number, number] {
  const pv = liabFace / (1 + y) ** liabT;
  const pS = pricePerFace(short.coupon, short.maturity, y);
  const pL = pricePerFace(long.coupon, long.maturity, y);
  const [wS] = matchWeights([macaulay(short.coupon, short.maturity, y), macaulay(long.coupon, long.maturity, y)], liabT);
  return [(wS * pv) / pS, ((1 - wS) * pv) / pL];
}
