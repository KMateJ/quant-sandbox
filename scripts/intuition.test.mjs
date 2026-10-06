import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";
import katex from "katex";

const root = new URL("../", import.meta.url);
async function loadData(relativePath) {
  const source = await readFile(new URL(relativePath, root), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
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
  for (const section of documents.bondIntuition.sections) {
    assert.equal(documents.durationIntuition.sections.find((item) => item.id === section.id), section);
  }
});

test("literal parameter, metric and chart triggers reference their page document", async () => {
  const groups = [
    ["durationIntuition", [
      "duration-convexity/DurationConvexityView.tsx",
      "duration-convexity/components/BondParamsPanel.tsx",
      "duration-convexity/components/SensitivityChart.tsx",
    ]],
    ["bondIntuition", ["bond-pricing/Components/BondMetrics.tsx", "bond-pricing/Components/BondParameters.tsx"]],
    ["frontierIntuition", [
      "efficient-frontier/components/OptimalResult.tsx",
      "efficient-frontier/components/OptimizationControls.tsx",
      "efficient-frontier/components/OptimizationChart.tsx",
    ]],
    ["payoffIntuition", ["payoff-lab/Components/PayoffChart.tsx"]],
    ["blackScholesIntuition", ["black-scholes/useBlackScholesView.ts"]],
    ["hestonIntuition", ["heston/HestonView.tsx", "heston/useHestonView.ts"]],
    ["diffusionIntuition", ["diffusion/DiffusionControls.tsx", "diffusion/DiffusionView.tsx"]],
  ];
  for (const [documentName, files] of groups) {
    const ids = new Set(documents[documentName].sections.map((section) => section.id));
    for (const file of files) {
      const source = await readFile(new URL(`src/features/${file}`, root), "utf8");
      const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      function visit(node) {
        if (ts.isJsxAttribute(node) && node.name.getText(ast) === "sectionId" && node.initializer && ts.isStringLiteral(node.initializer)) {
          assert.ok(ids.has(node.initializer.text), `${file}: ${node.initializer.text}`);
        }
        if (ts.isPropertyAssignment(node) && ["sectionId", "intuitionSectionId"].includes(node.name.getText(ast)) && ts.isStringLiteral(node.initializer)) {
          assert.ok(ids.has(node.initializer.text), `${file}: ${node.initializer.text}`);
        }
        ts.forEachChild(node, visit);
      }
      visit(ast);
    }
  }
});
