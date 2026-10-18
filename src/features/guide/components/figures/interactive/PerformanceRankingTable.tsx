import { useLayoutEffect, useRef } from "react";
import { useI18n, type TranslationKey } from "../../../../../i18n";
import type { FundStats, RankKey } from "../../../guide.interactive.performanceRanking.math";
import { fmt, pct } from "../figureFormat";

type Props = {
  order: FundStats[];
  market: FundStats;
  rank: Map<string, number>;
  sortKey: RankKey;
  onSort: (key: RankKey) => void;
  hovered: string | null;
  onHover: (id: string | null) => void;
};

type Column = { key: keyof FundStats; label: TranslationKey; format: (v: number) => string; sortable?: RankKey };

const COLUMNS: Column[] = [
  { key: "mu", label: "ixPrMu", format: (v) => pct(v, 1), sortable: "mu" },
  { key: "sigma", label: "ixPrSigma", format: (v) => pct(v, 0) },
  { key: "beta", label: "ixPrBeta", format: (v) => fmt(v, 2) },
  { key: "sharpe", label: "ixPrSharpe", format: (v) => fmt(v, 3), sortable: "sharpe" },
  { key: "treynor", label: "ixPrTreynor", format: (v) => pct(v, 2), sortable: "treynor" },
  { key: "alpha", label: "ixPrAlpha", format: (v) => pct(v, 2), sortable: "alpha" },
  { key: "info", label: "ixPrInfo", format: (v) => fmt(v, 3), sortable: "info" },
];

/// Fund table; clicking a measure's header ranks by it, and the rows slide to their new places (FLIP).
export default function PerformanceRankingTable({ order, market, rank, sortKey, onSort, hovered, onHover }: Props) {
  const { t } = useI18n();
  const rows = useRef(new Map<string, HTMLTableRowElement>());
  const tops = useRef(new Map<string, number>());

  useLayoutEffect(() => {
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    for (const [id, el] of rows.current) {
      const top = el.getBoundingClientRect().top;
      const before = tops.current.get(id);
      if (!still && before !== undefined && before !== top) {
        el.animate([{ transform: `translateY(${before - top}px)` }, { transform: "none" }], { duration: 260, easing: "ease-out" });
      }
      tops.current.set(id, top);
    }
  }, [sortKey]);

  const row = (f: FundStats, isMarket = false) => (
    <tr
      key={f.id}
      ref={(el) => { if (el) rows.current.set(f.id, el); else rows.current.delete(f.id); }}
      className={`pr-row${isMarket ? " is-market" : ""}${hovered === f.id ? " is-hover" : ""}`}
      tabIndex={isMarket ? undefined : 0}
      onPointerEnter={() => onHover(f.id)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(f.id)}
      onBlur={() => onHover(null)}
    >
      <td className="pr-rank">{isMarket ? "" : rank.get(f.id)}</td>
      <th scope="row">{isMarket ? t("ixPrMarket") : t("ixPrFundName", { id: f.id })}</th>
      {COLUMNS.map((c) => (
        <td key={c.key} className={c.sortable === sortKey ? "is-sorted" : undefined}>{c.format(f[c.key] as number)}</td>
      ))}
    </tr>
  );

  return (
    <div className="pr-table-wrap">
      <table className="pr-table">
        <caption className="pr-caption">{t("ixPrTableCaption")}</caption>
        <thead>
          <tr>
            <th scope="col">{t("ixPrRank")}</th>
            <th scope="col">{t("ixPrFund")}</th>
            {COLUMNS.map((c) => (
              <th key={c.key} scope="col" aria-sort={c.sortable === sortKey ? "descending" : undefined}>
                {c.sortable ? (
                  <button type="button" className={c.sortable === sortKey ? "pr-sort is-active" : "pr-sort"} aria-label={t("ixPrSortBy", { measure: t(c.label) })} onClick={() => onSort(c.sortable!)}>
                    {t(c.label)}
                    <span aria-hidden="true">{c.sortable === sortKey ? " ▾" : ""}</span>
                  </button>
                ) : (
                  t(c.label)
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {order.map((f) => row(f))}
          {row(market, true)}
        </tbody>
      </table>
    </div>
  );
}
