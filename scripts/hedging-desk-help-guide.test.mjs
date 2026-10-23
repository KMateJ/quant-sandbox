import test from "node:test";
import assert from "node:assert/strict";
import { importSrc } from "./lib/load-ts.mjs";

const { hedgingDeskHelpGuideEn: en } = await importSrc("Language/HedgingDeskHelpGuide.ts");
const { hedgingDeskHelpGuideHu: hu } = await importSrc("Language/HedgingDeskHelpGuide.hu.ts");
const data = await importSrc("features/hedging-desk/help/guide.data.ts");
const copy = await importSrc("features/hedging-desk/help/guideCopy.ts");
const { MISSIONS } = await importSrc("features/hedging-desk/engine/missions.data.ts");

const range = (n) => Array.from({ length: n }, (_, i) => i + 1);

const implied = [
  ...Object.entries(data.GUIDE_PLAYBOOKS).flatMap(([id, c]) => [
    ...range(c.steps).map((n) => copy.playbookStepKey(id, n)),
    ...range(c.traps).map((n) => copy.playbookTrapKey(id, n)),
  ]),
  ...data.GUIDE_PANELS.map(copy.panelKey),
  ...data.GUIDE_KEYS.map(copy.keyKey),
  ...range(data.GUIDE_MISTAKES).flatMap((n) => [copy.mistakeTitleKey(n), copy.mistakeBodyKey(n)]),
  ...data.GUIDE_TERMS.flatMap((x) => [copy.termKey(x), copy.termDefKey(x)]),
];

test("EN and HU guide tables have the same keys", () => {
  assert.deepEqual(Object.keys(hu).sort(), Object.keys(en).sort());
});

test("every key implied by guide.data exists in both languages", () => {
  for (const key of implied) {
    assert.ok(key in en, `EN missing ${key}`);
    assert.ok(key in hu, `HU missing ${key}`);
  }
});

test("every mission has a playbook", () => {
  for (const m of MISSIONS) assert.ok(data.GUIDE_PLAYBOOKS[m.id], m.id);
});

test("no HU value equals its EN value", () => {
  for (const key of Object.keys(en).filter((k) => /[A-Za-z]{3}/.test(en[k].replace(/\{\{\w+\}\}/g, ""))))
    assert.notEqual(hu[key], en[key], `untranslated: ${key}`);
});
