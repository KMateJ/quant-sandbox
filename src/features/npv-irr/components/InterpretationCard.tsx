import type { Insight } from "../npvIrr.interpret";
import { useI18n } from "../../../i18n";

type InterpretationCardProps = {
  insights: Insight[];
};

const toneGlyph: Record<Insight["tone"], string> = {
  good: "▲",
  bad: "▼",
  info: "•",
};

/// Contextual, state-aware explanations — short messages, not a wall of prose.
export default function InterpretationCard({ insights }: InterpretationCardProps) {
  const { t } = useI18n();
  return (
    <div className="npv-interpret">
      <div className="npv-interpret-head">{t("npvInterpretTitle")}</div>
      <ul className="npv-interpret-list">
        {insights.map((insight, i) => (
          <li key={i} className={`npv-insight npv-insight-${insight.tone}`}>
            <span className="npv-insight-glyph" aria-hidden="true">
              {toneGlyph[insight.tone]}
            </span>
            <span>{insight.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
