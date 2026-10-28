import { Panel } from "../../../../components/layout";
import SwitchRow from "../../../../components/SwitchRow";
import { useI18n } from "../../../../i18n";
import { swKey } from "../episodes.format";
import { runTotals } from "../episodes.math";
import type { EpisodesPage } from "../useEpisodesPage";
import CompareChart from "./CompareChart";

/// One With / Without toggle per rescue, a delta line against the as-happened run, and the comparison chart.
export default function WhatIfPanel({ page }: { page: EpisodesPage }) {
  const { t } = useI18n();
  const { episode, off, happened, whatIf } = page;
  const a = runTotals(happened);
  const b = runTotals(whatIf);
  const names = episode.switches.filter((s) => off.has(s.key)).map((s) => t(swKey(s.key))).join(", ");
  const delta = off.size
    ? t("syrEpDelta", { names, defaults: b.defaults, base: a.defaults, loss: b.loss.toFixed(0), baseLoss: a.loss.toFixed(0) })
    : t("syrEpDeltaNone");
  return (
    <Panel title={t("syrEpWhatIfTitle")} footer={<p className="syrep-delta" role="status">{delta}</p>}>
      <p className="syrep-hint">{t("syrEpSwitchHint")}</p>
      <SwitchRow
        groups={episode.switches.map((s) => ({
          key: s.key,
          options: [
            { label: t("syrEpWith", { name: t(swKey(s.key)) }), active: !off.has(s.key), onSelect: () => page.toggle(s.key, false) },
            { label: t("syrEpWithout", { name: t(swKey(s.key)) }), active: off.has(s.key), onSelect: () => page.toggle(s.key, true) },
          ],
        }))}
      />
      <CompareChart page={page} />
    </Panel>
  );
}
