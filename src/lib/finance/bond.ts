/// Price of a fixed-coupon bond from its yield to maturity.
/// `couponRate` and `ytm` are annual; `freq` is coupons per year; `years` is time to maturity.
export function bondPrice(
  face: number,
  couponRate: number,
  ytm: number,
  years: number,
  freq = 2
): number {
  const nPeriods = Math.round(years * freq);
  const coupon = (face * couponRate) / freq;
  const y = ytm / freq;
  let price = 0;
  for (let t = 1; t <= nPeriods; t++) {
    price += coupon / Math.pow(1 + y, t);
  }
  price += face / Math.pow(1 + y, nPeriods);
  return price;
}

/// Macaulay duration (in years): present-value-weighted average time to each cashflow.
export function macaulayDuration(
  face: number,
  couponRate: number,
  ytm: number,
  years: number,
  freq = 2
): number {
  const nPeriods = Math.round(years * freq);
  const coupon = (face * couponRate) / freq;
  const y = ytm / freq;
  let weightedTime = 0;
  let price = 0;
  for (let t = 1; t <= nPeriods; t++) {
    const cf = t === nPeriods ? coupon + face : coupon;
    const pv = cf / Math.pow(1 + y, t);
    weightedTime += (t / freq) * pv;
    price += pv;
  }
  if (price === 0) throw new Error("macaulayDuration: zero bond price");
  return weightedTime / price;
}

/// Modified duration: Macaulay duration / (1 + ytm/freq); price sensitivity to yield.
export function modifiedDuration(
  face: number,
  couponRate: number,
  ytm: number,
  years: number,
  freq = 2
): number {
  const mac = macaulayDuration(face, couponRate, ytm, years, freq);
  return mac / (1 + ytm / freq);
}

/// Bond convexity (in years²): second-order sensitivity of price to yield changes.
export function convexity(
  face: number,
  couponRate: number,
  ytm: number,
  years: number,
  freq = 2
): number {
  const nPeriods = Math.round(years * freq);
  const coupon = (face * couponRate) / freq;
  const y = ytm / freq;
  let acc = 0;
  let price = 0;
  for (let t = 1; t <= nPeriods; t++) {
    const cf = t === nPeriods ? coupon + face : coupon;
    const pv = cf / Math.pow(1 + y, t);
    acc += (t * (t + 1) * pv) / (freq * freq);
    price += pv;
  }
  if (price === 0) throw new Error("convexity: zero bond price");
  return acc / (price * Math.pow(1 + y, 2));
}
