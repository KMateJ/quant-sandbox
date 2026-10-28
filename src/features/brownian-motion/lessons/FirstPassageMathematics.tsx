import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";

export default function FirstPassageMathematics() {
  const { t } = useI18n();
  return (
    <section className="stoch-math-content">
      <p>{t("pgFpMathIntro")}</p>
      <div className="stoch-equation stoch-equation-emphasis">
        <span>{"{"}τ<sub>a</sub> ≤ t{"}"} = {"{"}M(t) ≥ a{"}"}&nbsp;&nbsp;⟹&nbsp;&nbsp;P(τ<sub>a</sub> ≤ t) = 2(1 − Φ(a/√t))</span>
      </div>
      <p>{t("pgFpMathDensity")}</p>
      <div className="stoch-equation">
        <span>f<sub>τ<sub>a</sub></sub>(t) = a / √(2πt³) · exp(−a² / 2t),&nbsp;&nbsp;t &gt; 0</span>
      </div>
      <IntuitionTrigger sectionId="pg-first-passage" variant="button" />
      <p>{t("pgFpMathHeavyTail")}</p>
      <div className="stoch-equation">
        <span>P(τ<sub>a</sub> &lt; ∞) = 1,&nbsp;&nbsp;P(τ<sub>a</sub> &gt; t) ~ a·√(2/(πt)),&nbsp;&nbsp;E[τ<sub>a</sub>] = ∞</span>
      </div>
      <p>{t("pgFpMathScaling")}</p>
      <div className="stoch-equation">
        <span>τ<sub>a</sub> =<sup>d</sup> a²·τ<sub>1</sub>,&nbsp;&nbsp;median(τ<sub>a</sub>) = (a / Φ⁻¹(3/4))² ≈ 2.20·a²</span>
      </div>
      <p>{t("pgFpMathDrift")}</p>
      <p className="stoch-next-connection">{t("pgFpNextConnection")}</p>
    </section>
  );
}
