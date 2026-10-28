import assert from "node:assert/strict";
import test from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const logic = await importSrc("components/charts/network/network.logic.ts");

const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);

test("edgeGeometry: the ends lie on the node rims", () => {
  const a = { x: 10, y: 20 };
  const b = { x: 210, y: 120 };
  for (const curve of [0, 0.14]) {
    const g = logic.edgeGeometry(a, b, 9, 13, curve);
    assert.ok(Math.abs(dist(g.start, a) - 9) < 1e-9);
    assert.ok(Math.abs(dist(g.end, b) - 13) < 1e-9);
  }
});

test("edgePath: A→B and B→A bend to opposite sides and do not coincide", () => {
  const a = { x: 0, y: 0 };
  const b = { x: 200, y: 0 };
  const ab = logic.edgeGeometry(a, b, 8, 8, 0.14);
  const ba = logic.edgeGeometry(b, a, 8, 8, 0.14);
  assert.ok(ab.control.y * ba.control.y < 0, "controls on opposite sides of the chord");
  assert.notEqual(logic.edgePath(a, b, 8, 8), logic.edgePath(b, a, 8, 8));
  assert.match(logic.edgePath(a, b, 8, 8), /^M [-\d.e]+ [-\d.e]+ Q /);
});

const nodes = Array.from({ length: 12 }, (_, i) => ({ id: String.fromCharCode(65 + i), label: "", radius: 10, fill: "x", group: `g${i % 3}` }));
const edges = nodes.slice(1).map((n, i) => ({ id: `e${i}`, source: nodes[i].id, target: n.id, width: 1, color: "x" }));

test("layoutFor is deterministic per seed and stays inside the box", () => {
  const a = logic.layoutFor(nodes, edges, 800, 460, 3);
  const b = logic.layoutFor(nodes, edges, 800, 460, 3);
  assert.deepEqual([...a.entries()], [...b.entries()]);
  assert.equal(a.size, nodes.length);
  for (const [, p] of a) assert.ok(p.x >= 0 && p.x <= 800 && p.y >= 0 && p.y <= 460, JSON.stringify(p));
  const c = logic.layoutFor(nodes, edges, 800, 460, 4);
  assert.notDeepEqual([...a.entries()], [...c.entries()]);
});

test("nearestNode picks the closest point within reach, else null", () => {
  const pts = new Map([["a", { x: 0, y: 0 }], ["b", { x: 100, y: 0 }]]);
  assert.equal(logic.nearestNode(pts, { x: 90, y: 5 }, 30), "b");
  assert.equal(logic.nearestNode(pts, { x: 50, y: 0 }, 30), null);
});

test("layoutKey follows the node set, not array identity or the edge list", () => {
  assert.equal(logic.layoutKey(nodes), logic.layoutKey([...nodes]));
  assert.notEqual(logic.layoutKey(nodes), logic.layoutKey(nodes.slice(1)));
});
