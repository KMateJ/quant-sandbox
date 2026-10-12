import { IntuitionTrigger } from "../../components/intuition";
import { useI18n } from "../../i18n";

export default function HittingMathematics() {
  const { t } = useI18n();
  return (
    <section className="stoch-math-content">
      <p>{t("pgHitMathIntro")}</p>
      <div className="stoch-equation stoch-equation-emphasis">
        <span>P(max<sub>s≤t</sub> (W(s) + μs) ≥ a) = 1 − Φ((a − μt)/√t) + e<sup>2μa</sup>·Φ((−a − μt)/√t)</span>
      </div>
      <p>{t("pgHitMathGirsanov")}</p>
      <IntuitionTrigger sectionId="pg-hitting-drift" variant="button" />
      <p>{t("pgHitMathLimits")}</p>
      <div className="stoch-equation">
        <span>μ = 0: 2(1 − Φ(a/√t));&nbsp;&nbsp;t → ∞: 1 if μ ≥ 0, e<sup>2μa</sup> if μ &lt; 0</span>
      </div>
      <p>{t("pgHitMathDiscrete")}</p>
      <div className="stoch-equation">
        <span>P<sub>Δt</sub>(a) ≈ P<sub>cont</sub>(a + β√Δt),&nbsp;&nbsp;β = −ζ(½)/√(2π) ≈ 0.5826</span>
      </div>
      <IntuitionTrigger sectionId="pg-discrete-monitoring" variant="button" />
      <h3>{t("pgHitApplicationsTitle")}</h3>
      <p>{t("pgHitApplications")}</p>
      <p className="stoch-next-connection">{t("pgHitNextConnection")}</p>
    </section>
  );
}
