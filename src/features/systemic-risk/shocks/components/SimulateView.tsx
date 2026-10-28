import { useMemo } from "react";
import { PlaybackControls } from "../../../../components/playback";
import { Panel, Workspace } from "../../../../components/layout";
import { useI18n } from "../../../../i18n";
import { equityLostPct, flowPairs } from "../shocks.math";
import type { ShocksPageState } from "../useShocksPage";
import ChannelLossChart from "./ChannelLossChart";
import ChannelShare from "./ChannelShare";
import ContagionGraph from "./ContagionGraph";
import DefaultsChart from "./DefaultsChart";
import EventTimeline from "./EventTimeline";
import PriceChart from "./PriceChart";
import ShockSetup from "./ShockSetup";
import ShockSurprises from "./ShockSurprises";

/// Simulate mode: setup | graph, playback, timeline and the three charts | outcome and the surprises.
export default function SimulateView({ page }: { page: ShocksPageState }) {
  const { t } = useI18n();
  const { net, day, result, playback, markers, rows, url } = page;
  const steps = result.days.length - 1;
  const view = useMemo(() => {
    const lost = equityLostPct(net, day);
    const badges = Object.fromEntries(Object.entries(lost).filter(([id, v]) => v >= 1 && day.status[id] !== "failed").map(([id, v]) => [id, `−${v.toFixed(0)}%`]));
    return { status: day.status, badges, pulses: flowPairs(day) };
  }, [net, day]);
  return (
    <>
      <Workspace columns="thirds" className="syr-shock-main">
        <ShockSetup page={page} />
        <div className="syr-shock-center">
          <Panel
            dominant
            flush
            title={t("syrShockGraphTitle")}
            footer={
              <>
                <PlaybackControls playback={playback} steps={steps} label={t("syrShockDayLabel")} formatStep={(v) => t("syrShockDay", { day: v })} showStepButtons showSpeed />
                <EventTimeline markers={markers} steps={steps} cursor={playback.step} onJump={playback.setStep} />
              </>
            }
          >
            <ContagionGraph net={net} view={view} selectedId={page.fail} onSelect={(id) => id && page.toggleFail(id)}
              ariaLabel={t("syrShockGraphAria")} layoutKey={`${url.net}${url.seed}`} height={540} />
          </Panel>
          <div className="syr-shock-charts">
            <DefaultsChart rows={rows.defaults} cursor={playback.step} steps={steps} />
            <ChannelLossChart rows={rows.losses} cursor={playback.step} steps={steps} />
            <PriceChart rows={rows.prices} cursor={playback.step} steps={steps} />
          </div>
        </div>
        <div className="syr-shock-side">
          <ChannelShare result={result} />
          <ShockSurprises />
        </div>
      </Workspace>
      <Panel title={t("syrShockAboutTitle")} className="syr-shock-about">
        <p>{t("syrShockAboutP1")}</p>
        <p>{t("syrShockAboutP2")}</p>
        <p>{t("syrShockAboutP3")}</p>
      </Panel>
    </>
  );
}
