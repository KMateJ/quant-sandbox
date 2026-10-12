import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";

export default function IncrementMathematics() {
  const { t } = useI18n();
  return (
    <section className="stoch-math-content">
      <p>{t("stochIncMathIntro")}</p>
      <div className="stoch-equation stoch-equation-emphasis">
        <span>W(t) − W(s) ~ N(0, t − s),&nbsp;&nbsp;0 ≤ s &lt; t</span>
      </div>
      <IntuitionTrigger sectionId="wiener-definition" variant="button" />
      <p>{t("stochIncMathStationary")}</p>
      <div className="stoch-equation">
        <span>E[W(t)] = 0,&nbsp;&nbsp;Var(W(t)) = t,&nbsp;&nbsp;sd(W(t)) = √t</span>
      </div>
      <p>{t("stochIncMathLimit")}</p>
      <IntuitionTrigger sectionId="wiener-increments" variant="button" />
      <p className="stoch-next-connection">{t("stochIncNextConnection")}</p>
    </section>
  );
}
