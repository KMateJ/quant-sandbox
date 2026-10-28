import { useI18n, type TranslationKey } from "../../../../i18n";
import { INDUSTRY_FUND_IDS } from "../../fund.math";

type Props = { ids: string[]; value: string; onChange: (id: string) => void };

const GROUPS: { key: TranslationKey; test: (id: string) => boolean }[] = [
  { key: "ffmGroupPractice", test: (id) => !INDUSTRY_FUND_IDS.includes(id) && id !== "challenge" },
  { key: "ffmGroupIndustry", test: (id) => INDUSTRY_FUND_IDS.includes(id) },
  { key: "ffmGroupChallenge", test: (id) => id === "challenge" },
];

/// Compact fund list grouped by whether an answer key exists.
export default function FundPicker({ ids, value, onChange }: Props) {
  const { t } = useI18n();
  return (
    <div className="ffm-fund-list">
      {GROUPS.map((g) => {
        const members = ids.filter(g.test);
        if (!members.length) return null;
        return (
          <div key={String(g.key)} className="ffm-fund-group" role="group" aria-label={t(g.key)}>
            <span className="ffm-fund-group-label">{t(g.key)}</span>
            {members.map((id) => (
              <button key={id} type="button" className={id === value ? "ffm-fund-btn is-active" : "ffm-fund-btn"} aria-pressed={id === value} onClick={() => onChange(id)}>
                {t(`ffmFundName_${id}` as TranslationKey)}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
