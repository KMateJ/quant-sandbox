import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";

export type MathStep = { textKey: TranslationKey; equation?: string; emphasis?: boolean };

type Props = { steps: MathStep[]; nextKey: TranslationKey; intuitionSectionId?: string };

/// Mathematics tab body: alternating explanation and equation lines, then a link to the next idea.
export default function MathSteps({ steps, nextKey, intuitionSectionId }: Props) {
  const { t } = useI18n();
  return (
    <section className="stoch-math-content">
      {steps.map((step) => (
        <div key={step.textKey}>
          <p>{t(step.textKey)}</p>
          {step.equation && (
            <div className={step.emphasis ? "stoch-equation stoch-equation-emphasis" : "stoch-equation"}>
              <span>{step.equation}</span>
            </div>
          )}
        </div>
      ))}
      {intuitionSectionId && <IntuitionTrigger sectionId={intuitionSectionId} variant="button" />}
      <p className="stoch-next-connection">{t(nextKey)}</p>
    </section>
  );
}
