import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";

export default function RandomWalkMathematics() {
  const { t } = useI18n();
  return (
    <section className="stoch-math-content">
      <p>{t("stochWalkMathIntro")}</p>
      <div className="stoch-equation">
        <span>S₀ = 0, Sₙ = X₁ + ··· + Xₙ</span>
        <span>P(Xᵢ = +1) = p, P(Xᵢ = −1) = 1 − p</span>
      </div>
      <div className="stoch-equation">
        <span>E[Xᵢ] = 2p − 1</span>
        <span>Var(Xᵢ) = 4p(1 − p)</span>
      </div>
      <IntuitionTrigger sectionId="walk-bias" variant="button" />
      <p>{t("stochWalkMomentsExplanation")}</p>
      <div className="stoch-equation stoch-equation-emphasis">
        <span>E[Sₙ] = n(2p − 1)</span>
        <span>Var(Sₙ) = 4np(1 − p)</span>
      </div>
      <IntuitionTrigger sectionId="walk-variance" variant="button" />
      <p className="stoch-next-connection">{t("stochWalkNextConnection")}</p>
    </section>
  );
}
