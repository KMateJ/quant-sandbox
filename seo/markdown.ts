import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { MarkdownBundle } from "./types.ts";

/// Writes each Markdown twin to `<path>.md` (never the home page) plus `llms.txt` and `llms-full.txt`.
export async function writeMarkdown(outDir: string, markdown: MarkdownBundle): Promise<void> {
  for (const { path, markdown: text } of markdown.pages) {
    if (path === "/") continue;
    const file = join(outDir, `${path}.md`);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, text);
  }
  await writeFile(join(outDir, "llms.txt"), markdown.llms);
  await writeFile(join(outDir, "llms-full.txt"), markdown.llmsFull);
}
