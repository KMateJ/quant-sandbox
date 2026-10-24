import { ScenarioGrid, signedMoney } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import type { RatesDeskModel } from "../useRatesDesk";

/// Bonds-alone vs hedged P&L for five instant curve reshapes.
export default function CurveScenarios({ desk }: { desk: RatesDeskModel }) {
  const { t } = useI18n();
  return (
    <ScenarioGrid
      id="ratd-scen"
      title={t("ratdScenTitle")}
      caption={t("ratdScenCaption")}
      corner={t("ratdScenCorner")}
      cols={[t("ratdPnlNaked"), t("ratdPnlHedged")]}
      rows={desk.scenarios.map((s) => ({
        label: t(`ratdScen_${s.id}` as TranslationKey),
        cells: [
          { display: signedMoney(s.naked), value: s.naked },
          { display: signedMoney(s.hedged), value: s.hedged },
        ],
      }))}
    />
  );
}
