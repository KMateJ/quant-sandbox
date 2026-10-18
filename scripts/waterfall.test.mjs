import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const src = await readFile(new URL("../src/components/charts/waterfall.logic.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const m = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("running totals: totals stand on zero, deltas float, subtotals reset", () => {
  const bars = m.waterfallBars([
    { key: "fcf", label: "PV of FCF", value: 60 },
    { key: "tv", label: "PV of TV", value: 90 },
    { key: "ev", label: "EV", value: 150, kind: "total" },
    { key: "debt", label: "Net debt", value: -40 },
    { key: "eq", label: "Equity", value: 110, kind: "total" },
  ]);
  assert.deepEqual(bars.map((b) => [b.kind, b.start, b.end]), [
    ["total", 0, 60], ["delta", 60, 150], ["total", 0, 150], ["delta", 150, 110], ["total", 0, 110],
  ]);
});

test("domain covers zero and negative running totals", () => {
  const bars = m.waterfallBars([{ key: "a", label: "a", value: 10 }, { key: "b", label: "b", value: -25 }]);
  const [lo, hi] = m.waterfallDomain(bars);
  assert.ok(lo < -15 && hi > 10);
});
