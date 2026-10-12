import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";

export default function CltMathematics() {
  const { t } = useI18n();
  return (
    <section className="stoch-math-content">
      <p>{t("stochCltMathIntro")}</p>
      <div className="stoch-equation stoch-equation-emphasis">
        <span>Zₙ = (X₁ + … + Xₙ) / √n&nbsp;&nbsp;⟹&nbsp;&nbsp;P(Zₙ ≤ x) → Φ(x)</span>
      </div>
      <p>{t("stochCltMathStatement")}</p>
      <IntuitionTrigger sectionId="clt-statement" variant="button" />
      <p>{t("stochCltMathUniversality")}</p>
      <p>{t("stochCltMathSkew")}</p>
      <div className="stoch-equation">
        <span>skew(Zₙ) = γ / √n</span>
      </div>
      <IntuitionTrigger sectionId="clt-universality" variant="button" />
      <p>{t("stochCltMathBerryEsseen")}</p>
      <div className="stoch-equation">
        <span>supₓ |P(Zₙ ≤ x) − Φ(x)| ≤ C · E|X|³ / √n,&nbsp;&nbsp;C ≈ 0.4748</span>
      </div>
      <p>{t("stochCltMathLattice")}</p>
      <IntuitionTrigger sectionId="berry-esseen" variant="button" />
      <p className="stoch-next-connection">{t("stochCltNextConnection")}</p>
    </section>
  );
}
