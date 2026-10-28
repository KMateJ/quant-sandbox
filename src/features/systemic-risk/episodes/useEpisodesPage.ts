import { useEffect, useMemo, useState } from "react";
import { usePlayback } from "../../../components/playback";
import { useUrlState } from "../../../components/useUrlState";
import { EPISODES } from "./episodes.data";
import { episodeNetwork, episodeRun, eventAtDay, parseOff, runSeries } from "./episodes.math";
import type { EpisodeId } from "./episodes.types";
import { EPISODES_URL_SCHEMA } from "./episodes.url";

/// State of the episodes page: URL-held episode, switches and day cursor, the as-happened and what-if runs, and playback.
export function useEpisodesPage() {
  const [url, setUrl] = useUrlState(EPISODES_URL_SCHEMA);
  const episode = EPISODES[url.ep];
  const off = useMemo(() => parseOff(episode, url.off), [episode, url.off]);
  const net = useMemo(() => episodeNetwork(episode), [episode]);
  const happened = useMemo(() => episodeRun(episode), [episode]);
  const whatIf = useMemo(() => (off.size ? episodeRun(episode, off) : happened), [episode, off, happened]);
  const rows = useMemo(() => {
    const a = runSeries(happened);
    const b = runSeries(whatIf);
    return a.map((r, i) => ({ day: r.day, defaults: r.defaults, loss: r.loss, wDefaults: b[i].defaults, wLoss: b[i].loss }));
  }, [happened, whatIf]);

  const steps = happened.days.length - 1;
  const playback = usePlayback({ steps, initial: Math.min(url.day, steps), durationMs: 9000 });
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    if (!playback.playing && playback.step !== url.day) setUrl({ day: playback.step });
  }, [playback.playing, playback.step, url.day, setUrl]);

  const atDay = eventAtDay(episode, playback.step);
  const current = picked !== null && episode.events[picked]?.day === playback.step ? picked : atDay;

  const jumpTo = (index: number) => {
    setPicked(index);
    playback.setStep(episode.events[index].day);
  };
  const pick = (ep: EpisodeId) => {
    setPicked(null);
    playback.setStep(0);
    setUrl({ ep, off: "", day: 0 });
  };
  const toggle = (key: string, disabled: boolean) => {
    const next = new Set(off);
    if (disabled) next.add(key);
    else next.delete(key);
    setUrl({ off: [...next].join(",") });
  };

  return {
    url, episode, off, net, happened, whatIf, rows, steps, playback, current, jumpTo, pick, toggle,
    reset: () => pick("gfc"),
  };
}

export type EpisodesPage = ReturnType<typeof useEpisodesPage>;
