import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type OgColors = { bg: string; surface: string; text: string; muted: string; primary: string; border: string };

const NAMES: (keyof OgColors)[] = ["bg", "surface", "text", "muted", "primary", "border"];

/// Dark-theme colours read from src/styles/tokens.scss, so OG images match the app.
export async function ogColors(root: string): Promise<OgColors> {
  const scss = await readFile(join(root, "src/styles/tokens.scss"), "utf8");
  // The base :root block is also `color-scheme: dark` but holds only fonts and sizes; take the one with colours.
  const block = scss.split("}").find((b) => b.includes("color-scheme: dark") && b.includes("--bg:"));
  if (!block) throw new Error("og: no `color-scheme: dark` block in src/styles/tokens.scss");
  const colors = {} as OgColors;
  for (const name of NAMES) {
    const hex = block.match(new RegExp(String.raw`--${name}:\s*(#[0-9a-fA-F]{3,8})\b`))?.[1];
    if (!hex) throw new Error(`og: --${name} is missing (or not a hex colour) in the dark tokens`);
    colors[name] = hex;
  }
  return colors;
}
