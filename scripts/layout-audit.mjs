#!/usr/bin/env node
// Dependency-free layout audit over the Chrome DevTools Protocol (Node 22+, Chrome or Edge).
// Loads each path at several widths and themes, measures geometry, saves screenshots and exits 1 on defects.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const HELP = `Usage: node scripts/layout-audit.mjs --base http://localhost:4173 (--paths "/a,/b" | --group fixed-income) [options]

  --base <url>          Origin of the running app (required).
  --paths <a,b>         Explicit paths, comma-separated.
  --group <category>    Registry category (e.g. fixed-income); adds the /hu variant of each path.
  --widths <list>       Default 360,390,768,1024,1280,1536.
  --themes <list>       Default light,dark.
  --out <dir>           Screenshot directory (default .layout-audit).
  --strict              Tap-target warnings fail the run.
  --after "<js>"        Expression run after load (e.g. click a tab) before measuring. Repeatable; each
                        produces its own measurement labelled with its index (step 1, 2, ...).
  --wait <ms>           Settle time after navigation (default 2500).
  --chrome <exe>        Browser executable (default: auto-detect).
  --port <n>            DevTools port (default 9340).
Defects: overflow, offscreen, overlap, svg-text-collision, svg-text-clipped, text-clipped,
left-border-accent (fail); tap-target (warning). Mark intentional exceptions with data-layout-allow="reason".
On Git Bash, prefix the command with MSYS_NO_PATHCONV=1.`;

// #region args
const argv = process.argv.slice(2);
if (argv.includes("--help") || !argv.length) { console.log(HELP); process.exit(0); }
const opts = { wait: 2500, port: 9340, widths: "360,390,768,1024,1280,1536", themes: "light,dark", out: ".layout-audit", after: [] };
for (let i = 0; i < argv.length; i++) {
  const key = argv[i].replace(/^--/, "");
  if (key === "strict") { opts.strict = true; continue; }
  const value = argv[++i];
  if (key === "after") opts.after.push(value);
  else opts[key] = value;
}
if (!opts.base) { console.error("--base is required\n\n" + HELP); process.exit(2); }
const base = opts.base.replace(/\/$/, "");
const widths = opts.widths.split(",").map(Number);
const themes = opts.themes.split(",");

function groupPaths(category) {
  const text = readFileSync("src/modules/registry.ts", "utf8");
  const blocks = text.split(/\n\s*\{\s*\n/).filter((b) => b.includes(`category: "${category}"`));
  const paths = blocks.flatMap((b) => (b.match(/\bpath:\s*"(\/[^"]*)"/) ? [b.match(/\bpath:\s*"(\/[^"]*)"/)[1]] : []));
  return paths.flatMap((p) => [p, `/hu${p}`]);
}
const paths = opts.paths ? opts.paths.split(",").map((s) => s.trim()).filter(Boolean) : opts.group ? groupPaths(opts.group) : [];
if (!paths.length) { console.error("No paths: pass --paths or a --group with matches.\n\n" + HELP); process.exit(2); }
if (paths.some((p) => /^[A-Za-z]:[\\/]/.test(p))) { console.error("Paths were rewritten by Git Bash; rerun with MSYS_NO_PATHCONV=1."); process.exit(2); }
// #endregion

// #region measurement (runs inside the page)
const MEASURE = `(() => {
  const CAP = 10;
  const out = {};
  const counts = {};
  const add = (kind, sample) => {
    counts[kind] = (counts[kind] || 0) + 1;
    (out[kind] ||= []).length < CAP && out[kind].push(sample);
  };
  const css = (el) => getComputedStyle(el);
  const desc = (el) => {
    const cls = typeof el.className === "string" ? el.className : el.className?.baseVal ?? "";
    return el.tagName.toLowerCase() + (cls ? "." + cls.trim().split(/\\s+/).slice(0, 2).join(".") : "") + (el.textContent ? ' "' + el.textContent.trim().slice(0, 24) + '"' : "");
  };
  const allowed = new Set();
  const visibleCache = new Map();
  const visible = (el) => {
    if (visibleCache.has(el)) return visibleCache.get(el);
    let ok = true;
    if (!el.isConnected) ok = false;
    else {
      const s = css(el);
      if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) === 0) ok = false;
      else if (el.getAttribute("aria-hidden") === "true" || el.hasAttribute("hidden")) ok = false;
      else if (el.parentElement?.matches("details:not([open])") && el.tagName !== "SUMMARY") ok = false;
      else if (el.hasAttribute("data-layout-allow")) { allowed.add(el.getAttribute("data-layout-allow")); ok = false; }
      else if (el.parentElement) ok = visible(el.parentElement);
    }
    visibleCache.set(el, ok);
    return ok;
  };
  const rectOf = (el) => el.getBoundingClientRect();
  const sized = (r) => r.width > 0.5 && r.height > 0.5;
  const inScroller = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      const o = css(p).overflowX;
      if (o === "auto" || o === "scroll") return true;
    }
    return false;
  };
  const vw = document.documentElement.clientWidth;

  // overflow
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth) add("overflow", "scrollWidth " + de.scrollWidth + " > " + de.clientWidth);

  const all = [...document.body.querySelectorAll("*")].filter((el) => !(el instanceof SVGElement) || el.tagName === "svg" || el.tagName === "text");
  const htmlEls = all.filter((el) => !(el instanceof SVGElement));

  // offscreen, text-clipped, left-border-accent, tap-target
  for (const el of htmlEls) {
    if (!visible(el)) continue;
    const r = rectOf(el);
    if (!sized(r)) continue;
    const s = css(el);
    if (r.right > vw + 1 && !inScroller(el) && s.position !== "fixed") add("offscreen", desc(el) + " right=" + Math.round(r.right));
    const clips = s.overflowX === "hidden" || s.overflowX === "clip";
    if (clips && el.scrollWidth > el.clientWidth + 1 && s.textOverflow !== "ellipsis" && el.clientWidth > 0 && el.children.length === 0 && el.textContent.trim())
      add("text-clipped", desc(el) + " " + el.scrollWidth + ">" + el.clientWidth);
    const bl = parseFloat(s.borderLeftWidth);
    if (bl >= 2 && s.borderLeftStyle !== "none" && !/rgba\\(.*, 0\\)|transparent/.test(s.borderLeftColor) && bl > Math.max(parseFloat(s.borderTopWidth), parseFloat(s.borderRightWidth), parseFloat(s.borderBottomWidth)) + 0.5)
      add("left-border-accent", desc(el));
    if (vw < 700 && el.matches("button, a[href], input:not([type=hidden]), select, [role=slider], [role=tab]") && (r.width < 32 || r.height < 32) && !(el.matches("a") && el.closest("p, li, .prose, .guide-body") && el.textContent.trim().length > 0 && r.height > 12 && el.matches("p a, li a")))
      add("tap-target", desc(el) + " " + Math.round(r.width) + "x" + Math.round(r.height));
  }

  // HTML text overlap: leaf text elements and controls
  const boxes = htmlEls.filter((el) => {
    if (!visible(el)) return false;
    const isControl = el.matches("button, input:not([type=hidden]), select, textarea");
    const leafText = el.children.length === 0 && el.textContent.trim().length > 0;
    return (isControl || leafText) && sized(rectOf(el));
  });
  const wrapperOf = (el) => el.closest("label, [class*=value], [class*=unit]");
  // Per-line rects: a wrapped inline element's bounding box would overlap its neighbours falsely.
  const lines = (el) => [...el.getClientRects()].filter(sized);
  const hit = (ra, rb) => Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left) > 2 && Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top) > 2;
  for (let i = 0; i < boxes.length; i++) {
    const a = boxes[i], la = lines(a);
    for (let j = i + 1; j < boxes.length; j++) {
      const b = boxes[j];
      if (a.contains(b) || b.contains(a)) continue;
      if (!la.some((ra) => lines(b).some((rb) => hit(ra, rb)))) continue;
      const wa = wrapperOf(a), wb = wrapperOf(b);
      if (wa && wa === wb) continue; // unit sitting inside its input by design
      if (css(a).position === "fixed" || css(b).position === "fixed") continue;
      add("overlap", desc(a) + " x " + desc(b));
    }
  }

  // SVG text
  for (const svg of document.body.querySelectorAll("svg")) {
    if (!visible(svg)) continue;
    const sr = rectOf(svg);
    if (!sized(sr)) continue;
    const texts = [...svg.querySelectorAll("text")].filter((t) => visible(t) && t.textContent.trim() && sized(rectOf(t)));
    const rects = texts.map((t) => rectOf(t));
    texts.forEach((t, i) => {
      const r = rects[i];
      if (r.left < sr.left - 1 || r.right > sr.right + 1 || r.top < sr.top - 1 || r.bottom > sr.bottom + 1) add("svg-text-clipped", desc(t));
      for (let j = i + 1; j < texts.length; j++) {
        const q = rects[j];
        const ox = Math.min(r.right, q.right) - Math.max(r.left, q.left);
        const oy = Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top);
        if (ox > 1 && oy > 1) add("svg-text-collision", desc(t) + " x " + desc(texts[j]));
      }
    });
  }
  return { counts, samples: out, allowed: [...allowed], height: Math.ceil(document.documentElement.scrollHeight) };
})()`;
// #endregion

const candidates = opts.chrome ? [opts.chrome] : [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
];
const exe = candidates.find((p) => p && existsSync(p));
if (!exe) { console.error("No Chrome/Edge found; pass --chrome <path>."); process.exit(2); }

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), "layout-audit-"));
const browser = spawn(exe, ["--headless=new", `--remote-debugging-port=${opts.port}`, `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
mkdirSync(opts.out, { recursive: true });

const FAILING = new Set(["overflow", "offscreen", "overlap", "svg-text-collision", "svg-text-clipped", "text-clipped", "left-border-accent"]);
let runs = 0, failing = 0;

try {
  let targets;
  for (let i = 0; i < 60 && !targets; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${opts.port}/json`)).json(); } catch { await wait(250); }
  }
  if (!targets) throw new Error("browser did not expose DevTools; is the port free?");
  const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise((r, j) => {
    const i = ++id;
    const timer = setTimeout(() => { pending.delete(i); j(new Error(`${method} timed out`)); }, 30000);
    pending.set(i, (msg) => { clearTimeout(timer); r(msg); });
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  };
  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description ?? r.result.exceptionDetails.text);
    return r.result?.result?.value;
  };
  await send("Page.enable");
  await send("Runtime.enable");

  let themeScript;
  for (const theme of themes) {
    if (themeScript) await send("Page.removeScriptToEvaluateOnNewDocument", { identifier: themeScript });
    themeScript = (await send("Page.addScriptToEvaluateOnNewDocument", { source: `try{localStorage.setItem("qs-theme","${theme}")}catch{}` })).result.identifier;
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }] });
    for (const width of widths) {
      await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
      for (const path of paths) {
        await send("Page.navigate", { url: base + path });
        await wait(Number(opts.wait));
        const steps = [null, ...opts.after];
        for (let step = 0; step < steps.length; step++) {
          if (steps[step]) { await evaluate(steps[step]); await wait(600); }
          const m = await evaluate(MEASURE);
          const bad = Object.keys(m.counts).filter((k) => FAILING.has(k) || (k === "tap-target" && opts.strict));
          runs++;
          if (bad.length) failing++;
          console.log(JSON.stringify({ path, width, theme, step, failures: m.counts, samples: m.samples, ...(m.allowed.length ? { allowed: m.allowed } : {}), ok: !bad.length }));
          const height = Math.min(6000, Math.max(900, m.height));
          await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 700 });
          const shot = await send("Page.captureScreenshot", { format: "png" });
          const name = `${theme}-${width}${path.replace(/\//g, "_")}${step ? `-s${step}` : ""}.png`;
          writeFileSync(join(opts.out, name), Buffer.from(shot.result.data, "base64"));
          await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
        }
      }
    }
  }
  ws.close();
} finally {
  browser.kill();
  await wait(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch { /* the browser may still hold a lock */ }
}
console.log(`SUMMARY pages=${runs} failing=${failing}`);
process.exit(failing ? 1 : 0);
