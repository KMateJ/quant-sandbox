import { SERIES_PALETTE } from "../../../components/charts/chart.theme";
import type { NetEdge, NetNode } from "../../../components/charts/network/network.types";
import { UNIT_PRICES, indexBook, sheetOf } from "../engine/accounting.math";
import { balance, density, systemicRanking } from "../engine/metrics.math";
import { presetNetwork } from "../engine/presets.math";
import type { ExposureType, FinNetwork, InstKind, Institution } from "../engine/systemic.types";
import {
  KIND_ORDER, type CounterpartyRow, type NodeOptions, type Segment, type SystemStatsData,
} from "./network.types";

const R_MIN = 7;
const R_MAX = 24;
/// An institution whose failure alone costs more than this share of the system (DebtRank) is a single point of failure.
export const SPOF_THRESHOLD = 0.2;

/// Colour of each institution kind: the categorical chart palette in a fixed order.
export const KIND_COLOR: Record<InstKind, string> = Object.fromEntries(
  KIND_ORDER.map((k, i) => [k, SERIES_PALETTE[i]]),
) as Record<InstKind, string>;

/// Line colour of each exposure type (repo is also dashed).
export const TYPE_COLOR: Record<ExposureType, string> = { interbank: "var(--muted)", repo: "var(--primary)", derivatives: "var(--text)" };

/// Sequential fill between the surface and the accent: `t` in 0…1, darker = larger.
export const sequentialFill = (t: number) => `color-mix(in srgb, var(--primary) ${Math.round(15 + 80 * Math.min(1, Math.max(0, t)))}%, var(--surface))`;

/// "Dealer bank A": the kind's name followed by the tag.
export const instLabel = (inst: Pick<Institution, "kind" | "tag">, kindName: (kind: InstKind) => string) => `${kindName(inst.kind)} ${inst.tag}`;

/// Short code used on matrix axes, e.g. "D3".
export const instCode = (id: string) => id.toUpperCase();

/// Node radius ∝ √value, between a minimum and maximum disc.
export const radiusOf = (value: number, max: number) => R_MIN + (R_MAX - R_MIN) * Math.sqrt(Math.max(0, value) / (max || 1));

/// Chart nodes for the institutions whose kind is in `kinds`: size by assets/equity/DebtRank, colour by kind or a
/// sequential ramp of leverage / capital ratio, and a "#n" badge on the three highest DebtRanks.
export function toNetNodes(net: FinNetwork, o: NodeOptions): NetNode[] {
  const book = indexBook(net.exposures);
  const kindName = o.label ?? ((k: InstKind) => k);
  const rows = net.institutions.map((inst) => ({ inst, m: balance(inst, net, UNIT_PRICES, undefined, book) }));
  const value = (r: (typeof rows)[number]) => (o.sizeBy === "assets" ? r.m.assets : o.sizeBy === "equity" ? r.m.equity : o.debtRank?.get(r.inst.id) ?? 0);
  const max = Math.max(...rows.map(value), 0);
  const top = new Map([...(o.debtRank ?? [])].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id], i) => [id, i + 1]));
  return rows
    .filter((r) => o.kinds.has(r.inst.kind))
    .map((r) => {
      const t = o.colorBy === "leverage" ? (Number.isFinite(r.m.leverage) ? r.m.leverage / 30 : 1) : 1 - r.m.capitalRatio / 0.15;
      return {
        id: r.inst.id,
        label: instLabel(r.inst, kindName),
        radius: radiusOf(value(r), max),
        fill: o.colorBy === "kind" ? KIND_COLOR[r.inst.kind] : sequentialFill(t),
        group: r.inst.kind,
        badge: top.has(r.inst.id) ? `#${top.get(r.inst.id)}` : undefined,
      };
    });
}

/// Chart edges for the exposure `types`, lender → borrower, width ∝ √amount; with `visible` ids only edges between
/// two visible institutions. Repo is dashed.
export function toNetEdges(net: FinNetwork, types: ReadonlySet<ExposureType>, visible?: ReadonlySet<string>): NetEdge[] {
  return net.exposures
    .filter((e) => types.has(e.type) && (!visible || (visible.has(e.lender) && visible.has(e.borrower))))
    .map((e) => ({
      id: e.id,
      source: e.lender,
      target: e.borrower,
      width: 0.9 + 0.55 * Math.sqrt(e.amount),
      color: TYPE_COLOR[e.type],
      dashed: e.type === "repo",
      directed: true,
    }));
}

/// Counterparties of `id`, largest first: what it lent (`lent`) and what it owes (`borrowed`).
export function counterparties(net: FinNetwork, id: string): CounterpartyRow[] {
  const inst = net.institutions.find((i) => i.id === id);
  if (!inst) return [];
  const equity = sheetOf(inst, UNIT_PRICES, indexBook(net.exposures)).equity;
  return net.exposures
    .filter((e) => e.lender === id || e.borrower === id)
    .map((e) => ({
      exposureId: e.id,
      other: e.lender === id ? e.borrower : e.lender,
      type: e.type,
      direction: (e.lender === id ? "lent" : "borrowed") as CounterpartyRow["direction"],
      amount: e.amount,
      shareOfEquity: equity > 0 ? e.amount / equity : Infinity,
    }))
    .sort((a, b) => b.amount - a.amount);
}

const sumBy = (net: FinNetwork, pick: (e: FinNetwork["exposures"][number]) => boolean) =>
  net.exposures.filter(pick).reduce((s, e) => s + e.amount, 0);

/// Balance sheet of `inst` as two stacks of positive segments (assets, liabilities incl. equity), in $bn.
export function sheetSegments(inst: Institution, net: FinNetwork): { assets: Segment[]; liabilities: Segment[] } {
  const claim = (type: ExposureType) => sumBy(net, (e) => e.lender === inst.id && e.type === type);
  const owed = (type: ExposureType) => sumBy(net, (e) => e.borrower === inst.id && e.type === type);
  const equity = sheetOf(inst, UNIT_PRICES, indexBook(net.exposures)).equity;
  const keep = (s: Segment[]) => s.filter((x) => x.value > 1e-9);
  return {
    assets: keep([
      { key: "cash", value: inst.cash }, { key: "loans", value: inst.loans },
      { key: "gov", value: inst.holdings.gov }, { key: "corp", value: inst.holdings.corp },
      { key: "mbs", value: inst.holdings.mbs }, { key: "equityHold", value: inst.holdings.equity },
      { key: "claimInterbank", value: claim("interbank") }, { key: "claimRepo", value: claim("repo") },
      { key: "claimDerivatives", value: claim("derivatives") },
    ]),
    liabilities: keep([
      { key: "deposits", value: inst.deposits }, { key: "shortFunding", value: inst.shortFunding },
      { key: "owedInterbank", value: owed("interbank") }, { key: "owedRepo", value: owed("repo") },
      { key: "owedDerivatives", value: owed("derivatives") }, { key: "otherLiab", value: inst.otherLiab },
      { key: "equity", value: Math.max(0, equity) },
    ]),
  };
}

/// System-wide numbers for the strip above the entity panel.
export function systemStats(net: FinNetwork, ranking: { id: string; debtRank: number }[]): SystemStatsData {
  const book = indexBook(net.exposures);
  const rows = net.institutions.map((i) => balance(i, net, UNIT_PRICES, undefined, book));
  const equityOf = new Map(net.institutions.map((inst, k) => [inst.id, rows[k].equity]));
  const finite = rows.filter((r) => Number.isFinite(r.leverage));
  return {
    totalAssets: rows.reduce((s, r) => s + r.assets, 0),
    meanLeverage: finite.length ? finite.reduce((s, r) => s + r.leverage, 0) / finite.length : 0,
    density: density(net),
    largestExposure: net.exposures.reduce((m, e) => Math.max(m, e.amount / Math.max(1e-9, equityOf.get(e.lender) ?? 0)), 0),
    topDebtRank: ranking[0]?.debtRank ?? 0,
    singlePoints: ranking.filter((r) => r.debtRank > SPOF_THRESHOLD).length,
  };
}

/// Institution ids sorted by kind order, then id (matrix axes).
export const sortedIds = (net: FinNetwork) =>
  [...net.institutions].sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || a.id.localeCompare(b.id)).map((i) => i.id);

/// Lender × borrower amounts summed over the visible exposure types, in the order of `ids`.
export function visibleMatrix(net: FinNetwork, ids: string[], types: ReadonlySet<ExposureType>): number[][] {
  const at = new Map(ids.map((id, k) => [id, k]));
  const m = ids.map(() => ids.map(() => 0));
  for (const e of net.exposures) if (types.has(e.type)) m[at.get(e.lender)!][at.get(e.borrower)!] += e.amount;
  return m;
}

/// A predict round: `core-periphery` on even rounds, `random` on odd ones, a new seed every time.
export const predictNetwork = (round: number): FinNetwork => presetNetwork(round % 2 === 0 ? "core-periphery" : "random", 11 + round);

/// The institution with the highest DebtRank and the one with the largest balance sheet, plus the full ranking.
export function predictTruth(net: FinNetwork) {
  const ranking = systemicRanking(net);
  const book = indexBook(net.exposures);
  const assets = (i: Institution) => sheetOf(i, UNIT_PRICES, book).assets;
  const largest = net.institutions.reduce((m, i) => (assets(i) > assets(m) ? i : m));
  return { ranking, mostSystemic: ranking[0].id, largest: largest.id };
}
