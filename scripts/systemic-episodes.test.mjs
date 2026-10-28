import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const E = "features/systemic-risk/episodes/";
const D = await importSrc(`${E}episodes.data.ts`);
const M = await importSrc(`${E}episodes.math.ts`);
const en = Object.values(await importSrc("Language/SystemicRiskEpisodes.ts"))[0];
const hu = Object.values(await importSrc("Language/SystemicRiskEpisodes.hu.ts"))[0];
const episodes = Object.values(D.EPISODES);

test("four episodes; event dates are valid, in date order, with non-decreasing model days", () => {
  assert.deepEqual(episodes.map((e) => e.id), ["gfc", "ltcm", "covid2020", "svb2023"]);
  for (const ep of episodes) {
    ep.events.forEach((ev, i) => {
      assert.match(ev.date, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(!Number.isNaN(Date.parse(ev.date)), `${ev.key} date`);
      if (i > 0) {
        assert.ok(ev.date >= ep.events[i - 1].date, `${ep.id}: ${ev.key} out of date order`);
        assert.ok(ev.day >= ep.events[i - 1].day, `${ep.id}: ${ev.key} model day goes backwards`);
      }
    });
  }
});

test("every episode run is deterministic and fits the model horizon", () => {
  for (const ep of episodes) {
    const a = M.episodeRun(ep);
    assert.deepEqual(a, M.episodeRun(ep), ep.id);
    assert.ok(ep.events.at(-1).day <= a.days.length - 1);
  }
});

test("removing each switch changes the result in the intended direction (more failures or more loss)", () => {
  for (const ep of episodes) {
    const base = M.episodeRun(ep);
    for (const sw of ep.switches) {
      const alt = M.episodeRun(ep, new Set([sw.key]));
      const moreFailures = alt.defaults.length > base.defaults.length;
      const moreLoss = alt.totalLoss > base.totalLoss + 0.2;
      assert.ok(alt.defaults.length >= base.defaults.length, `${sw.key} must not reduce failures`);
      assert.ok(moreFailures || moreLoss, `${sw.key}: ${base.defaults.length}/${base.totalLoss} -> ${alt.defaults.length}/${alt.totalLoss}`);
      const d = M.counterfactualDelta(ep, sw.key);
      assert.equal(d.defaults, alt.defaults.length - base.defaults.length);
      for (const key of sw.events) assert.ok(ep.events.some((e) => e.key === key && e.interventions.length), `${sw.key} -> ${key} has interventions`);
    }
  }
});

test("switches act on interventions only; the no-switch run keeps every intervention", () => {
  const gfc = D.EPISODES.gfc;
  const all = M.episodeRun(gfc, new Set(gfc.switches.map((s) => s.key)));
  assert.ok(all.defaults.length > M.episodeRun(gfc).defaults.length);
  assert.deepEqual(M.parseOff(gfc, "noAig,bogus"), new Set(["noAig"]));
  assert.equal(M.eventAtDay(gfc, -1), -1);
  assert.equal(gfc.events[M.eventAtDay(gfc, 25)].key, "gfcReserve");
});

test("copy: every event, episode and switch has EN and HU text, HU differs, and no firm figures appear", () => {
  const keys = (k) => [en[k], hu[k]];
  for (const ep of episodes) {
    for (const part of ["title", "period", "summary", "shows"]) for (const t of keys(`syrEpEp_${ep.id}_${part}`)) assert.ok(t, `${ep.id} ${part}`);
    for (const ev of ep.events) {
      for (const part of ["title", "text"]) {
        const [e, h] = keys(`syrEpEv_${ev.key}_${part}`);
        assert.ok(e && h, `${ev.key} ${part}`);
        assert.notEqual(e, h);
        assert.doesNotMatch(e, /\$\s?\d|\d\s?(bn|billion|trillion|million)\b/i, `${ev.key} has a figure`);
      }
      if (ev.actor) assert.ok(en[`syrEpEv_${ev.key}_actor`] && hu[`syrEpEv_${ev.key}_actor`], `${ev.key} actor caption`);
      assert.ok(en[`syrEpRole_${ev.role}`], `${ev.role} role`);
    }
    for (const sw of ep.switches) assert.ok(en[`syrEpSw_${sw.key}`] && hu[`syrEpSw_${sw.key}`], sw.key);
  }
});
