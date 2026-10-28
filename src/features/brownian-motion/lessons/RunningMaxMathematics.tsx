import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";

export default function RunningMaxMathematics() {
  const { t } = useI18n();
  return (
    <section className="stoch-math-content">
      <p>{t("pgMaxMathIntro")}</p>
      <div className="stoch-equation stoch-equation-emphasis">
        <span>M(t) = max<sub>0≤s≤t</sub> W(s),&nbsp;&nbsp;m(t) = min<sub>0≤s≤t</sub> W(s)</span>
      </div>
      <p>{t("pgMaxMathLaw")}</p>
      <div className="stoch-equation">
        <span>P(M(t) ≥ a) = 2·P(W(t) ≥ a)&nbsp;&nbsp;⟹&nbsp;&nbsp;M(t) =<sup>d</sup> |W(t)|</span>
        <span>f<sub>M(t)</sub>(m) = 2φ(m/√t)/√t,&nbsp;&nbsp;E[M(t)] = √(2t/π)</span>
      </div>
      <p>{t("pgMaxMathInDistribution")}</p>
      <IntuitionTrigger sectionId="pg-running-max" variant="button" />
      <p>{t("pgMaxMathSymmetry")}</p>
      <div className="stoch-equation">
        <span>−m(t) =<sup>d</sup> M(t),&nbsp;&nbsp;E[M(t) − m(t)] = 2√(2t/π)</span>
      </div>
      <p>{t("pgMaxMathDiscrete")}</p>
      <IntuitionTrigger sectionId="pg-discrete-monitoring" variant="button" />
      <p className="stoch-next-connection">{t("pgMaxNextConnection")}</p>
    </section>
  );
}
