import type { GuideBlock, GuideCheckAnswer, GuideCheckBlock, GuideWorkedBlock, GuideWorkedResult } from "./guide.content.types";

/// Labels used in the Markdown output, resolved through i18n by the caller.
export type MarkdownLabels = {
  practice: string;
  answer: string;
  figure: string;
  workedExample: string;
  labs: string;
  source: string;
  previous: string;
  next: string;
};

export type MarkdownLink = { title: string; url: string };

export type LessonMarkdownInput = {
  title: string;
  description: string;
  /// Absolute URL of the live lesson; relative lab links resolve against it.
  url: string;
  /// Language URL prefix (`/hu`) put in front of lab links; "" for English.
  pathPrefix?: string;
  blocks: GuideBlock[];
  labs: MarkdownLink[];
  previous?: MarkdownLink;
  next?: MarkdownLink;
  labels: MarkdownLabels;
};

const link = ({ title, url }: MarkdownLink) => `[${title}](${url})`;

/// `5%` but `3 years`: a percent sign hugs the number, a word unit does not.
const withUnit = (value: number, unit?: string) => (!unit ? `${value}` : unit === "%" ? `${value}%` : `${value} ${unit}`);

const result = (r: GuideWorkedResult) => ` → **${withUnit(r.value, r.unit)}**`;

function worked(block: GuideWorkedBlock, labels: MarkdownLabels): string {
  const steps = block.steps.map((s, i) => {
    const tex = s.tex ? `\n   $$${s.tex}$$` : "";
    return `${i + 1}. ${s.text}${tex}${s.result ? result(s.result) : ""}`;
  });
  return `### ${labels.workedExample}: ${block.title}\n\n${steps.join("\n")}`;
}

const answerText = (answer: GuideCheckAnswer) =>
  answer.type === "number"
    ? withUnit(answer.value, answer.unit)
    : `${String.fromCharCode(97 + answer.correct)}) ${answer.options[answer.correct]}`;

function check(block: GuideCheckBlock, index: number, labels: MarkdownLabels): string {
  const options =
    block.answer.type === "choice"
      ? [block.answer.options.map((o, i) => `- ${String.fromCharCode(97 + i)}) ${o}`).join("\n")]
      : [];
  return [`### ${index + 1}. ${block.prompt}`, ...options, `**${labels.answer}:** ${answerText(block.answer)}`, block.explain].join("\n\n");
}

function block(b: GuideBlock, input: LessonMarkdownInput): string | undefined {
  switch (b.kind) {
    case "h":
      return `## ${b.text}`;
    case "p":
      return b.text;
    case "note":
      return `> ${b.text}`;
    case "math":
      return `$$\n${b.tex}\n$$`;
    case "list":
      return b.items.map((item, i) => `${b.ordered ? `${i + 1}.` : "-"} ${item}`).join("\n");
    case "figure":
      return `*[${input.labels.figure}: ${b.id.replace(/-/g, " ")}](${input.url})*`;
    case "lab":
      return `[${b.text}](${new URL(`${input.pathPrefix ?? ""}${b.to}`, input.url).toString()})`;
    case "worked":
      return worked(b, input.labels);
    case "check":
      return undefined;
  }
}

/// One lesson as Markdown: H1 title, description, body, labs, practice questions, live-page link.
/// Inline text is already Markdown with `$tex$`, so it is passed through untouched.
export function lessonToMarkdown(input: LessonMarkdownInput): string {
  const { labels } = input;
  const checks = input.blocks.filter((b): b is GuideCheckBlock => b.kind === "check");
  const sections = [
    `# ${input.title}`,
    input.description,
    ...input.blocks.map((b) => block(b, input)).filter((s): s is string => s !== undefined),
    ...(input.labs.length ? [`## ${labels.labs}`, input.labs.map((l) => `- ${link(l)}`).join("\n")] : []),
    ...(checks.length ? [`## ${labels.practice}`, ...checks.map((c, i) => check(c, i, labels))] : []),
    "---",
    `${labels.source}: ${input.url}`,
    ...(input.previous ? [`${labels.previous}: ${link(input.previous)}`] : []),
    ...(input.next ? [`${labels.next}: ${link(input.next)}`] : []),
  ];
  return `${sections.join("\n\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}
