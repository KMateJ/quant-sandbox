import { PredictReveal, usePredictReveal } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { swKey } from "../episodes.format";
import { episodeRun } from "../episodes.math";
import type { EpisodesPage } from "../useEpisodesPage";
import { useMemo } from "react";

const TOLERANCE = 2;

/// Predict: how many institutions fail in the model without one rescue (the first one switched off, else the first one).
export default function WithoutPredict({ page }: { page: EpisodesPage }) {
  const { t } = useI18n();
  const { episode, off } = page;
  const key = episode.switches.find((s) => off.has(s.key))?.key ?? episode.switches[0].key;
  const truth = useMemo(() => episodeRun(episode, new Set([key])).defaults.length, [episode, key]);
  const state = usePredictReveal({ truth, tolerance: TOLERANCE, resetKey: `${episode.id}|${key}`, challengeId: "syr-without" });
  const explain = episode.id === "svb2023"
    ? {
        question: t("syrEpExplainQuestion"),
        options: (["A", "B", "C"] as const).map((k) => ({
          text: t(`syrEpExplain${k}`),
          feedback: t(`syrEpExplain${k}Feedback`),
          correct: k === "A",
        })),
      }
    : undefined;
  return (
    <PredictReveal
      state={state}
      prompt={t("syrEpPredictPrompt", { name: t(swKey(key)) })}
      format={(v) => v.toFixed(0)}
      step={1}
      min={0}
      explain={explain}
    />
  );
}
