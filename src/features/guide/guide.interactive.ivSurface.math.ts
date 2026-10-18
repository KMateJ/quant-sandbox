import type { SurfaceData } from "../../components/charts/surface3d/surface3d.geometry";
import { impliedVolFromCallPrice } from "../heston/heston.math";
import { hestonCall, type HestonModel } from "./guide.volatility.math";

/// Heston parameters shared by the implied-volatility surface; ρ and ξ come from the controls.
export const IV_SURFACE_BASE: Omit<HestonModel, "rho" | "xi" | "T"> = { S0: 100, r: 0, v0: 0.04, theta: 0.04, kappa: 2 };

/// Strike grid (x axis) and maturity grid in years (z axis); both contain the readout points K = 80, 100, 120 and T = 1.
export const IV_SURFACE_STRIKES = Array.from({ length: 13 }, (_, i) => 70 + 5 * i);
export const IV_SURFACE_MATURITIES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

/// Black–Scholes implied volatility of the Heston call for one strike and maturity.
export function hestonIv(K: number, T: number, rho: number, xi: number): number {
  const m: HestonModel = { ...IV_SURFACE_BASE, T, rho, xi };
  return impliedVolFromCallPrice(hestonCall(K, m), m.S0, K, T, m.r);
}

/// Implied-volatility surface over strike × maturity, row-major as `values[maturity][strike]`.
export function ivSurface(rho: number, xi: number): SurfaceData {
  const values = IV_SURFACE_MATURITIES.map((T) => IV_SURFACE_STRIKES.map((K) => hestonIv(K, T, rho, xi)));
  const flat = values.flat();
  return { xs: IV_SURFACE_STRIKES, zs: IV_SURFACE_MATURITIES, values, min: Math.min(...flat), max: Math.max(...flat) };
}

/// Value of the surface at a grid strike and maturity (NaN off the grid).
export function ivAt(surface: SurfaceData, K: number, T: number): number {
  return surface.values[surface.zs.indexOf(T)]?.[surface.xs.indexOf(K)] ?? NaN;
}

/// Skew IV(80) − IV(120) at each maturity of the surface.
export function skewByMaturity(surface: SurfaceData): { T: number; skew: number }[] {
  return surface.zs.map((T) => ({ T, skew: ivAt(surface, 80, T) - ivAt(surface, 120, T) }));
}
