/// A point comparing the actual bond price with its duration and duration+convexity estimates.
export type DurationPoint = {
  ytm: number;
  actual: number;
  duration: number;
  durConvex: number;
};
