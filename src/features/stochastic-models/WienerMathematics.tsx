import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";

export default function WienerMathematics() {
  const { t } = useI18n();
  return (
    <section className="stoch-math-content">
      <p>{t("wpMathIntro")}</p>
      <div className="stoch-equation stoch-equation-emphasis">
        <span>(i)&nbsp;&nbsp;{t("wpMathAxiom1")}</span>
        <span>(ii)&nbsp;&nbsp;{t("wpMathAxiom2")}</span>
        <span>(iii)&nbsp;&nbsp;{t("wpMathAxiom3")}</span>
        <span>(iv)&nbsp;&nbsp;{t("wpMathAxiom4")}</span>
      </div>
      <IntuitionTrigger sectionId="wiener-definition" variant="button" />
      <p>{t("wpMathExistence")}</p>
      <div className="stoch-equation">
        <span>W(m) = (W(l) + W(r)) / 2 + √((r − l) / 4) · Z,&nbsp;&nbsp;m = (l + r) / 2</span>
      </div>
      <p>{t("wpMathRoughness")}</p>
      <div className="stoch-equation">
        <span>E|W(c + h) − W(c)| / h = √(2 / (π h)) → ∞&nbsp;&nbsp;(h → 0)</span>
      </div>
      <p>{t("wpMathRoughnessResult")}</p>
      <IntuitionTrigger sectionId="wiener-roughness" variant="button" />
      <p>{t("wpMathAlmostSure")}</p>
      <p className="stoch-next-connection">{t("wpNextConnection")}</p>
    </section>
  );
}
