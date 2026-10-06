import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";
import katex from "katex";

const root = new URL("../", import.meta.url);
async function dataModuleUrl(relativePath, dependencies = {}) {
  const source = await readFile(new URL(relativePath, root), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  let resolved = outputText;
  for (const [specifier, url] of Object.entries(dependencies)) {
    resolved = resolved.replaceAll(JSON.stringify(specifier), JSON.stringify(url));
  }
  return `data:text/javascript;base64,${Buffer.from(resolved).toString("base64")}`;
}
async function loadData(relativePath, dependencies) {
  return import(await dataModuleUrl(relativePath, dependencies));
}

const documents = await loadData("src/modules/intuition.ts");
const translations = { en: {}, hu: {} };
for (const file of await readdir(new URL("src/Language/", root))) {
  if (!file.endsWith(".ts")) continue;
  for (const [name, values] of Object.entries(await loadData(`src/Language/${file}`))) {
    const language = name.endsWith("En") ? "en" : name.endsWith("Hu") ? "hu" : undefined;
    if (language) Object.assign(translations[language], values);
  }
}

test("documents use unique stable IDs and complete English/Hungarian content", () => {
  for (const [name, document] of Object.entries(documents)) {
    assert.ok(document.sections.length > 0, name);
    const ids = document.sections.map((section) => section.id);
    assert.equal(new Set(ids).size, ids.length, `${name}: duplicate IDs`);
    for (const id of ids) assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    const keys = [
      document.titleKey,
      ...document.sections.flatMap((section) =>
        [section.titleKey, section.summaryKey, section.bodyKey, section.exampleKey].filter(Boolean)),
    ];
    for (const language of ["en", "hu"]) {
      for (const key of keys) assert.ok(translations[language][key]?.trim(), `${name}: missing ${language}.${key}`);
    }
  }
});

test("every document equation renders through KaTeX without errors", () => {
  for (const document of Object.values(documents)) {
    for (const section of document.sections) {
      if (section.formula) assert.doesNotThrow(() => katex.renderToString(section.formula, { throwOnError: true }));
    }
  }
});

test("bond and duration documents reuse the same explanatory section objects", () => {
  const shared = documents.bondIntuition.sections.filter((section) =>
    documents.durationIntuition.sections.some((item) => item.id === section.id));
  assert.equal(shared.length, 9);
  for (const section of shared) {
    assert.equal(documents.durationIntuition.sections.find((item) => item.id === section.id), section);
  }
});

test("literal parameter, metric and chart triggers reference their page document", async () => {
  const groups = [
    ["durationIntuition", [
      "duration-convexity/DurationConvexityView.tsx",
      "duration-convexity/components/BondParamsPanel.tsx",
      "duration-convexity/components/SensitivityChart.tsx",
      "duration-convexity/components/ErrorChart.tsx",
      "duration-convexity/components/YieldShockControl.tsx",
      "duration-convexity/components/ShockResult.tsx",
    ]],
    ["bondIntuition", [
      "bond-pricing/BondPricingView.tsx", "bond-pricing/Components/BondMetrics.tsx",
      "bond-pricing/Components/BondParameters.tsx", "bond-pricing/Components/CashFlowTimeline.tsx",
      "bond-pricing/Components/PresentValueTable.tsx", "bond-pricing/Components/PyOverlayControls.tsx",
      "bond-pricing/Components/PriceYieldExplorer.tsx",
    ]],
    ["frontierIntuition", [
      "efficient-frontier/PortfolioOptimizationView.tsx",
      "efficient-frontier/frontier.controls.ts",
      "efficient-frontier/components/OptimalResult.tsx",
      "efficient-frontier/components/OptimizationControls.tsx",
      "efficient-frontier/components/OptimizationChart.tsx",
    ]],
    ["payoffIntuition", ["payoff-lab/Components/PayoffChart.tsx"]],
    ["blackScholesIntuition", ["black-scholes/useBlackScholesView.ts"]],
    ["binomialIntuition", [
      "binomial/binomial.controls.ts", "binomial/BinomialView.tsx",
      "binomial/components/BinomialControls.tsx", "binomial/components/BinomialSummary.tsx",
      "binomial/components/BinomialReplication.tsx", "binomial/components/BinomealTreeCharts.tsx",
    ]],
    ["hestonIntuition", [
      "heston/HestonView.tsx", "heston/useHestonView.ts", "heston/heston.controls.ts",
      "heston/components/HestonControls.tsx", "heston/components/HestonGreeksChart.tsx",
      "heston/components/HestonGreeksSummary.tsx", "heston/components/HestonPathsChart.tsx",
      "heston/components/HestonVarianceChart.tsx", "heston/components/HestonPriceComparisonChart.tsx",
      "heston/components/HestonSmileChart.tsx",
    ]],
    ["diffusionIntuition", ["diffusion/DiffusionControls.tsx", "diffusion/DiffusionView.tsx"]],
  ];
  for (const [documentName, files] of groups) {
    const ids = new Set(documents[documentName].sections.map((section) => section.id));
    for (const file of files) {
      const source = await readFile(new URL(`src/features/${file}`, root), "utf8");
      const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      function checkSection(expression) {
        if (ts.isStringLiteral(expression)) {
          assert.ok(ids.has(expression.text), `${file}: ${expression.text}`);
        } else if (ts.isJsxExpression(expression) && expression.expression) {
          checkSection(expression.expression);
        } else if (ts.isConditionalExpression(expression)) {
          checkSection(expression.whenTrue);
          checkSection(expression.whenFalse);
        }
      }
      function visit(node) {
        if (ts.isJsxAttribute(node) && node.name.getText(ast) === "sectionId" && node.initializer) {
          checkSection(node.initializer);
        }
        if (ts.isPropertyAssignment(node) && ["sectionId", "intuitionSectionId"].includes(node.name.getText(ast))) {
          checkSection(node.initializer);
        }
        ts.forEachChild(node, visit);
      }
      visit(ast);
    }
  }
});

test("shared bond concepts match price scaling, par and zero-coupon conventions", async () => {
  const { bondPrice, macaulayDuration, modifiedDuration, convexity } = await loadData("src/lib/finance/bond.ts");
  for (const freq of [1, 2, 4]) {
    const args = [0.05, 0.06, 10, freq];
    const price = bondPrice(100, ...args);
    assert.ok(Math.abs(bondPrice(200, ...args) - 2 * price) < 1e-10);
    assert.ok(Math.abs(bondPrice(100, 0.05, 0.05, 10, freq) - 100) < 1e-10);
    assert.ok(bondPrice(100, 0.05, 0.04, 10, freq) > 100);
    assert.ok(price < 100);
    for (const measure of [macaulayDuration, modifiedDuration, convexity]) {
      assert.ok(Math.abs(measure(100, ...args) - measure(200, ...args)) < 1e-10);
    }
    assert.ok(Math.abs(macaulayDuration(100, 0, 0.06, 10, freq) - 10) < 1e-10);
    assert.ok(Math.abs(modifiedDuration(100, ...args) - macaulayDuration(100, ...args) / (1 + 0.06 / freq)) < 1e-10);
  }
});

test("Duration shock units, signed errors, price-bp magnitudes and yield floor match the explanations", async () => {
  const bondUrl = await dataModuleUrl("src/lib/finance/bond.ts");
  const { bondPrice, bondMeasures, shockResult, priceChangeCurve, errorCurve } = await loadData(
    "src/features/duration-convexity/durationConvexity.math.ts",
    { "../../lib/finance/bond": bondUrl },
  );
  const p = { face: 100, couponRate: 0.04, ytm: 0.06, years: 20, freq: 2 };
  const m = bondMeasures(p);
  const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`);
  for (const bp of [-200, -150, 0, 1, 150, 200]) {
    const r = shockResult(p, m, bp);
    const dy = bp / 10000;
    close(r.newPrice, bondPrice(p.face, p.couponRate, p.ytm + dy, p.years, p.freq));
    close(r.exactPct, 100 * (r.newPrice - m.price) / m.price);
    close(r.durationPct, -m.modified * dy * 100);
    close(r.durConvexPct, (-m.modified * dy + 0.5 * m.convexity * dy ** 2) * 100);
    close(r.durationErrPct, r.durationPct - r.exactPct);
    close(r.durConvexErrPct, r.durConvexPct - r.exactPct);
    close(r.durationErrBp, 100 * Math.abs(r.durationErrPct));
    close(r.durConvexErrBp, 100 * Math.abs(r.durConvexErrPct));
    if (bp !== 0) {
      assert.equal(Math.sign(r.exactPct), -Math.sign(bp));
      assert.ok(r.durationErrPct < 0);
      assert.ok(Math.abs(r.durConvexErrPct) < Math.abs(r.durationErrPct));
    } else {
      for (const key of ["exactPct", "durationPct", "durConvexPct", "durationErrPct", "durConvexErrPct"]) {
        close(r[key], 0);
      }
    }
  }
  const curve = priceChangeCurve(p, m, 200, 80);
  const errors = errorCurve(p, m, 200, 80);
  assert.equal(curve.length, 81);
  for (const [i, point] of curve.entries()) {
    const r = shockResult(p, m, point.dyBp);
    close(point.exact, r.exactPct);
    close(errors[i].durationError, r.durationErrPct);
    close(errors[i].durConvexError, r.durConvexErrPct);
  }
  const low = { ...p, ytm: 0.001 };
  const lowMeasures = bondMeasures(low);
  const floored = shockResult(low, lowMeasures, -200);
  close(floored.newPrice, bondPrice(low.face, low.couponRate, 1e-6, low.years, low.freq));
  close(floored.durationPct, lowMeasures.modified * 0.02 * 100);
});

test("all 13 shared Heston descriptors preserve parameter behavior and map to intuition", async () => {
  const { createHestonSliders } = await loadData("src/features/heston/heston.controls.ts");
  const expected = [
    ["S0", "S0", "setS0", "spot-strike", 20, 200, 1],
    ["K", "strike", "setStrike", "spot-strike", 20, 200, 1],
    ["r", "rate", "setRate", "rho", 0, 0.2, 0.005],
    ["v0", "v0", "setV0", "stochastic-volatility", 0.0001, 0.25, 0.0025],
    ["theta", "theta", "setTheta", "mean-reversion", 0.0001, 0.25, 0.0025],
    ["kappa", "kappa", "setKappa", "mean-reversion", 0.1, 10, 0.1],
    ["xi", "xi", "setXi", "vol-of-vol", 0.01, 2, 0.01],
    ["rho", "rho", "setRho", "correlation", -0.99, 0.99, 0.01],
    ["T", "maturity", "setMaturity", "maturity", 0.25, 10, 0.25],
    ["steps", "steps", "setSteps", "time-steps", 25, 500, 25],
    ["paths", "pathCount", "setPathCount", "visual-paths", 1, 30, 1],
    ["pSteps", "pricingSteps", "setPricingSteps", "time-steps", 25, 400, 25],
    ["pPaths", "pricingPaths", "setPricingPaths", "pricing-paths", 100, 2000, 100],
  ];
  const values = Object.fromEntries(expected.map(([, field], i) => [field, i + 1]));
  const calls = [];
  const setters = Object.fromEntries(expected.map(([, , setter]) =>
    [setter, (value) => calls.push([setter, value])]));
  const ids = new Set(documents.hestonIntuition.sections.map((section) => section.id));
  for (const language of ["en", "hu"]) {
    const sliders = createHestonSliders(values, setters, (key) => {
      assert.ok(translations[language][key]?.trim(), `${language}.${key}`);
      return translations[language][key];
    });

    assert.equal(sliders.length, 13);
    assert.equal(new Set(sliders.map((slider) => slider.key)).size, 13);
    sliders.forEach((slider, i) => {
      const [key, field, setter, sectionId, min, max, step] = expected[i];
      assert.deepEqual([slider.key, slider.sectionId, slider.min, slider.max, slider.step],
        [key, sectionId, min, max, step]);
      assert.ok(ids.has(slider.sectionId));
      assert.equal(slider.value, values[field]);
      assert.equal(slider.onChange, setters[setter]);
      slider.onChange(42);
      assert.deepEqual(calls.at(-1), [setter, 42]);
      if (key === "T") assert.equal(slider.format(1.5), `1.50 ${translations[language].hestonYears}`);
    });
  }
});

test("Frontier targets select nearest samples and help covers all conditional numeric fields", async () => {
  const matrixUrl = await dataModuleUrl("src/lib/math/matrix.ts");
  const { pointAtReturn, pointAtVol, boundsFromConstraints, summarize } = await loadData(
    "src/features/efficient-frontier/portfolioOptimization.math.ts",
    { "../../lib/math/matrix": matrixUrl },
  );
  const points = [
    { ret: 0.04, vol: 0.12, weights: [1, 0], sharpe: 0.08 },
    { ret: 0.08, vol: 0.10, weights: [0.5, 0.5], sharpe: 0.5 },
    { ret: 0.12, vol: 0.18, weights: [0, 1], sharpe: 0.5 },
  ];
  assert.equal(pointAtReturn(points, 0.02), points[1]);
  assert.equal(pointAtReturn(points, 0.11), points[2]);
  assert.equal(pointAtReturn(points, 0.5), points[2]);
  assert.equal(pointAtVol(points, 0.05), points[1]);
  assert.equal(pointAtVol(points, 0.17), points[2]);
  const constraints = {
    longOnly: true, allowShort: false, minWeight: -0.3, maxWeight: 1,
    useRiskFree: false, riskFree: 0.03, allowLeverage: false, maxGross: 1,
  };
  assert.deepEqual(boundsFromConstraints(constraints, 2), { lo: [0, 0], hi: [1, 1] });
  assert.deepEqual(boundsFromConstraints({ ...constraints, allowShort: true }, 2), { lo: [-0.3, -0.3], hi: [1, 1] });
  assert.deepEqual(boundsFromConstraints({ ...constraints, allowLeverage: true, maxGross: 3 }, 2),
    boundsFromConstraints(constraints, 2));
  const weights = [0.5, 0.5], mus = [0.08, 0.12], cov = [[0.04, 0], [0, 0.09]];
  const a = summarize(weights, mus, cov, 0.03), b = summarize(weights, mus, cov, 0.05);
  assert.equal(a.ret, b.ret);
  assert.equal(a.vol, b.vol);
  assert.ok(a.sharpe > b.sharpe);
  const { frontierObjectives } = await loadData("src/features/efficient-frontier/frontier.controls.ts");
  assert.deepEqual(Object.values(frontierObjectives).map((o) => o.sectionId),
    ["efficient-frontier", "sharpe-ratio", "target-return", "target-volatility"]);
  const ids = new Set(documents.frontierIntuition.sections.map((s) => s.id));
  for (const objective of Object.values(frontierObjectives)) {
    assert.ok(ids.has(objective.sectionId));
    for (const language of ["en", "hu"]) assert.ok(translations[language][objective.labelKey]);
  }
  const source = await readFile(new URL("src/features/efficient-frontier/components/OptimizationControls.tsx", root), "utf8");
  const ast = ts.createSourceFile("controls.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const fields = [];
  function visit(node) {
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(ast) === "NumberInput") {
      const attr = node.attributes.properties.find((p) => ts.isJsxAttribute(p) && p.name.getText(ast) === "sectionId");
      assert.ok(attr && ts.isStringLiteral(attr.initializer), "Numeric field needs a stable topic");
      fields.push(attr.initializer.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.deepEqual(fields, ["target-return", "target-volatility", "weight-bounds", "weight-bounds", "risk-free-rate", "gross-exposure"]);
});

test("Heston metric choices have valid sections, sharing only compatible Black-Scholes explanations", async () => {
  const { HESTON_GREEKS } = await loadData("src/features/heston/heston.greeks.ts");
  assert.deepEqual(HESTON_GREEKS.map((metric) => metric.key), ["delta", "gamma", "vega", "theta", "rho"]);
  for (const metric of HESTON_GREEKS) {
    const section = documents.hestonIntuition.sections.find((item) => item.id === metric.key);
    const bsSection = documents.blackScholesIntuition.sections.find((item) => item.id === metric.key);
    assert.ok(section);
    for (const language of ["en", "hu"]) assert.ok(translations[language][metric.labelKey]?.trim());
    if (metric.key === "vega") {
      assert.notEqual(section.bodyKey, bsSection.bodyKey);
      assert.match(translations.en[section.bodyKey], /bumps √v₀/);
    } else {
      assert.equal(section, bsSection);
    }
  }
});

test("tooltip placement flips near the top and stays within viewport edges", async () => {
  const { positionTooltip } = await loadData("src/components/ui/tooltip.math.ts");
  const viewport = { width: 320, height: 640 };
  const bubble = { width: 260, height: 60 };
  const anchors = [
    { left: 0, right: 18, top: 120, bottom: 138 },
    { left: 302, right: 320, top: 120, bottom: 138 },
    { left: 150, right: 168, top: 2, bottom: 20 },
    { left: 150, right: 168, top: 620, bottom: 638 },
    { left: 150, right: 168, top: 300, bottom: 318 },
  ];
  for (const anchor of anchors) {
    const { left, top } = positionTooltip(anchor, bubble, viewport);
    assert.ok(left >= 8 && left + bubble.width <= viewport.width - 8);
    assert.ok(top >= 8 && top + bubble.height <= viewport.height - 8);
  }
  assert.equal(positionTooltip(anchors[2], bubble, viewport).top, 26);
  assert.equal(positionTooltip(anchors[3], bubble, viewport).top, 554);
  assert.equal(positionTooltip(anchors[4], bubble, viewport).top, 234);
  assert.deepEqual(positionTooltip(anchors[2], { width: 304, height: 624 }, viewport),
    { left: 8, top: 8 });
});

test("both Binomial modes preserve shared descriptor ranges, handlers and contextual targets", async () => {
  const { createBinomialSliders } = await loadData("src/features/binomial/binomial.controls.ts");
  const common = ["steps", "steps", "onStepsChange", "tree-horizon", 1, 8, 1];
  const cases = {
    equity: [
      ["s0", "S0", "onS0Change", "spot-strike", 20, 200, 1],
      ["k", "K", "onKChange", "spot-strike", 20, 200, 1],
      ["u", "u", "onUChange", "up-down-factors", 1.01, 2, 0.01],
      ["d", "d", "onDChange", "up-down-factors", 0.1, 0.99, 0.01],
      ["r", "r", "onRChange", "discounting", 0, 0.3, 0.01], common,
    ],
    rates: [
      ["r0", "r", "onRChange", "short-rate-tree", 0, 0.3, 0.01],
      ["q", "q", "onQChange", "rate-probability", 0, 1, 0.01],
      ["h", "h", "onHChange", "rate-step-size", 0.02, 0.7, 0.01], common,
    ],
  };
  const ids = new Set(documents.binomialIntuition.sections.map((section) => section.id));
  for (const [mode, expected] of Object.entries(cases)) {
    const values = Object.fromEntries(expected.map(([, field], i) => [field, i + 1]));
    const calls = [];
    const handlers = Object.fromEntries(expected.map(([, , handler]) =>
      [handler, (value) => calls.push([handler, value])]));
    for (const language of ["en", "hu"]) {
      const sliders = createBinomialSliders({ ...values, mode }, handlers, (key) => {
        assert.ok(translations[language][key]?.trim(), `${language}.${key}`);
        return translations[language][key];
      });
      assert.equal(sliders.length, expected.length);
      assert.equal(new Set(sliders.map((slider) => slider.key)).size, sliders.length);
      sliders.forEach((slider, i) => {
        const [key, field, handler, sectionId, min, max, step] = expected[i];
        assert.deepEqual([slider.key, slider.sectionId, slider.min, slider.max, slider.step],
          [key, sectionId, min, max, step]);
        assert.ok(ids.has(slider.sectionId));
        assert.equal(slider.value, values[field]);
        assert.equal(slider.onChange, handlers[handler]);
        slider.onChange(7);
        assert.deepEqual(calls.at(-1), [handler, 7]);
        assert.equal(slider.format(2), step === 1 ? "2" : "2.00");
      });
    }
  }
});

test("Binomial prices, horizon, replication and extracted chart geometry preserve model behavior", async () => {
  const { buildBinomialTree, buildRateTree } = await loadData("src/features/binomial/binomial.math.ts");
  const { buildBinomialChartLayout } = await loadData("src/features/binomial/binomial.layout.math.ts");
  for (const steps of [1, 4, 8]) {
    for (const optionKind of ["call", "put"]) {
      const tree = buildBinomialTree({ S0: 100, K: 100, u: 1.2, d: 0.85, r: 0.05, steps, optionKind });
      assert.equal(tree.isValid, true);
      assert.equal(tree.maturity, steps);
      assert.equal(tree.deltaT, 1);
      const portfolio = tree.replicatingPortfolio;
      assert.ok(Math.abs(portfolio.delta * 100 + portfolio.bond - tree.price) < 1e-10);
      if (steps === 1) assert.ok(Math.abs(tree.price - (optionKind === "call" ? 10.884353741496598 : 6.122448979591837)) < 1e-10);
      for (const vertical of [false, true]) {
        const layout = buildBinomialChartLayout(tree, vertical);
        assert.equal(layout.nodes.length, (steps + 1) * (steps + 2) / 2);
        assert.equal(layout.edges.length, steps * (steps + 1));
        assert.equal(layout.width, vertical ? 80 * steps + 90 : tree.width);
        assert.equal(layout.height, vertical ? 92 * steps + 76 : tree.height);
        for (const { node, x, y } of layout.nodes) {
          assert.equal(x, vertical ? layout.width / 2 + (2 * node.upMoves - node.step) * 40 - 33 : node.x);
          assert.equal(y, vertical ? 16 + node.step * 92 : node.y);
        }
      }
    }
  }
  const zero = buildRateTree({ r0: 0, h: 0.18, q: 0.8, steps: 4 });
  assert.equal(zero.price, 1);
  const one = buildRateTree({ r0: 0.05, h: 0.18, q: 0.8, steps: 1 });
  assert.equal(one.price, 1 / 1.05);
  assert.equal(one.q, 0.8);
  const invalid = buildBinomialTree({ S0: 100, K: 100, u: 1.01, d: 0.99, r: 0.3, steps: 4, optionKind: "call" });
  assert.equal(invalid.isValid, false);
  assert.equal(invalid.validationKey, "binomialValidationQOutOfRange");
});
