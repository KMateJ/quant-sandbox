import { Panel } from "../../../../components/layout";
import { PredictExplain, type ExplainOption } from "../../../../components/ui";
import { useI18n, type TranslationKey } from "../../../../i18n";
import type { CrossModelState } from "../../useCrossTab";

const CORNER_NAME: Record<string, TranslationKey> = {
  S1B1: "ffmCrossCorner_S1B1",
  S1B5: "ffmCrossCorner_S1B5",
  S5B1: "ffmCrossCorner_S5B1",
  S5B5: "ffmCrossCorner_S5B5",
};
const CORNERS = Object.keys(CORNER_NAME);
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Two explain steps read off the reader's own window: CAPM does not line up, and which corner FF3 still misses.
export default function CrossPredict({ model }: { model: CrossModelState }) {
  const { t } = useI18n();
  const alpha = (m: "capm" | "ff3", code: string) => model.all[m].find((r) => r.label === code)?.alpha ?? 0;
  const vars = { value: pct(alpha("capm", "S1B5")), growth: pct(alpha("capm", "S1B1")) };
  const worst = CORNERS.reduce((a, b) => (Math.abs(alpha("ff3", a)) >= Math.abs(alpha("ff3", b)) ? a : b));
  const first: ExplainOption[] = [
    { text: t("ffmCrossP1_yes"), feedback: t("ffmCrossP1_yesFb", vars) },
    { text: t("ffmCrossP1_no"), feedback: t("ffmCrossP1_noFb", vars), correct: true },
    { text: t("ffmCrossP1_big"), feedback: t("ffmCrossP1_bigFb", vars) },
  ];
  const second: ExplainOption[] = CORNERS.map((code) => ({
    text: t(CORNER_NAME[code]),
    correct: code === worst,
    feedback: t(code === worst ? "ffmCrossP2_right" : "ffmCrossP2_wrong", { code: worst, alpha: pct(alpha("ff3", worst)) }),
  }));
  return (
    <Panel>
      <PredictExplain key={`a-${vars.value}`} question={t("ffmCrossP1_q")} options={first} />
      <PredictExplain key={`b-${worst}`} question={t("ffmCrossP2_q")} options={second} />
    </Panel>
  );
}
