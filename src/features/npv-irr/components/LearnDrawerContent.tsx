import { useI18n } from "../../../i18n";

/// Long-form reference for the Learn drawer (progressive disclosure, level 3).
export default function LearnDrawerContent() {
  const { t } = useI18n();
  const items: [string, string][] = [
    [t("npvValue"), t("npvLearnNpv")],
    [t("npvIrr"), t("npvLearnIrr")],
    [t("npvPi"), t("npvLearnPi")],
    [t("npvPayback"), t("npvLearnPayback")],
    [t("npvLearnSensitivityTitle"), t("npvLearnSensitivity")],
    [t("npvLearnMonteCarloTitle"), t("npvLearnMonteCarlo")],
    [t("npvLearnRealOptionsTitle"), t("npvLearnRealOptions")],
  ];
  return (
    <div className="npv-learn">
      {items.map(([title, body]) => (
        <section key={title} className="npv-learn-item">
          <h3>{title}</h3>
          <p>{body}</p>
        </section>
      ))}
    </div>
  );
}
