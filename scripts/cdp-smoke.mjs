#!/usr/bin/env node
// Dependency-free headless browser smoke test over the Chrome DevTools Protocol (Node 22+, Chrome or Edge).
// For each path: loads it, waits, and prints one JSON line with the final URL, <html lang>, <h1>, title,
// uncaught exceptions, console errors, failed loads, watched requests and locale-prefix leaks.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const HELP = `Usage: node cdp-smoke.mjs --base http://localhost:4173 --paths "/,/about,/hu/about" [options]

  --base <url>              Origin of the running app (required).
  --paths <a,b,c>           Paths to load, comma-separated.
  --wait <ms>               Settle time after each navigation (default 3000).
  --prefix <p>              On pages under <p> (e.g. /hu), report same-origin links that leave <p>.
  --watch-request <regex>   Report whether any request URL matched (e.g. "index\\.hu-.*\\.js").
  --ignore <regex>          Ignore console/log messages matching this (e.g. "_vercel/insights").
  --fulfill <glob=file@st>  Answer requests matching <glob> with <file> and status <st> (default 200),
                            e.g. "*/does-not-exist*=dist/404.html@404" to mimic production 404s. Repeatable.
  --after "<path>|<js>"     Load <path>, run the JS expression (awaited), wait, then report the page state
                            and the expression's value. Use it for clicks, e.g. language switches; for
                            multi-step UI use an async IIFE: "(async()=>{a.click(); await new Promise(r=>
                            setTimeout(r,300)); b.click(); return true})()". Repeatable.
  On Git Bash, prefix the command with MSYS_NO_PATHCONV=1 so "/paths" aren't rewritten.
  --chrome <exe>            Browser executable (default: auto-detect Chrome, then Edge).
  --port <n>                DevTools port (default 9339).`;

// #region args
const argv = process.argv.slice(2);
if (argv.includes("--help") || !argv.length) { console.log(HELP); process.exit(0); }
const opts = { wait: 3000, port: 9339, fulfill: [], after: [], paths: [] };
for (let i = 0; i < argv.length; i += 2) {
  const [key, value] = [argv[i].replace(/^--/, ""), argv[i + 1]];
  if (key === "fulfill" || key === "after") opts[key].push(value);
  else if (key === "paths") opts.paths = value.split(",").map((s) => s.trim()).filter(Boolean);
  else opts[key.replace(/-(\w)/g, (_, c) => c.toUpperCase())] = value;
}
if (!opts.base) { console.error("--base is required\n\n" + HELP); process.exit(2); }
// Git Bash (MSYS) rewrites arguments starting with "/" into Windows paths ("/wacc" → "C:/Program Files/Git/wacc").
if ([...opts.paths, ...opts.after, opts.prefix ?? ""].some((a) => /^[A-Za-z]:[\\/].*Git[\\/]/.test(a))) {
  console.error("Arguments were rewritten by Git Bash path conversion; rerun with MSYS_NO_PATHCONV=1 in front of the command.");
  process.exit(2);
}
const base = opts.base.replace(/\/$/, "");
const ignore = opts.ignore ? new RegExp(opts.ignore) : null;
const watch = opts.watchRequest ? new RegExp(opts.watchRequest) : null;
const fulfills = opts.fulfill.map((spec) => {
  const [glob, rest] = spec.split("=");
  const [file, status = "200"] = rest.split("@");
  const re = new RegExp("^" + glob.split("*").map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$");
  return { re, body: readFileSync(file).toString("base64"), status: Number(status), type: file.endsWith(".html") ? "text/html; charset=utf-8" : "application/octet-stream" };
});
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
const profile = mkdtempSync(join(tmpdir(), "cdp-smoke-"));
const browser = spawn(exe, ["--headless=new", `--remote-debugging-port=${opts.port}`, `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "about:blank"], { stdio: "ignore" });

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
  const events = [];
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); return; }
    if (msg.method === "Fetch.requestPaused") {
      const hit = fulfills.find((f) => f.re.test(msg.params.request.url));
      if (hit) send("Fetch.fulfillRequest", { requestId: msg.params.requestId, responseCode: hit.status, responseHeaders: [{ name: "Content-Type", value: hit.type }], body: hit.body });
      else send("Fetch.continueRequest", { requestId: msg.params.requestId });
      return;
    }
    events.push(msg);
  };
  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    return r.result?.exceptionDetails ? { error: r.result.exceptionDetails.exception?.description ?? r.result.exceptionDetails.text } : r.result?.result?.value;
  };

  await send("Runtime.enable");
  await send("Log.enable");
  await send("Network.enable");
  await send("Page.enable");
  // Intercept everything and match the globs here; unmatched requests continue untouched.
  if (fulfills.length) await send("Fetch.enable", { patterns: [{ urlPattern: "*" }] });

  const problems = () => events.flatMap((e) => {
    let text;
    if (e.method === "Runtime.exceptionThrown") text = `exception: ${e.params.exceptionDetails.exception?.description?.split("\n")[0] ?? e.params.exceptionDetails.text}`;
    else if (e.method === "Runtime.consoleAPICalled" && e.params.type === "error") text = `console.error: ${e.params.args.map((a) => a.value ?? a.description).join(" ")}`;
    else if (e.method === "Log.entryAdded" && e.params.entry.level === "error") text = `log: ${e.params.entry.text} ${e.params.entry.url ?? ""}`.trim();
    return text && !(ignore && ignore.test(text)) ? [text.slice(0, 300)] : [];
  });
  const watched = () => watch ? events.some((e) => e.method === "Network.requestWillBeSent" && watch.test(e.params.request.url)) : undefined;
  const state = (path) => evaluate(`(() => {
    const links = [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href"));
    const prefix = ${JSON.stringify(opts.prefix ?? null)};
    const underPrefix = prefix && (location.pathname === prefix || location.pathname.startsWith(prefix + "/"));
    return {
      href: location.pathname + location.search + location.hash,
      lang: document.documentElement.lang,
      h1: document.querySelector("h1")?.textContent?.trim(),
      title: document.title,
      leakingLinks: underPrefix ? [...new Set(links.filter((h) => h !== prefix && !h.startsWith(prefix + "/") && !h.startsWith("/assets")))] : undefined,
    };
  })()`).then((s) => ({ path, ...s, watchedRequest: watched(), problems: problems() }));

  const visit = async (path) => {
    events.length = 0;
    await send("Page.navigate", { url: base + path });
    await wait(Number(opts.wait));
  };

  for (const path of opts.paths) {
    await visit(path);
    console.log(JSON.stringify(await state(path)));
  }
  for (const spec of opts.after) {
    const [path, ...js] = spec.split("|");
    await visit(path);
    const value = await evaluate(js.join("|"));
    await wait(Number(opts.wait));
    console.log(JSON.stringify({ after: js.join("|").slice(0, 80), value, ...(await state(path)) }));
  }
  ws.close();
} finally {
  browser.kill();
  await wait(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch { /* the browser may still hold a lock */ }
}
