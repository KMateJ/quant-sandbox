import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const D = "features/market-making-desk/";
const { eventText } = await importSrc(`${D}eventText.ts`);
const dm = await importSrc(`${D}deskModel.math.ts`);
const { marketMakingDeskEn: en } = await importSrc("Language/MarketMakingDesk.ts");
const { marketMakingDeskHu: hu } = await importSrc("Language/MarketMakingDesk.hu.ts");
const { ladderRows, windowCentre } = await importSrc("lib/market/ladder.ts");
const book = await importSrc("lib/market/book.ts");

const t = (key, vars = {}) => {
  assert.ok(key in en, `missing key ${key}`);
  return en[key].replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k]));
};

test("eventText covers every MmEvent kind with real copy", () => {
  const events = [
    { t: 0, kind: "start" },
    { t: 5, kind: "fill", side: "buy", price: 99.99, size: 200 },
    { t: 6, kind: "fill", side: "sell", price: 100.01, size: 200 },
    { t: 70, kind: "hedge", side: "sell", size: 400, avg: 99.98 },
    { t: 80, kind: "limitBreach", inventory: 2200 },
    { t: 300, kind: "news", jump: -8 },
    { t: 301, kind: "requote" },
    { t: 302, kind: "pulled" },
    { t: 600, kind: "end", pnl: 123.4 },
  ];
  for (const e of events) {
    const row = eventText(e, t);
    assert.ok(row.text.length > 0 && !row.text.includes("{{"), e.kind);
    assert.equal(row.kind, en[`mmdEvKind_${e.kind}`]);
  }
  assert.equal(eventText(events[1], t).t, "00:05");
  assert.equal(eventText(events[3], t).t, "01:10");
});

test("EN/HU parity, placeholders match, HU differs", () => {
  assert.deepEqual(Object.keys(hu).sort(), Object.keys(en).sort());
  const vars = (s) => [...s.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort();
  for (const k of Object.keys(en)) {
    assert.deepEqual(vars(hu[k]), vars(en[k]), k);
    assert.notEqual(hu[k], en[k], `HU equals EN for ${k}`);
  }
});

test("offset helpers move both sides and clamp at 0.5", () => {
  const q = { bidOffset: 1.5, askOffset: 0.5 };
  assert.deepEqual(dm.widen(q), { bidOffset: 2.5, askOffset: 1.5 });
  assert.deepEqual(dm.tighten(q), { bidOffset: 0.5, askOffset: 0.5 });
  assert.deepEqual(dm.skewToSell({ bidOffset: 1.5, askOffset: 1.5 }), { bidOffset: 2.5, askOffset: 0.5 });
  assert.deepEqual(dm.skewToBuy({ bidOffset: 1.5, askOffset: 1.5 }), { bidOffset: 0.5, askOffset: 2.5 });
  assert.deepEqual(dm.skewToSell(q), { bidOffset: 2.5, askOffset: 0.5 });
});

test("clock, chart rows, ladder centre", () => {
  assert.deepEqual(dm.clockParts(305, 600), { mm: "05", ss: "05", left: 295 });
  const hist = Array.from({ length: 200 }, (_, i) => ({ t: i, mid: 100 + i * 0.001, inv: 0, pnl: 0, bid: i % 2 ? 99.99 : null, ask: 100.01 }));
  const rows = dm.chartRows(hist);
  assert.equal(rows.length, dm.CHART_WINDOW + 1);
  assert.equal(rows[0].t, 200 - dm.CHART_WINDOW - 1);
  assert.equal(rows.find((r) => r.t % 2 === 0).bid, undefined);
  assert.equal(dm.ladderCentre(hist.slice(0, 1), 0.01), 10000);
  assert.ok(Math.abs(dm.ladderCentre(hist, 0.01) - hist.at(-1).mid / 0.01) <= 3);
  assert.equal(dm.inventoryWord(-5), "short");
});

test("ladder helpers", () => {
  let b = book.emptyBook();
  b = book.addLimit(b, { side: "buy", price: 9999, size: 300, owner: "crowd", t: 0 }).book;
  b = book.addLimit(b, { side: "buy", price: 9999, size: 200, owner: "you", t: 0 }).book;
  b = book.addLimit(b, { side: "sell", price: 10001, size: 400, owner: "crowd", t: 0 }).book;
  const rows = ladderRows(b, 2, 10000, { side: "buy", size: 100 });
  assert.deepEqual(rows.map((r) => r.price), [10002, 10001, 10000, 9999, 9998]);
  const bid = rows.find((r) => r.price === 9999);
  assert.deepEqual([bid.bidSize, bid.mine.bid, bid.isBestBid], [500, 200, true]);
  assert.equal(rows.find((r) => r.price === 10001).take, 100);
  assert.equal(windowCentre(null, 10000.5), 10001);
  assert.equal(windowCentre(10000, 10002), 10000);
  assert.equal(windowCentre(10000, 10004), 10004);
});
