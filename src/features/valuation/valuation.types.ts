/// A row of the DCF schedule: projection year with nominal and discounted free cashflow.
export type DcfPoint = {
  year: number;
  fcf: number;
  pv: number;
  discount: number;
  cumulativePv: number;
};
