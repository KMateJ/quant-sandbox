import { useI18n } from "../../../../i18n";
import { stepBodyKey, stepTitleKey } from "../../demo/demoCopy";
import type { DemoModel } from "../../demo/useDemo";

/// Step counter, title and caption of the current demo step (announced politely).
export default function DemoCaption({ demo }: { demo: DemoModel }) {
  const { t } = useI18n();
  const { step, index, total } = demo;
  return (
    <div className="hdesk-demo-caption" aria-live="polite">
      <span className="hdesk-label">{t("hdDemoStepOf", { n: index + 1, total })}</span>
      <h2 className="hdesk-demo-title">{t(stepTitleKey(step.id))}</h2>
      <p className="hdesk-demo-body">{t(stepBodyKey(step.id))}</p>
    </div>
  );
}
