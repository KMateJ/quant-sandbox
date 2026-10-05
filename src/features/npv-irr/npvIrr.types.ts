/// A point on the NPV profile: discount rate and the resulting net present value.
export type NpvPoint = {
  rate: number;
  npv: number;
};

/// A row of the discounted cashflow schedule (year 0 is the initial outlay).
export type NpvScheduleRow = {
  year: number;
  cashflow: number;
  discount: number;
  pv: number;
  cumulativePv: number;
};
