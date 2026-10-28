import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";

export default function RescaledWalkMathematics() {
  const { t } = useI18n();
  return (
    <section className="stoch-math-content">
      <p>{t("stochRescaledMathIntro")}</p>
      <div className="stoch-equation stoch-equation-emphasis">
        <span>W⁽ⁿ⁾(t) = S₍⌊nt⌋₎ / √n,&nbsp;&nbsp;t ∈ [0, 1]</span>
      </div>
      <p>{t("stochRescaledVarianceExplain")}</p>
      <div className="stoch-equation">
        <span>E[W⁽ⁿ⁾(t)] = 0</span>
        <span>Var(W⁽ⁿ⁾(t)) = ⌊nt⌋ / n → t</span>
      </div>
      <IntuitionTrigger sectionId="donsker" variant="button" />
      <p>{t("stochDonskerBody")}</p>
      <p>{t("stochConvergenceTypesBody")}</p>
      <IntuitionTrigger sectionId="convergence-types" variant="button" />
      <p className="stoch-next-connection">{t("stochRescaledNextConnection")}</p>
    </section>
  );
}
