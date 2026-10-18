import { Panel } from "./layout";
import { useI18n } from "../i18n";
import type { TranslationKey } from "../i18n";

/// Short "try this" prompts that turn a lab's controls into questions to answer by experiment.
export default function GuidedExperiments({ keys }: { keys: TranslationKey[] }) {
  const { t } = useI18n();
  return (
    <Panel title={t("labTryTitle")}>
      <ol className="guided-list">
        {keys.map((key) => (
          <li key={key}>{t(key)}</li>
        ))}
      </ol>
    </Panel>
  );
}
