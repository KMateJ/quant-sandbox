import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const D = "features/systemic-risk/";
const V = await importSrc(`${D}network/networkView.math.ts`);
const U = await importSrc(`${D}network/network.url.ts`);
const T = await importSrc(`${D}network/network.types.ts`);
const P = await importSrc(`${D}engine/presets.math.ts`);
const Ed = await importSrc(`${D}engine/edits.math.ts`);
const M = await importSrc(`${D}engine/metrics.math.ts`);

const net = P.presetNetwork("core-periphery", 1);
const ALL_KINDS = new Set(T.KIND_ORDER);
const ALL_TYPES = new Set(T.TYPE_ORDER);
const kindNames = { dealer: "Dealer bank", bank: "Bank", regional: "Regional bank", mmf: "Money market fund", hedgeFund: "Hedge fund", insurer: "Insurer", ccp: "Clearing house" };
const opts = { sizeBy: "assets", colorBy: "kind", kinds: ALL_KINDS, label: (k) => kindNames[k] };

test("toNetNodes filters by kind and sizes by the square root of the value", () => {
  const all = V.toNetNodes(net, opts);
  assert.equal(all.length, net.institutions.length);
  const banks = V.toNetNodes(net, { ...opts, kinds: new Set(["bank"]) });
  assert.ok(banks.length > 0 && banks.length < all.length);
  assert.ok(banks.every((n) => n.group === "bank"));
  const assets = (id) => M.balance(net.institutions.find((i) => i.id === id), net).assets;
  const [a, b] = [...all].sort((x, y) => assets(y.id) - assets(x.id));
  assert.ok(a.radius > b.radius);
  const max = Math.max(...all.map((n) => n.radius));
  assert.equal(max, all.find((n) => assets(n.id) === Math.max(...net.institutions.map((i) => assets(i.id)))).radius);
});

test("colour encodings: kinds use distinct palette entries, ramps vary with leverage", () => {
  const kinds = new Map(V.toNetNodes(net, opts).map((n) => [n.group, n.fill]));
  assert.equal(new Set(kinds.values()).size, kinds.size);
  const lev = V.toNetNodes(net, { ...opts, colorBy: "leverage" });
  assert.ok(new Set(lev.map((n) => n.fill)).size > 3);
  assert.ok(lev.every((n) => n.fill.startsWith("color-mix(")));
});

test("DebtRank sizing badges the top three", () => {
  const ranking = M.systemicRanking(net);
  const nodes = V.toNetNodes(net, { ...opts, sizeBy: "debtRank", debtRank: new Map(ranking.map((r) => [r.id, r.debtRank])) });
  const badged = nodes.filter((n) => n.badge);
  assert.deepEqual(badged.map((n) => n.badge).sort(), ["#1", "#2", "#3"]);
  assert.equal(nodes.find((n) => n.badge === "#1").id, ranking[0].id);
});

test("toNetEdges filters by type and visible nodes; repo is dashed, width follows the amount", () => {
  const all = V.toNetEdges(net, ALL_TYPES);
  assert.equal(all.length, net.exposures.length);
  const repo = V.toNetEdges(net, new Set(["repo"]));
  assert.ok(repo.length > 0 && repo.every((e) => e.dashed && e.directed));
  const some = new Set(net.institutions.slice(0, 5).map((i) => i.id));
  assert.ok(V.toNetEdges(net, ALL_TYPES, some).every((e) => some.has(e.source) && some.has(e.target)));
  const [big, small] = [...net.exposures].sort((x, y) => y.amount - x.amount).filter((e, i, l) => i === 0 || i === l.length - 1);
  const w = (id) => all.find((e) => e.id === id).width;
  assert.ok(w(big.id) > w(small.id));
});

test("labels never contain real firm names", () => {
  const deny = /JPMorgan|Goldman|Lehman|Citi|Barclays|HSBC|BNP|Deutsche|Morgan Stanley|Bank of America/i;
  for (const id of P.PRESET_IDS) {
    const n = P.presetNetwork(id, 2);
    for (const node of V.toNetNodes(n, opts)) assert.ok(!deny.test(node.label), node.label);
    for (const inst of n.institutions) assert.ok(!deny.test(inst.id + inst.tag));
  }
});

test("sheet segments add up to the balance sheet", () => {
  for (const inst of net.institutions) {
    const { assets, liabilities } = V.sheetSegments(inst, net);
    const m = M.balance(inst, net);
    const sum = (s) => s.reduce((t, x) => t + x.value, 0);
    assert.ok(Math.abs(sum(assets) - m.assets) < 1e-6, inst.id);
    assert.ok(Math.abs(sum(liabilities) - m.assets) < 1e-6, inst.id);
  }
});

test("counterparties and system stats", () => {
  const id = net.exposures[0].lender;
  const rows = V.counterparties(net, id);
  assert.ok(rows.length > 0 && rows.every((r) => r.amount > 0));
  assert.ok(rows.some((r) => r.direction === "lent"));
  for (let i = 1; i < rows.length; i++) assert.ok(rows[i - 1].amount >= rows[i].amount);
  const stats = V.systemStats(net, M.systemicRanking(net));
  assert.ok(stats.totalAssets > 3000 && stats.density > 0 && stats.density < 1);
  assert.ok(stats.singlePoints >= 1 && stats.topDebtRank > V.SPOF_THRESHOLD);
});

test("edits made through the form round-trip through the URL and move the metrics", () => {
  const [lender, borrower] = ["b1", "b2"];
  const before = M.systemicRanking(net);
  let edits = [];
  edits = [...edits, Ed.addEdit(edits, lender, borrower, "repo", 25)];
  const exposureId = net.exposures[0].id;
  edits = [...edits, { op: "set", id: exposureId, amount: 3 }, { op: "del", id: net.exposures[1].id }];
  const decoded = Ed.decodeEdits(Ed.encodeEdits(edits));
  assert.equal(Ed.encodeEdits(decoded), Ed.encodeEdits(edits));
  const edited = Ed.applyEdits(net, decoded);
  assert.equal(edited.exposures.length, net.exposures.length);
  assert.ok(edited.exposures.some((e) => e.id === "n1" && e.type === "repo" && e.amount === 25));
  assert.notDeepEqual(M.systemicRanking(edited), before);
  const field = U.NETWORK_SCHEMA.edits;
  assert.equal(field.parse(field.serialize(Ed.encodeEdits(edits))), Ed.encodeEdits(edits));
});

test("filter sets round-trip and everything visible is written as empty", () => {
  assert.equal(U.parseSet("", T.KIND_ORDER).size, T.KIND_ORDER.length);
  assert.equal(U.parseSet("bank,nonsense", T.KIND_ORDER).size, 1);
  assert.equal(U.formatSet(new Set(T.KIND_ORDER), T.KIND_ORDER), "");
  assert.equal(U.formatSet(new Set(["bank", "dealer"]), T.KIND_ORDER), "dealer,bank");
});

test("predict rounds alternate structures and expose the DebtRank leader", () => {
  const t0 = V.predictTruth(V.predictNetwork(0));
  const t1 = V.predictTruth(V.predictNetwork(1));
  assert.ok(V.predictNetwork(0).institutions.some((i) => i.kind === "dealer"));
  assert.ok(V.predictNetwork(1).institutions.every((i) => i.kind === "bank"));
  for (const t of [t0, t1]) assert.equal(t.mostSystemic, t.ranking[0].id);
});
