import { useI18n } from "../../../i18n";
import type { GuideCheckAnswer } from "../guide.content.types";
import GuideInline from "./GuideInline";

type GuideCheckInputProps = {
  answer: GuideCheckAnswer;
  /// Radio group name, unique per card.
  name: string;
  text: string;
  choice: number | null;
  locked: boolean;
  onText: (value: string) => void;
  onChoice: (index: number) => void;
};

/// The answer field of a check: a number box with its unit, or one radio button per option.
export default function GuideCheckInput({ answer, name, text, choice, locked, onText, onChoice }: GuideCheckInputProps) {
  const { t } = useI18n();

  if (answer.type === "number") {
    return (
      <label className="guide-check-number">
        <span className="guide-visually-hidden">{t("guideCheckAnswer")}</span>
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          className="guide-answer-input"
          value={text}
          readOnly={locked}
          onChange={(e) => onText(e.target.value)}
        />
        {answer.unit && <span className="guide-check-unit">{answer.unit}</span>}
      </label>
    );
  }

  return (
    <div className="guide-check-options" role="radiogroup">
      {answer.options.map((option, i) => (
        <label key={i} className="guide-check-option" data-selected={choice === i || undefined}>
          <input
            type="radio"
            name={name}
            checked={choice === i}
            disabled={locked && choice !== i}
            onChange={() => onChoice(i)}
          />
          <span><GuideInline text={option} /></span>
        </label>
      ))}
    </div>
  );
}
