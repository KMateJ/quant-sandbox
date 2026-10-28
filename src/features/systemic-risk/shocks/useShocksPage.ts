import { useMemo } from "react";
import { usePlayback } from "../../../components/playback";
import { useUrlState } from "../../../components/useUrlState";
import { applyEdits, decodeEdits } from "../engine/edits.math";
import { DEFAULT_MARKET } from "../engine/market.math";
import { DEFAULT_PARAMS, presetNetwork } from "../engine/presets.math";
import { simulate } from "../engine/simulate.math";
import { ALL_CHANNELS, NO_FAIL, buildShocks, chartRows, decodeChannels, eventMarkers, failedId, runStats } from "./shocks.math";
import { SHOCKS_URL_SCHEMA } from "./shocks.url";

/// State of the shock page: the network and setup come from the URL, the contagion runs once per setup change,
/// and the playback cursor only walks through the stored days.
export function useShocksPage() {
  const [url, setUrl] = useUrlState(SHOCKS_URL_SCHEMA);
  const net = useMemo(() => applyEdits(presetNetwork(url.net, url.seed), decodeEdits(url.edits)), [url.net, url.seed, url.edits]);
  const fail = failedId(url.fail, net);
  const params = useMemo(
    () => ({ ...DEFAULT_PARAMS, channels: decodeChannels(url.ch), market: { ...DEFAULT_MARKET, seed: url.seed } }),
    [url.ch, url.seed],
  );
  const shocks = useMemo(() => buildShocks(fail, url.drop, url.shape), [fail, url.drop, url.shape]);
  const result = useMemo(() => simulate(net, shocks, params), [net, shocks, params]);
  const playback = usePlayback({ steps: params.days });
  const markers = useMemo(() => eventMarkers(result.days), [result]);
  const rows = useMemo(() => chartRows(result, net.institutions.length), [result, net]);
  const stats = useMemo(() => runStats(result), [result]);

  return {
    url, setUrl, net, fail, params, result, playback, markers, rows, stats,
    day: result.days[Math.min(playback.step, result.days.length - 1)],
    toggleFail: (id: string) => setUrl({ fail: id === fail ? NO_FAIL : id }),
    setDrop: (index: number, drop: number) => setUrl({ drop: url.drop.map((d, i) => (i === index ? drop : d)) }),
    reset: () => {
      setUrl({ fail: "", drop: [0, 0, 0, 0], shape: "instant", ch: ALL_CHANNELS });
      playback.setStep(params.days);
    },
  };
}

export type ShocksPageState = ReturnType<typeof useShocksPage>;
