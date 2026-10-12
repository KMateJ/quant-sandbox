import { Panel } from "../../components/layout";
import { useI18n } from "../../i18n";
import type { TranslationKey } from "../../i18n";

/// Short "try this" prompts that turn the controls into questions to answer by experiment.
export default function GuidedExperiments({ keys }: { keys: TranslationKey[] }) {
  const { t } = useI18n();
  return (
    <Panel title={t("stochTryTitle")}>
      <ol className="stoch-guided-list">
        {keys.map((key) => (
          <li key={key}>{t(key)}</li>
        ))}
      </ol>
    </Panel>
  );
}
