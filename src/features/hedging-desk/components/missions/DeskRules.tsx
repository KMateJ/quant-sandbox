import Panel from "../../../../components/layout/Panel";
import { useI18n, type TranslationKey } from "../../../../i18n";

const RULES: [TranslationKey, TranslationKey][] = [
  ["hdMsRuleStepTitle", "hdMsRuleStep"],
  ["hdMsRuleSpreadTitle", "hdMsRuleSpread"],
  ["hdMsRuleMarkTitle", "hdMsRuleMark"],
  ["hdMsRuleCloseTitle", "hdMsRuleClose"],
];

/// Four short cards on how the simulated desk works.
export default function DeskRules() {
  const { t } = useI18n();
  return (
    <Panel title={t("hdMsRulesTitle")} className="hdesk-panel" flush>
      <div className="hdesk-rules">
        {RULES.map(([title, body]) => (
          <div key={title} className="hdesk-rule">
            <strong>{t(title)}</strong>
            <p>{t(body)}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
