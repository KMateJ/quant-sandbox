import type { GameKey } from "../../components/game/gameHooks";
import type { QuoteCell } from "../../components/game/GameFrame";
import type { ObjectiveView } from "../../components/game/GamePanels";
import { money, num, signed, signedMoney } from "../../components/game/gameFormat";
import type { TranslationKey } from "../../i18n";
import { zeroRate } from "./engine/curve.math";
import type { RatesObjective } from "./engine/rates.types";
import { QUOTE_TENORS } from "./deskView.math";
import type { RatesDeskModel } from "./useRatesDesk";

type T = (key: TranslationKey, vars?: Record<string, unknown>) => string;

/// Translated mission heading and brief.
export const missionText = (id: string, t: T) => ({
  heading: t(`ratdM_${id}Title` as TranslationKey),
  brief: t(`ratdM_${id}Brief` as TranslationKey),
});

const objectiveVars = (o: RatesObjective): Record<string, string | number> => {
  switch (o.kind) {
    case "dv01Misses":
      return { band: money(o.band), allowed: o.allowed };
    case "krdMisses":
      return { limit: money(o.limit), allowed: o.allowed };
    case "pnlWithin":
      return { limit: money(o.limit) };
    case "pnlAbove":
      return { target: signedMoney(o.target) };
    case "costsBelow":
      return { limit: money(o.limit) };
  }
};

/// Translated label of one objective definition.
export const objectiveLabel = (o: RatesObjective, t: T) => t(`ratdObj_${o.kind}` as TranslationKey, objectiveVars(o));

/// Objectives as kit rows: label, status and measured value.
export function objectiveViews(desk: RatesDeskModel, t: T): ObjectiveView[] {
  return desk.objectives.map((r) => ({
    label: objectiveLabel(r.def, t),
    status: r.status,
    value: r.def.kind.endsWith("Misses") ? String(r.value) : r.def.kind === "costsBelow" ? money(r.value) : signedMoney(r.value),
  }));
}

/// Quote strip: key zeros with change since D0, 2s10s, each futures price and the hedged P&L.
export function quoteCells(desk: RatesDeskModel, t: T): QuoteCell[] {
  const { path, day, quotes, quotes0, mission, pnl } = desk;
  const z = (f: number, tt: number) => zeroRate(path[f], tt);
  const tone = (x: number) => (x > 0 ? "up" : x < 0 ? "down" : undefined);
  const zeros = QUOTE_TENORS.map((tt): QuoteCell => {
    const ch = (z(day, tt) - z(0, tt)) * 1e4;
    return { label: t("ratdQZero", { t: tt }), value: `${num(z(day, tt) * 100, 2)}% ${signed(ch, 1)}`, tone: tone(-ch) };
  });
  const slope = (z(day, 10) - z(day, 2)) * 1e4;
  const futs = mission.futures.map((f, j): QuoteCell => {
    const ch = quotes[j].F - quotes0[j].F;
    return { label: t("ratdQFuture", { id: f.id }), value: `${num(quotes[j].F, 3)} ${signed(ch, 3)}`, tone: tone(ch) };
  });
  return [...zeros, { label: t("ratdQ2s10s"), value: `${signed(slope, 1)} bp` }, ...futs, { label: t("ratdQPnl"), value: signedMoney(pnl), tone: tone(pnl) }];
}

/// Function keys F2–F9; trading keys are disabled once the run is settled.
export function deskKeys(desk: RatesDeskModel, t: T): GameKey[] {
  const live = !desk.state.settled;
  const fut = desk.mission.futures[desk.ticket.future];
  return [
    { code: "F2", label: t("ratdKeyNext"), run: () => desk.step(1), enabled: live },
    { code: "F3", label: t("ratdKeyFive"), run: () => desk.step(5), enabled: live },
    { code: "F4", label: t("ratdKeyDv01", { id: fut.id }), run: desk.hedgeDv01, enabled: live && !desk.expired[desk.ticket.future] },
    { code: "F6", label: t("ratdKeyKrd"), run: desk.hedgeKrd, enabled: live },
    { code: "F8", label: t("ratdKeyNewPath"), run: desk.newPath, enabled: true },
    { code: "F9", label: t("ratdKeyRestart"), run: desk.restart, enabled: true },
  ];
}

/// Footer status line.
export const statusLine = (desk: RatesDeskModel, t: T) =>
  desk.state.settled
    ? t("ratdStatusDone", { pnl: signedMoney(desk.pnl) })
    : t("ratdStatusLive", { net: signedMoney(desk.risk.net), misses: desk.state.misses, costs: money(desk.state.costs) });
