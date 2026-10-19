import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { structuredData, ORG_ID, WEBSITE_ID } = await importSrc("seo.schema.ts");

const site = { BASE_URL: "https://example.test", SITE_NAME: "Test Site" };
const types = (blocks) => blocks.map((b) => b["@type"]);
const faq = [
  { question: "Q1?", answer: "A1." },
  { question: "Q2?", answer: "A2." },
];
const pages = {
  home: { path: "/", title: "Home", description: "The home page." },
  lab: { path: "/wacc", title: "WACC", description: "A tool.", faq, category: { key: "corporate", title: "Corporate", path: "/tvm" } },
  firstLab: { path: "/tvm", title: "TVM", description: "A tool.", category: { key: "corporate", title: "Corporate", path: "/tvm" } },
  course: { path: "/guide/x", title: "Course", description: "A course.", faq, lessons: [{ path: "/guide/x/a", title: "A" }] },
  lesson: { path: "/guide/x/a", title: "A", description: "A lesson.", parent: { path: "/guide/x", title: "Course" } },
};

test("home is a WebSite published by the Organization", () => {
  const [web, org] = structuredData(pages.home, site);
  assert.deepEqual(types([web, org]), ["WebSite", "Organization"]);
  assert.equal(web["@id"], WEBSITE_ID(site));
  assert.equal(org["@id"], ORG_ID(site));
  assert.deepEqual(web.publisher, { "@id": ORG_ID(site) });
});

test("a page with an faq gets an FAQPage with every question", () => {
  const blocks = structuredData(pages.lab, site);
  const faqPage = blocks.find((b) => b["@type"] === "FAQPage");
  assert.equal(faqPage.mainEntity.length, faq.length);
  assert.equal(faqPage.mainEntity[1].acceptedAnswer.text, "A2.");
  assert.ok(structuredData(pages.course, site).some((b) => b["@type"] === "FAQPage"));
});

test("a lab is a free WebApplication with a category breadcrumb", () => {
  const [app, crumbs] = structuredData(pages.lab, site, { dateModified: "2026-10-01" });
  assert.equal(app["@type"], "WebApplication");
  assert.equal(app.offers.price, "0");
  assert.equal(app.dateModified, "2026-10-01");
  assert.deepEqual(crumbs.itemListElement.map((i) => i.item), ["https://example.test/", "https://example.test/tvm", "https://example.test/wacc"]);
  const [, firstCrumbs] = structuredData(pages.firstLab, site);
  assert.equal(firstCrumbs.itemListElement.length, 2, "no category crumb that points at the page itself");
});

test("a lesson is a LearningResource with a 3-item breadcrumb", () => {
  const [res, crumbs] = structuredData(pages.lesson, site);
  assert.equal(res["@type"], "LearningResource");
  assert.equal(res.isPartOf.url, "https://example.test/guide/x");
  assert.equal(crumbs["@type"], "BreadcrumbList");
  assert.equal(crumbs.itemListElement.length, 3);
});

test("a course is free, online and lists its lessons", () => {
  const [course] = structuredData(pages.course, site);
  assert.equal(course["@type"], "Course");
  assert.equal(course.hasCourseInstance.courseMode, "Online");
  assert.equal(course.hasPart.length, 1);
});

test("the Organization is inline only on the home page", () => {
  for (const page of Object.values(pages)) {
    const inline = JSON.stringify(structuredData(page, site)).split('"@type":"Organization"').length - 1;
    assert.equal(inline, page.path === "/" ? 1 : 0, page.path);
  }
});

test("absent fields are omitted, never undefined or null", () => {
  for (const page of Object.values(pages)) {
    for (const block of structuredData(page, site)) {
      JSON.stringify(block, (key, value) => {
        assert.ok(value !== undefined && value !== null, `${page.path}: ${key} is ${value}`);
        return value;
      });
      assert.equal(block["@context"], "https://schema.org");
    }
  }
  assert.ok(!("dateModified" in structuredData(pages.lab, site)[0]));
});
