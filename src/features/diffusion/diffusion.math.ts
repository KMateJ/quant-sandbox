export function diffusionSolution(
  x: number,
  kappa: number,
  n: number,
  t: number
): number {
  return Math.exp(-kappa * n * n * t) * Math.sin(n * x);
}

export function makeTimes(
  tMin: number,
  tMax: number,
  curveCount: number
): number[] {
  const count = Math.max(2, Math.round(curveCount));

  return Array.from({ length: count }, (_, i) => {
    const ratio = count === 1 ? 0 : i / (count - 1);
    return Number((tMin + ratio * (tMax - tMin)).toFixed(2));
  });
}