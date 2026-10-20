export type VizLine = { d: string; w: number; o: number; area?: boolean };
export type VizDot = { x: number; y: number; key?: boolean };
/// A lab's mini drawing in a 120×64 box; the LAST line is the key line (accent colour).
export type ModuleViz = { lines: VizLine[]; dots?: VizDot[] };
export type HomeTileInput = { id: string; featured: boolean };
export type HomeTile = { id: string; code: string; featured: boolean };
export type FanParams = {
  seed: number;
  paths: number;
  steps: number;
  mu: number;
  sigma: number;
  s0: number;
  lo: number;
  hi: number;
  x0: number;
  x1: number;
  yTop: number;
  yBottom: number;
  bins: number;
};
export type FanArt = {
  paths: { d: string; end: number }[];
  keyIndex: number;
  mean: string;
  bins: { y: number; h: number; w: number }[];
  y0: number;
};
