import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { lessonToMarkdown } = await importSrc("features/guide/guide.markdown.ts");
const { wacc } = await importSrc("Language/guides/wacc.ts");

const labels = {
  practice: "Practice questions",
  answer: "Answer",
  figure: "Interactive figure",
  workedExample: "Worked example",
  labs: "Interactive labs",
  source: "Source",
  previous: "Previous lesson",
  next: "Next lesson",
};

const base = {
  title: "Lesson",
  description: "What it covers.",
  url: "https://example.com/guide/t/lesson",
  labs: [],
  labels,
};

test("every block kind maps to Markdown, with checks collected at the end", () => {
  const blocks = [
    { kind: "h", text: "Heading" },
    { kind: "p", text: "Text with $x^2$ and **bold**." },
    { kind: "check", id: "l/a", prompt: "Pick one.", answer: { type: "choice", options: ["No", "Yes"], correct: 1 }, explain: "Because." },
    { kind: "note", text: "Remember this." },
    { kind: "math", tex: "a = b" },
    { kind: "list", items: ["one", "two"] },
    { kind: "list", items: ["first", "second"], ordered: true },
    { kind: "figure", id: "npv-profile" },
    { kind: "lab", to: "/wacc", text: "Try it" },
    {
      kind: "worked",
      title: "Example",
      steps: [
        { text: "Step one.", tex: "x", result: { value: 5, tolerance: 0.1, unit: "%" } },
        { text: "Step two.", result: { value: 3, tolerance: 0.1, unit: "years" } },
        { text: "Step three." },
      ],
    },
    { kind: "check", id: "l/b", prompt: "How much?", answer: { type: "number", value: 9, tolerance: 0.1, unit: "%" }, explain: "Add them." },
  ];
  const md = lessonToMarkdown({
    ...base,
    blocks,
    labs: [{ title: "WACC Calculator", url: "https://example.com/wacc" }],
    previous: { title: "Before", url: "https://example.com/before" },
    next: { title: "After", url: "https://example.com/after" },
  });
  assert.equal(
    md,
    `# Lesson

What it covers.

## Heading

Text with $x^2$ and **bold**.

> Remember this.

$$
a = b
$$

- one
- two

1. first
2. second

*[Interactive figure: npv profile](https://example.com/guide/t/lesson)*

[Try it](https://example.com/wacc)

### Worked example: Example

1. Step one.
   $$x$$ → **5%**
2. Step two. → **3 years**
3. Step three.

## Interactive labs

- [WACC Calculator](https://example.com/wacc)

## Practice questions

### 1. Pick one.

- a) No
- b) Yes

**Answer:** b) Yes

Because.

### 2. How much?

**Answer:** 9%

Add them.

---

Source: https://example.com/guide/t/lesson

Previous lesson: [Before](https://example.com/before)

Next lesson: [After](https://example.com/after)
`
  );
});

test("a lesson without checks, labs or neighbours has no empty sections", () => {
  const md = lessonToMarkdown({ ...base, blocks: [{ kind: "p", text: "Only text." }] });
  assert.equal(md, "# Lesson\n\nWhat it covers.\n\nOnly text.\n\n---\n\nSource: https://example.com/guide/t/lesson\n");
});

test("the real WACC lesson converts cleanly", () => {
  const md = lessonToMarkdown({ ...base, title: "WACC", blocks: wacc.en });
  assert.ok(md.startsWith("# WACC\n"));
  assert.ok(md.includes("### Worked example: "));
  assert.ok(md.includes("## Practice questions"));
  assert.ok(!/undefined|\[object Object\]/.test(md));
  assert.ok(!/\n{3,}/.test(md));
});
