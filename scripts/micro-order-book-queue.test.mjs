import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const Q = await importSrc("features/order-book/queue.math.ts");
const X = await importSrc("features/order-book/execution.math.ts");
const O = await importSrc("features/order-book/orderBook.math.ts");
const B = await importSrc("lib/market/book.ts");
const spec = O.presetSpec("normal");

test("queueBlocks follows FIFO and flags your order", () => {
  let b = B.emptyBook();
  b = B.addLimit(b, { side: "buy", price: 9999, size: 300, owner: "crowd", t: 0 }).book;
  const mine = B.addLimit(b, { side: "buy", price: 9999, size: 100, owner: "you", t: 1 });
  b = B.addLimit(mine.book, { side: "buy", price: 9999, size: 50, owner: "crowd", t: 2 }).book;
  assert.deepEqual(Q.queueBlocks(b, 9999, "buy").map((q) => [q.size, q.mine]), [[300, false], [100, true], [50, false]]);
  assert.deepEqual(Q.queueBlocks(b, 9998, "buy"), []);
});

test("fill odds fall with shares ahead and stay in [0, 1]", () => {
  let prev = 1;
  for (const ahead of [0, 200, 500, 1000, 2000, 5000]) {
    const p = Q.fillOdds(ahead, spec, 60);
    assert.ok(p >= 0 && p <= 1);
    assert.ok(p <= prev + 1e-12);
    prev = p;
  }
  const rate = spec.marketRate * (1 - spec.buyShare);
  assert.ok(Math.abs(Q.expectedWait(1000, spec) - 1000 / (rate * spec.meanMarketSize + spec.cancelRate * 1000)) < 1e-12);
  assert.equal(Q.markout({ side: "buy", price: 10000, t: 0 }, () => 9995), -5);
  assert.equal(Q.markout({ side: "sell", price: 10000, t: 0 }, () => 9995), 5);
});

test("execution policies are deterministic and always complete", () => {
  for (const policy of ["oneShot", "twap10", "passive"]) {
    const a = X.runExecutionPolicy(7, spec, policy);
    assert.deepEqual(a, X.runExecutionPolicy(7, spec, policy));
    assert.ok(X.filledOf(a.fills) >= X.EXEC_TARGET);
  }
  assert.ok(X.shortfallBp([{ price: 10001, size: 100 }], 10000) > 0);
  assert.ok(X.shortfallBp([{ price: 9999, size: 100 }], 10000) < 0);
});

test("calibration: a patient limit strategy can beat the hit threshold", () => {
  const rows = [];
  for (let seed = 1; seed <= 10; seed++) {
    const [one, twap, passive] = ["oneShot", "twap10", "passive"].map((p) => X.runExecutionPolicy(seed, spec, p).shortfallBp);
    rows.push({ seed, one: +one.toFixed(2), twap: +twap.toFixed(2), passive: +passive.toFixed(2), hit: passive <= X.EXEC_HIT_FACTOR * one });
  }
  console.table(rows);
  assert.ok(rows.filter((r) => r.hit).length >= 6);
});

test("shares in front include better-priced levels", () => {
  let b = B.emptyBook();
  b = B.addLimit(b, { side: "buy", price: 10000, size: 200, owner: "crowd", t: 0 }).book;
  b = B.addLimit(b, { side: "buy", price: 9999, size: 300, owner: "crowd", t: 0 }).book;
  assert.equal(Q.sharesInFront(b, { side: "buy", price: 9999 }, 300), 500);
  assert.equal(Q.sharesInFront(b, { side: "buy", price: 10000 }, 0), 0);
});

test("challenge reducer: buys the rest at the deadline, cancels and rejoin go to the back", async () => {
  const R = await importSrc("features/order-book/simReducer.ts");
  const F = await importSrc("lib/market/flow.ts");
  const fair = F.fairPath(spec, 200, 5);
  const world = { spec, fair, draws: F.flowSchedule(spec, 200, 5), book0: F.seedBook(spec, fair[0], 5) };
  let s = R.simReducer(R.initialSim(world), { type: "startChallenge", world });
  s = R.simReducer(s, { type: "send", side: "buy", size: 2000 });
  assert.equal(s.challenge.done, false);
  while (!s.challenge.done) s = R.simReducer(s, { type: "tick", world });
  assert.equal(s.t, X.EXEC_DEADLINE);
  assert.ok(X.filledOf(s.myFills.filter((f) => f.side === "buy")) >= X.EXEC_TARGET);
  assert.equal(B.ordersOf(s.book, "you").length, 0);

  let q = R.initialSim(world);
  const bid = B.bestBid(q.book);
  q = R.simReducer(q, { type: "placeLimit", side: "buy", price: bid, size: 100 });
  const id = B.ordersOf(q.book, "you")[0].id;
  const first = B.queueAhead(q.book, id);
  q = R.simReducer(q, { type: "placeLimit", side: "buy", price: bid, size: 50 });
  q = R.simReducer(q, { type: "cancelMine", id });
  q = R.simReducer(q, { type: "placeLimit", side: "buy", price: bid, size: 100 });
  const again = B.ordersOf(q.book, "you").find((o) => o.size === 100);
  assert.ok(B.queueAhead(q.book, again.id) > first);
});
