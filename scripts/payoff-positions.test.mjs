import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const cache = new Map();

/// Transpiles a TS module and its relative imports into data: URLs (type-only imports vanish).
async function load(url) {
  if (cache.has(url.href)) return cache.get(url.href);
  const source = await readFile(url, "utf8");
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  for (const [, spec] of outputText.matchAll(/from "(\.{1,2}\/[^"]+)"/g)) {
    const dep = await load(new URL(`${spec}.ts`, url));
    outputText = outputText.replaceAll(`"${spec}"`, `"${dep}"`);
  }
  const dataUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
  cache.set(url.href, dataUrl);
  return dataUrl;
}

const dir = new URL("../src/features/payoff-lab/", import.meta.url);
const pos = await import(await load(new URL("payoff.positions.ts", dir)));
const math = await import(await load(new URL("payoff.math.ts", dir)));
const url = await import(await load(new URL("payoff.url.ts", dir)));

const legs = [
  { id: "a", type: "call", direction: "long", quantity: 1, strike: 95, premium: 7 },
  { id: "b", type: "call", direction: "short", quantity: 1, strike: 105, premium: 3 },
  { id: "c", type: "put", direction: "long", quantity: 2, strike: 90, premium: 1 },
];

test("a short ×2 position scales and flips every member", () => {
  const groups = [{ id: "g", name: "Spread", direction: "short", quantity: 2 }];
  const grouped = legs.map((l) => (l.id === "c" ? l : { ...l, groupId: "g" }));
  const flat = pos.flattenPositions(grouped, groups);
  for (const S of [80, 95, 100, 110, 130]) {
    const spread = Math.min(Math.max(S - 95, 0), 10);
    const expected = -2 * spread + 2 * Math.max(90 - S, 0);
    assert.ok(Math.abs(math.getStrategyValue(flat, S, "payoff") - expected) < 1e-12, `S=${S}`);
  }
  assert.equal(pos.netCost(flat.slice(0, 2)), -8);
});

test("ungrouping bakes the position into its legs without changing the payoff", () => {
  const grouped = pos.groupLegs(legs, [], new Set(["a", "b"]), "Spread");
  const shorted = { ...grouped, groups: grouped.groups.map((g) => ({ ...g, direction: "short", quantity: 3 })) };
  const before = pos.flattenPositions(shorted.legs, shorted.groups);
  const after = pos.ungroup(shorted.legs, shorted.groups, shorted.groups[0].id);
  assert.equal(after.groups.length, 0);
  assert.ok(after.legs.every((l) => l.groupId === undefined));
  for (const S of [50, 97, 104, 140]) {
    assert.equal(math.getStrategyValue(after.legs, S, "profit"), math.getStrategyValue(before, S, "profit"));
  }
});

test("components show a position as one curve next to stand-alone legs", () => {
  const grouped = pos.groupLegs(legs, [], new Set(["a", "b"]), "Spread");
  const components = pos.positionComponents(grouped.legs, grouped.groups, (i) => `Leg ${i + 1}`);
  assert.deepEqual(components.map((c) => c.label), ["Spread", "Leg 3"]);
  assert.equal(components[0].legs.length, 2);
});

test("positions survive the URL round trip", () => {
  const grouped = pos.groupLegs(legs, [], new Set(["a", "c"]), "My~hedge|1");
  const groups = grouped.groups.map((g) => ({ ...g, direction: "short", quantity: 1.5 }));
  const params = url.buildSearchParams("payoff", true, null, grouped.legs, groups);
  const state = url.readUrlState(params);
  assert.equal(state.groups.length, 1);
  assert.equal(state.groups[0].name, "My hedge 1");
  assert.equal(state.groups[0].direction, "short");
  assert.equal(state.groups[0].quantity, 1.5);
  assert.deepEqual(state.legs.map((l) => Boolean(l.groupId)), [true, false, true]);
});

test("adding a leg to an existing position keeps that leg's payoff", () => {
  const grouped = pos.groupLegs(legs, [], new Set(["a", "b"]), "Spread");
  const groups = grouped.groups.map((g) => ({ ...g, direction: "short", quantity: 2 }));
  const before = pos.flattenPositions(grouped.legs, groups);
  const after = pos.addToGroup(grouped.legs, groups, new Set(["c"]), groups[0].id);
  assert.equal(after.legs.find((l) => l.id === "c").groupId, groups[0].id);
  const flat = pos.flattenPositions(after.legs, after.groups);
  for (const S of [70, 90, 100, 120]) {
    assert.ok(Math.abs(math.getStrategyValue(flat, S, "profit") - math.getStrategyValue(before, S, "profit")) < 1e-12);
  }
});
