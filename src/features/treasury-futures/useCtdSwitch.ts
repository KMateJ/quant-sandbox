import { useMemo, useState } from "react";
import type { Scenario } from "./scenarios";
import { ctdSwitchCurve, ctdSwitchPoints, type CtdPoint, type CtdSwitch } from "./ctdSwitch.math";
import type { DeliverableBond } from "./treasuryFutures.math";

export type CtdShiftState = {
  shiftBp: number;
  setShiftBp: (bp: number) => void;
  /// Net-basis curve on the shift grid; null when unavailable (bund, or a price no yield can produce).
  curve: CtdPoint[] | null;
  switches: CtdSwitch[];
  /// Basket repriced at the current shift with the consistent futures price; null at 0 bp.
  shifted: { bonds: DeliverableBond[]; futures: number } | null;
};

/// Parallel yield-shift state for the CTD explorer: memoised curve, switch points and the repriced basket.
export function useCtdSwitch(data: Scenario, enabled: boolean): CtdShiftState {
  const [shiftBp, setShiftBp] = useState(0);
  const curve = useMemo(() => {
    if (!enabled) return null;
    try { return ctdSwitchCurve(data.bonds, data.delivery); } catch { return null; }
  }, [enabled, data.bonds, data.delivery]);
  const switches = useMemo(() => (curve ? ctdSwitchPoints(curve) : []), [curve]);
  const point = shiftBp === 0 ? undefined : curve?.find((p) => p.shiftBp === shiftBp);
  const shifted = useMemo(
    () => (point ? { bonds: data.bonds.map((bond) => ({ ...bond, cleanPrice: point.prices[bond.id] })), futures: point.futures } : null),
    [point, data.bonds],
  );
  return { shiftBp, setShiftBp, curve, switches, shifted };
}
