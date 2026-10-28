import { useState } from "react";
import { usePlayback } from "../../components/playback";
import { useUrlState } from "../../components/useUrlState";
import { askAt, bidAt, drawTrades, flipTrade, gmPath, tradesToConfidence } from "./glostenMilgrom.math";
import type { GmParams, Trade } from "./glostenMilgrom.types";
import { GM_URL } from "./glostenMilgrom.url";

/// Lab state: URL setup, the seeded trade list with reader flips, the Bayes path and a playback cursor.
export function useGlostenMilgromLab() {
  const [url, setUrl] = useUrlState(GM_URL);
  const params: GmParams = { pi: url.pi, prior: url.prior, trueV: url.trueV === "1" ? 1 : 0, n: url.n };
  const key = `${url.seed}|${url.pi}|${url.trueV}|${url.n}`;
  const { pi, prior, trueV, n } = params;
  const seeded = drawTrades({ pi, prior, trueV, n }, url.seed);
  const [edit, setEdit] = useState<{ key: string; trades: Trade[] | null }>({ key, trades: null });
  if (edit.key !== key) setEdit({ key, trades: null });

  const trades = edit.key === key && edit.trades ? edit.trades : seeded;
  const path = gmPath(trades, pi, prior);
  const playback = usePlayback({ steps: trades.length, durationMs: trades.length * 160 });
  const cursor = playback.step;
  const now = cursor > 0 ? path[cursor - 1].next : params.prior;
  const shown = path.slice(0, cursor);

  return {
    url,
    setUrl,
    params,
    trades,
    path,
    playback,
    cursor,
    belief: now,
    spreadNow: askAt(now, pi) - bidAt(now, pi),
    buys: shown.filter((s) => s.trade === "B").length,
    sells: shown.filter((s) => s.trade === "S").length,
    toConfidence: tradesToConfidence(path, params.trueV),
    edited: edit.trades !== null,
    flip: (k: number) => setEdit({ key, trades: flipTrade(trades, k) }),
    resetEdits: () => setEdit({ key, trades: null }),
  };
}

export type GlostenMilgromLab = ReturnType<typeof useGlostenMilgromLab>;
