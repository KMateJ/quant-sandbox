import { useMemo, useState } from "react";
import { HeatmapPicker } from "../../../../components/charts";
import { ChartContainer } from "../../../../components/layout";
import { ChallengeRecord } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { recordChallenge } from "../../../../lib/game/challengeScores";
import { nextSeed } from "../../../../lib/game/seed";
import { challengeRound, crossSection, topAlphaLabel } from "../../cross.math";
import { formatMonth } from "../../famaFrench.math";
import type { FfData } from "../../famaFrench.types";

const CHALLENGE = "ffm-corner";
const AXIS = [1, 2, 3, 4, 5];
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const cell = (label: string) => ({ x: Number(label[3]), y: Number(label[1]) });

/// Challenge: alpha colours hidden; click the portfolio with the largest alpha under a drawn model and 20-year window.
export default function CornerChallenge({ data }: { data: FfData }) {
  const { t, language } = useI18n();
  const [seed, setSeed] = useState(1);
  const [picked, setPicked] = useState<string | null>(null);
  const round = useMemo(() => challengeRound(seed, data.months.length), [seed, data]);
  const rows = useMemo(() => crossSection(data, round.window, round.model), [data, round]);
  const truth = topAlphaLabel(rows);
  const alphaOf = (label: string) => rows.find((r) => r.label === label)?.alpha ?? 0;
  const range = `${formatMonth(data.months[round.window.from], language)} – ${formatMonth(data.months[round.window.to], language)}`;

  const pick = (x: number, y: number) => {
    if (picked) return;
    const label = `S${y}B${x}`;
    setPicked(label);
    recordChallenge(CHALLENGE, label === truth, Date.now());
  };
  const next = () => {
    setSeed(nextSeed(seed));
    setPicked(null);
  };

  return (
    <ChartContainer
      title={t("ffmChTitle")}
      height={380}
      actions={picked ? <button type="button" className="preset-btn" onClick={next}>{t("ffmChNext")}</button> : undefined}
    >
      <p className="control-hint">{t("ffmChQuestion", { model: round.model.toUpperCase(), window: range })}</p>
      <HeatmapPicker
        height={300}
        xValues={AXIS}
        yValues={AXIS}
        value={(x, y) => (picked ? alphaOf(`S${y}B${x}`) : 0)}
        selected={picked ? cell(truth) : undefined}
        onPick={pick}
        scale="diverging"
        center={0}
        xLabel={t("ffmCrossGridX")}
        yLabel={t("ffmCrossGridY")}
        valueFormat={pct}
        ariaLabel={t("ffmChAria")}
      />
      {picked && (
        <p className="control-hint" role="status">
          {picked === truth
            ? t("ffmChHit", { code: truth, alpha: pct(alphaOf(truth)) })
            : t("ffmChMiss", { pick: picked, pickAlpha: pct(alphaOf(picked)), code: truth, alpha: pct(alphaOf(truth)) })}
        </p>
      )}
      <ChallengeRecord id={CHALLENGE} />
    </ChartContainer>
  );
}
