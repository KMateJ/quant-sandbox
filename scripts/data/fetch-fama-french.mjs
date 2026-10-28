// Downloads the Ken French Data Library files and writes the bundled snapshot
// src/features/fama-french/data/famaFrench.json. Run: npm run data:fama-french
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateRawSync } from "node:zlib";

const BASE = "https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/";
const LIBRARY = "https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html";
const START = 196307;
const MAX_BYTES = 300 * 1024;
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../../src/features/fama-french/data/famaFrench.json");

const monthLabel = (ym) => `${String(ym).slice(0, 4)}-${String(ym).slice(4)}`;
const nextMonth = (ym) => (ym % 100 === 12 ? ym + 89 : ym + 1);

/** Reads the single file inside a zip (central directory, deflate or stored). */
function unzipFirst(buf) {
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error("zip: end of central directory not found");
  const cd = buf.readUInt32LE(eocd + 16);
  if (buf.readUInt32LE(cd) !== 0x02014b50) throw new Error("zip: bad central directory");
  const method = buf.readUInt16LE(cd + 10);
  const csize = buf.readUInt32LE(cd + 20);
  const local = buf.readUInt32LE(cd + 42);
  if (buf.readUInt32LE(local) !== 0x04034b50) throw new Error("zip: bad local header");
  const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
  const data = buf.subarray(start, start + csize);
  return (method === 0 ? data : inflateRawSync(data)).toString("latin1");
}

async function download(name) {
  const res = await fetch(BASE + name);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  return unzipFirst(Buffer.from(await res.arrayBuffer()));
}

/** First consecutive block of `YYYYMM, v, v, …` lines, with the header above it. */
function firstMonthlyBlock(text, file, needle) {
  const lines = text.split(/\r?\n/);
  const isRow = (l) => /^\s*\d{6}\s*,/.test(l);
  const first = lines.findIndex(isRow);
  if (first < 0) throw new Error(`${file}: no monthly block`);
  let h = first - 1;
  while (h >= 0 && !lines[h].trim()) h--;
  const columns = lines[h].split(",").slice(1).map((s) => s.trim());
  if (needle) {
    let t = h - 1;
    while (t >= 0 && !lines[t].trim()) t--;
    if (!lines[t].includes(needle)) throw new Error(`${file}: block title "${lines[t].trim()}" lacks "${needle}"`);
  }
  const rows = new Map();
  for (let i = first; i < lines.length && isRow(lines[i]); i++) {
    const parts = lines[i].split(",").map((s) => s.trim());
    const values = parts.slice(1).map(Number);
    if (values.length !== columns.length || values.some((v) => !Number.isFinite(v))) {
      throw new Error(`${file}: malformed row ${parts[0]}`);
    }
    rows.set(Number(parts[0]), values);
  }
  return { columns, rows };
}

const files = {
  ff5: "F-F_Research_Data_5_Factors_2x3_CSV.zip",
  mom: "F-F_Momentum_Factor_CSV.zip",
  p25: "25_Portfolios_5x5_CSV.zip",
  ind: "10_Industry_Portfolios_CSV.zip",
};

const blocks = {
  ff5: firstMonthlyBlock(await download(files.ff5), files.ff5),
  mom: firstMonthlyBlock(await download(files.mom), files.mom),
  p25: firstMonthlyBlock(await download(files.p25), files.p25, "Value Weight"),
  ind: firstMonthlyBlock(await download(files.ind), files.ind, "Value Weight"),
};

const last = Math.min(...Object.values(blocks).map((b) => Math.max(...b.rows.keys())));
const months = [];
for (let ym = START; ym <= last; ym = nextMonth(ym)) months.push(ym);

const column = (block, idx, file) =>
  months.map((ym) => {
    const row = block.rows.get(ym);
    if (!row) throw new Error(`${file}: month ${ym} missing`);
    const v = row[idx];
    if (v <= -99 || v === -999) throw new Error(`${file}: missing-data marker in ${ym}`);
    return Math.round(v * 100) / 100;
  });

const ffIdx = (name) => {
  const i = blocks.ff5.columns.indexOf(name);
  if (i < 0) throw new Error(`factor column ${name} not found`);
  return i;
};
const factors = {
  mkt: column(blocks.ff5, ffIdx("Mkt-RF"), files.ff5),
  smb: column(blocks.ff5, ffIdx("SMB"), files.ff5),
  hml: column(blocks.ff5, ffIdx("HML"), files.ff5),
  rmw: column(blocks.ff5, ffIdx("RMW"), files.ff5),
  cma: column(blocks.ff5, ffIdx("CMA"), files.ff5),
  mom: column(blocks.mom, 0, files.mom),
  rf: column(blocks.ff5, ffIdx("RF"), files.ff5),
};

const { columns: c25 } = blocks.p25;
if (c25.length !== 25 || !/SMALL.*Lo|ME1 BM1/i.test(c25[0]) || !/BIG.*Hi|ME5 BM5/i.test(c25[24])) {
  throw new Error("25 portfolios: unexpected column order");
}
// size quintile 1 (small) … 5 (big), B/M quintile 1 (growth) … 5 (value); row-major as in the file
const p25 = {
  labels: c25.map((_, i) => `S${Math.floor(i / 5) + 1}B${(i % 5) + 1}`),
  returns: c25.map((_, i) => column(blocks.p25, i, files.p25)),
};
const industries = {
  labels: blocks.ind.columns,
  returns: blocks.ind.columns.map((_, i) => column(blocks.ind, i, files.ind)),
};

const snapshot = {
  source: "Kenneth R. French Data Library",
  url: LIBRARY,
  retrieved: new Date().toISOString().slice(0, 10),
  start: monthLabel(START),
  end: monthLabel(last),
  unit: "percent per month",
  factors,
  p25,
  industries,
};

// numeric arrays on one line each keeps the file small and diffs readable
const json = JSON.stringify(snapshot, null, 1).replace(/\[\s*(-?[\d.]+(?:,\s*-?[\d.]+)*)\s*\]/g, (_, body) => `[${body.replace(/\s+/g, "")}]`);
if (Buffer.byteLength(json) > MAX_BYTES) throw new Error(`snapshot is ${Buffer.byteLength(json)} bytes (limit ${MAX_BYTES})`);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, json + "\n");
console.log(`${months.length} months ${monthLabel(START)} … ${monthLabel(last)}, ${Buffer.byteLength(json)} bytes -> ${OUT}`);
