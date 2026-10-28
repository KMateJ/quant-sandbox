import { useMemo, useState } from "react";
import type { TranslationKey } from "../../i18n";
import { newBond, patchBond, patchSettings, type SettingsPatch } from "./basket.math";
import { useCtdSwitch } from "./useCtdSwitch";
import { loadScenario, type Scenario, type ScenarioId } from "./scenarios";
import { cheapestBond, deliveryEconomics, TfInputError, type DeliverableBond } from "./treasuryFutures.math";

/// i18n key for an input error: `tfErr_<code>` for coded maths errors, else the generic fallback.
export function errorKey(cause: unknown): TranslationKey {
  return cause instanceof TfInputError ? (`tfErr_${cause.code}` as TranslationKey) : "tfErrInvalid";
}

/// Lab state: the active worksheet scenario, the last input error, delivery economics, CTD and ranking, and handlers.
/// A failed edit keeps the previous scenario and shows the error.
export function useTreasuryFutures() {
  const [data, setData] = useState<Scenario>(() => loadScenario("bund"));
  const [error, setError] = useState<TranslationKey | null>(null);
  const bund = data.id === "bund";
  const sw = useCtdSwitch(data, !bund);
  // Results, CTD and ranking follow the yield-shift explorer; the delivery chart keeps the unshifted basket.
  const futures = sw.shifted?.futures ?? data.futures;
  const results = useMemo(() => deliveryEconomics(sw.shifted?.bonds ?? data.bonds, futures), [sw.shifted, data.bonds, futures]);
  const baseCtd = useMemo(() => (sw.shifted ? cheapestBond(deliveryEconomics(data.bonds, data.futures)) : undefined), [sw.shifted, data.bonds, data.futures]);
  const ctd = bund ? undefined : cheapestBond(results);
  const ranked = useMemo(() => [...results].sort((a, b) => a.netBasis - b.netBasis), [results]);

  const apply = (update: () => Scenario) => {
    try {
      setData(update());
      setError(null);
    } catch (cause) {
      setError(errorKey(cause));
    }
  };

  return {
    data,
    futures,
    sw,
    error,
    results,
    ctd,
    chartCtd: baseCtd ?? ctd,
    ranked,
    bund,
    selectScenario: (id: ScenarioId) => {
      setData(loadScenario(id));
      sw.setShiftBp(0);
      setError(null);
    },
    setFutures: (value: number) => {
      sw.setShiftBp(0);
      setData((d) => ({ ...d, futures: value }));
    },
    updateBond: (index: number, patch: Partial<DeliverableBond>) => apply(() => patchBond(data, index, patch)),
    updateSetting: (patch: SettingsPatch) => apply(() => patchSettings(data, patch)),
    addBond: () => setData((d) => ({ ...d, bonds: [...d.bonds, newBond(d.bonds)] })),
    removeBond: (i: number) => setData((d) => ({ ...d, bonds: d.bonds.filter((_, index) => index !== i) })),
  };
}

export type TreasuryFuturesModel = ReturnType<typeof useTreasuryFutures>;
