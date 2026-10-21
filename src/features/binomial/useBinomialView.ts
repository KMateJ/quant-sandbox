import { useMemo } from "react";
import { buildBinomialTree, buildRateTree } from "./binomial.math";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useUrlState } from "../../components/useUrlState";
import { useI18n } from "../../i18n";
import { createBinomialSliders } from "./binomial.controls";
import type { OptionKind, TreeMode } from "./binomial.types";
import { BINOMIAL_URL } from "./binomial.url";

export function useBinomialView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [state, set] = useUrlState(BINOMIAL_URL);
  const { mode, s0: S0, k: K, u, d, r, q, h, steps, type: optionKind } = state;
  const showPrimaryMetric = state.primary;
  const showSecondaryMetric = state.secondary;

  const tree = useMemo(() => {
    if (mode === "rates") {
      return buildRateTree({
        r0: r,
        h,
        q,
        steps,
      });
    }

    return buildBinomialTree({
      S0,
      K,
      u,
      d,
      r,
      steps,
      optionKind,
    });
  }, [mode, S0, K, u, d, r, q, h, steps, optionKind]);

  const primaryToggleLabel =
    mode === "rates"
      ? t("binomialToggleRates")
      : t("binomialToggleStocks");

  const secondaryToggleLabel =
    mode === "rates"
      ? t("binomialToggleBonds")
      : t("binomialToggleValues");

  const sliders = createBinomialSliders(
    { mode, S0, K, u, d, r, q, h, steps },
    { onS0Change: (v) => set({ s0: v }), onKChange: (v) => set({ k: v }), onUChange: (v) => set({ u: v }),
      onDChange: (v) => set({ d: v }), onRChange: (v) => set({ r: v }), onQChange: (v) => set({ q: v }),
      onHChange: (v) => set({ h: v }), onStepsChange: (v) => set({ steps: v }) }, t,
  );
  return {
    isMobile, mode, setMode: (v: TreeMode) => set({ mode: v }), sliders,
    optionKind, setOptionKind: (v: OptionKind) => set({ type: v }),
    showPrimaryMetric, toggleShowPrimaryMetric: () => set((p) => ({ primary: !p.primary })),
    showSecondaryMetric, toggleShowSecondaryMetric: () => set((p) => ({ secondary: !p.secondary })),
    tree, primaryToggleLabel, secondaryToggleLabel,
  };
}
