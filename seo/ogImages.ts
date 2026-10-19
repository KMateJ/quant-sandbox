import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { OG_FONT_SUBSETS, ogLayout, type OgCard } from "./ogLayout.ts";
import { ogColors } from "./theme.ts";

// Bump when ogLayout or the fonts change, so cached PNGs are re-rendered.
const LAYOUT_VERSION = 2;

const FONT_FILES = ([400, 700] as const).flatMap((weight) =>
  OG_FONT_SUBSETS.map((subset) => ({ name: `Inter ${subset}`, weight, file: `inter-${subset}-${weight}-normal.woff` }))
);

/// Static .woff Inter files (Satori can't read woff2), one family per subset so glyph fallback reaches latin-ext and greek.
const loadFonts = (root: string) =>
  Promise.all(
    FONT_FILES.map(async ({ name, weight, file }) => ({
      name,
      weight,
      style: "normal" as const,
      data: await readFile(join(root, "node_modules/@fontsource/inter/files", file)),
    }))
  );

/// Site-relative path of a page's OG image: `/` → `/og/index.png`, `/a/b` → `/og/a/b.png`.
export const ogImagePath = (path: string) => `/og${path === "/" ? "/index" : path}.png`;

/// The 512px app icon as a data URI, for the card's header.
export async function ogIcon(root: string): Promise<string> {
  return `data:image/png;base64,${(await readFile(join(root, "public/android-chrome-512x512.png"))).toString("base64")}`;
}

/// Renders (or reuses from cache) the OG PNG for each card at `outDir` + `file`; logs rendered vs cached.
export async function writeOgImages(cards: { file: string; card: OgCard }[], opts: { root: string; outDir: string }): Promise<void> {
  // Loaded lazily so that reading vite.config.ts in dev stays fast.
  const [{ default: satori }, { Resvg }] = await Promise.all([import("satori"), import("@resvg/resvg-js")]);
  const colors = await ogColors(opts.root);
  let fonts: Awaited<ReturnType<typeof loadFonts>> | undefined;
  const cacheDir = join(opts.root, "node_modules/.cache/og");
  await mkdir(cacheDir, { recursive: true });

  let rendered = 0;
  for (const { file, card } of cards) {
    const hash = createHash("sha1").update(JSON.stringify(card) + LAYOUT_VERSION + JSON.stringify(colors)).digest("hex");
    const cached = join(cacheDir, `${hash}.png`);
    if (!existsSync(cached)) {
      fonts ??= await loadFonts(opts.root);
      const svg = await satori(ogLayout(card, colors) as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts });
      await writeFile(cached, new Resvg(svg).render().asPng());
      rendered++;
    }
    const target = join(opts.outDir, file);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(cached, target);
  }
  console.log(`og: ${rendered} rendered, ${cards.length - rendered} cached`);
}
