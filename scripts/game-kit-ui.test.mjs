import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const F = await importSrc("components/game/gameFormat.ts");
const { gameKitEn } = await importSrc("Language/GameKit.ts");
const { gameKitHu } = await importSrc("Language/GameKit.hu.ts");

test("signs use a true minus and -0 prints as 0", () => {
  assert.equal(F.signed(1234), "+1,234");
  assert.equal(F.signed(-1234), "−1,234");
  assert.equal(F.signed(-0.0001, 2), "0.00");
  assert.equal(F.num(-0, 1), "0.0");
  assert.equal(F.signedMoney(-5), "−$5");
  assert.equal(F.money(1500.4), "$1,500");
  assert.equal(F.pct(0.2234), "22.3%");
  assert.equal(F.num(NaN), "—");
});

test("toneClass maps sign to the kit classes", () => {
  assert.equal(F.toneClass(2), "gdesk-up");
  assert.equal(F.toneClass(-2), "gdesk-down");
  assert.equal(F.toneClass(0), "");
});

test("heatCell stays within its alpha bounds and is flat near zero", () => {
  assert.deepEqual(F.heatCell(0.005, 1), { alpha: 0, tone: "flat" });
  assert.deepEqual(F.heatCell(3, 0), { alpha: 0, tone: "flat" });
  const lo = F.heatCell(0.02, 1);
  const hi = F.heatCell(-5, 1);
  assert.equal(lo.tone, "up");
  assert.equal(hi.tone, "down");
  assert.ok(lo.alpha >= 0.08 && lo.alpha < 0.1);
  assert.equal(hi.alpha, 0.48);
});

test("GameKit copy: EN/HU parity and every HU value differs", () => {
  assert.deepEqual(Object.keys(gameKitHu).sort(), Object.keys(gameKitEn).sort());
  for (const k of Object.keys(gameKitEn)) {
    assert.ok(k.startsWith("gk"), k);
    assert.notEqual(gameKitHu[k], gameKitEn[k], `HU equals EN for ${k}`);
  }
});
