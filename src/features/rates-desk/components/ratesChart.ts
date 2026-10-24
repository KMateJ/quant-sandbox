import { useI18n } from "../../../i18n";
import type { RatesDeskModel } from "../useRatesDesk";

/// Shared x axis for day charts: `[0, days]`, tooltip `D{day}`.
export function useDayAxis(desk: RatesDeskModel) {
  const { t } = useI18n();
  return {
    xDomain: [0, desk.mission.days] as [number, number],
    tooltipLabel: (x: number) => t("ratdChartDay", { day: Math.round(x) }),
    xFormat: (x: number) => String(Math.round(x)),
  };
}

/// Short axis label for dollar ticks: `−15k`, `+2.5k`, `400`.
export function compactTick(x: number): string {
  const a = Math.abs(x);
  const body = a >= 1000 ? `${Number((a / 1000).toFixed(a >= 10000 ? 0 : 1))}k` : String(Math.round(a));
  return (x < 0 && body !== "0" ? "−" : "") + body;
}
