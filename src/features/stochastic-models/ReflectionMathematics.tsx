import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";

export default function ReflectionMathematics() {
  const { t } = useI18n();
  return (
    <section className="stoch-math-content">
      <p>{t("pgReflMathIntro")}</p>
      <div className="stoch-equation">
        <span>τ<sub>a</sub> = inf{"{"}t ≥ 0 : W(t) = a{"}"},&nbsp;&nbsp;W̃(t) = W(t) for t &lt; τ<sub>a</sub>,&nbsp;&nbsp;W̃(t) = 2a − W(t) for t ≥ τ<sub>a</sub></span>
      </div>
      <p>{t("pgReflMathStrongMarkov")}</p>
      <IntuitionTrigger sectionId="pg-strong-markov" variant="button" />
      <p>{t("pgReflMathArgument")}</p>
      <div className="stoch-equation stoch-equation-emphasis">
        <span>P(M(T) ≥ a, W(T) &lt; a) = P(W(T) &gt; a)</span>
        <span>P(M(T) ≥ a) = P(W(T) ≥ a) + P(M(T) ≥ a, W(T) &lt; a) = 2·P(W(T) ≥ a)</span>
      </div>
      <p>{t("pgReflMathJoint")}</p>
      <div className="stoch-equation">
        <span>P(M(T) ≥ a, W(T) ≤ b) = P(W(T) ≥ 2a − b),&nbsp;&nbsp;b ≤ a</span>
      </div>
      <p>{t("pgReflMathCaveat")}</p>
      <IntuitionTrigger sectionId="pg-reflection" variant="button" />
      <p className="stoch-next-connection">{t("pgReflNextConnection")}</p>
    </section>
  );
}
