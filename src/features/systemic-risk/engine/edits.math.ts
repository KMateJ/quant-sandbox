import { COLLATERAL_SHARE, makeExposure } from "./build.math";
import type { Exposure, ExposureType, FinNetwork, Institution } from "./systemic.types";

/// A user change to the exposure list; added exposures get ids `n1`, `n2`, … in order.
export type Edit = { op: "add"; e: Exposure } | { op: "set"; id: string; amount: number } | { op: "del"; id: string };

const TYPE_CODE: Record<ExposureType, string> = { interbank: "i", repo: "r", derivatives: "d" };
const CODE_TYPE: Record<string, ExposureType> = { i: "interbank", r: "repo", d: "derivatives" };
const r2 = (x: number) => Math.round(x * 100) / 100;

/// The id the next `add` edit should use so that `decodeEdits(encodeEdits(edits))` reproduces it.
export const nextEditId = (edits: Edit[]) => `n${edits.filter((e) => e.op === "add").length + 1}`;

/// An `add` edit for a new exposure with the type's stylised collateral share.
export function addEdit(edits: Edit[], lender: string, borrower: string, type: ExposureType, amount: number): Edit {
  return { op: "add", e: makeExposure(nextEditId(edits), lender, borrower, type, amount) };
}

// Edits swap one asset/liability for another, so equity is unchanged: a lender funds a bigger claim from cash
// (then loans), a borrower replaces other liabilities (then short funding, then deposits) with the amount owed.
function fundDelta(inst: Institution, delta: number, side: "lender" | "borrower") {
  const fields = side === "lender" ? (["cash", "loans"] as const) : (["otherLiab", "shortFunding", "deposits"] as const);
  if (delta < 0) {
    inst[fields[0]] -= delta;
    return;
  }
  let rest = delta;
  for (const f of fields) {
    const take = Math.min(inst[f], rest);
    inst[f] -= take;
    rest -= take;
  }
}

function changeAmount(net: FinNetwork, e: Exposure, amount: number) {
  const delta = amount - e.amount;
  const by = (id: string) => net.institutions.find((i) => i.id === id)!;
  fundDelta(by(e.lender), delta, "lender");
  fundDelta(by(e.borrower), delta, "borrower");
  e.collateral = e.amount > 0 ? r2((e.collateral / e.amount) * amount) : r2(amount * COLLATERAL_SHARE[e.type]);
  e.amount = amount;
}

/// Returns a copy of `net` with `edits` applied in order; edits naming unknown ids, duplicate ids or negative
/// amounts are skipped. Equity of every institution is preserved (see `fundDelta`).
export function applyEdits(net: FinNetwork, edits: Edit[]): FinNetwork {
  const out: FinNetwork = {
    institutions: net.institutions.map((i) => ({ ...i, holdings: { ...i.holdings } })),
    exposures: net.exposures.map((e) => ({ ...e })),
    assets: net.assets.map((a) => ({ ...a })),
  };
  const known = (id: string) => out.institutions.some((i) => i.id === id);
  for (const edit of edits) {
    if (edit.op === "add") {
      const { e } = edit;
      if (!known(e.lender) || !known(e.borrower) || e.lender === e.borrower) continue;
      if (!(e.amount > 0) || out.exposures.some((x) => x.id === e.id)) continue;
      const added = { ...e, amount: 0 };
      out.exposures.push(added);
      changeAmount(out, added, e.amount);
      added.collateral = e.collateral;
    } else {
      const at = out.exposures.findIndex((x) => x.id === edit.id);
      if (at < 0) continue;
      if (edit.op === "set" && edit.amount >= 0) changeAmount(out, out.exposures[at], edit.amount);
      else if (edit.op === "del") {
        changeAmount(out, out.exposures[at], 0);
        out.exposures.splice(at, 1);
      }
    }
  }
  return out;
}

const num = (x: number) => String(r2(x));

/// URL-safe string: `a.<lender>.<borrower>.<i|r|d>.<amount>;s.<id>.<amount>;d.<id>` (ids carry no `.` or `;`).
export function encodeEdits(edits: Edit[]): string {
  return edits
    .map((e) =>
      e.op === "add" ? `a.${e.e.lender}.${e.e.borrower}.${TYPE_CODE[e.e.type]}.${num(e.e.amount)}`
        : e.op === "set" ? `s.${e.id}.${num(e.amount)}` : `d.${e.id}`,
    )
    .join(";");
}

/// Inverse of `encodeEdits`; malformed parts are ignored. Added exposures are numbered `n1`, `n2`, … in order.
export function decodeEdits(s: string): Edit[] {
  const edits: Edit[] = [];
  let adds = 0;
  for (const part of s.split(";")) {
    const f = part.split(".");
    const amount = Number(f.slice(f[0] === "a" ? 4 : 2).join("."));
    if (f[0] === "a" && f.length >= 5 && f[1] && f[2] && CODE_TYPE[f[3]] && amount > 0 && Number.isFinite(amount)) {
      edits.push({ op: "add", e: makeExposure(`n${++adds}`, f[1], f[2], CODE_TYPE[f[3]], amount) });
    } else if (f[0] === "s" && f.length >= 3 && f[1] && amount >= 0 && Number.isFinite(amount) && f[2] !== "") {
      edits.push({ op: "set", id: f[1], amount });
    } else if (f[0] === "d" && f.length === 2 && f[1]) {
      edits.push({ op: "del", id: f[1] });
    }
  }
  return edits;
}
