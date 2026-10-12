import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";

export default function CovarianceMathematics() {
  const { t } = useI18n();
  return (
    <section className="stoch-math-content">
      <p>{t("stochCovMathIntro")}</p>
      <div className="stoch-equation stoch-equation-emphasis">
        <span>W(t) = W(s) + (W(t) − W(s))</span>
        <span>Cov(W(s), W(t)) = Var(W(s)) + Cov(W(s), W(t) − W(s)) = s + 0</span>
      </div>
      <p>{t("stochCovMathResult")}</p>
      <div className="stoch-equation">
        <span>Cov(W(s), W(t)) = min(s, t),&nbsp;&nbsp;Corr(W(s), W(t)) = √(s / t)</span>
      </div>
      <IntuitionTrigger sectionId="wiener-covariance" variant="button" />
      <p>{t("stochCovMathGaussian")}</p>
      <p className="stoch-next-connection">{t("stochCovNextConnection")}</p>
    </section>
  );
}
