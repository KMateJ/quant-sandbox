import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";

export default function WhySqrtMathematics() {
  const { t } = useI18n();
  return (
    <section className="stoch-math-content">
      <p>{t("stochSqrtMathIntro")}</p>
      <div className="stoch-equation stoch-equation-emphasis">
        <span>Var(Sₙ) = n&nbsp;&nbsp;⟹&nbsp;&nbsp;sd(Sₙ) = √n</span>
      </div>
      <p>{t("stochSqrtPowerLaw")}</p>
      <div className="stoch-equation">
        <span>sd(Sₙ) ∝ nᵃ,&nbsp;&nbsp;log sd = a · log n + const</span>
      </div>
      <IntuitionTrigger sectionId="scaling-exponents" variant="button" />
      <p>{t("stochSqrtWhyHalf")}</p>
      <p>{t("stochSqrtTimeScaling")}</p>
      <div className="stoch-equation">
        <span>sd(W(t)) = √t</span>
      </div>
      <IntuitionTrigger sectionId="scaling-law" variant="button" />
      <p className="stoch-next-connection">{t("stochSqrtNextConnection")}</p>
    </section>
  );
}
