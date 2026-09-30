// Pi dashboard server: samples system stats and serves the built dashboard.
// Zero dependencies. Binds to localhost only; `tailscale serve` exposes it to
// the tailnet, so it is never reachable from the public internet.
import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { readFile, stat, statfs } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? 8787);
const DISK_PATH = process.env.DISK_PATH ?? "/";
const SAMPLE_MS = 2000;
const HISTORY_LENGTH = 150; // 5 minutes at 2s

const STATIC_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../dist-dashboard",
);

// ---------- stat readers (each returns null when unsupported) ----------

const readText = (file) => readFile(file, "utf8").catch(() => null);

async function readModel() {
  const raw = await readText("/proc/device-tree/model");
  return raw ? raw.replace(/\0/g, "").trim() : null;
}

async function readTemperatureC() {
  const raw = await readText("/sys/class/thermal/thermal_zone0/temp");
  return raw ? Number(raw) / 1000 : null;
}

async function readMemory() {
  const raw = await readText("/proc/meminfo");
  if (!raw) {
    const total = os.totalmem();
    return { memory: { totalBytes: total, usedBytes: total - os.freemem() }, swap: null };
  }
  const kb = {};
  for (const line of raw.split("\n")) {
    const match = line.match(/^(\w+):\s+(\d+)/);
    if (match) kb[match[1]] = Number(match[2]) * 1024;
  }
  return {
    memory: { totalBytes: kb.MemTotal, usedBytes: kb.MemTotal - kb.MemAvailable },
    swap: kb.SwapTotal
      ? { totalBytes: kb.SwapTotal, usedBytes: kb.SwapTotal - kb.SwapFree }
      : null,
  };
}

async function readDisk() {
  try {
    const s = await statfs(DISK_PATH);
    const total = s.blocks * s.bsize;
    const free = s.bavail * s.bsize;
    return { path: DISK_PATH, totalBytes: total, usedBytes: total - free };
  } catch {
    return null;
  }
}

// `vcgencmd get_throttled` reports under-voltage / throttling on Raspberry Pi.
let vcgencmdAvailable = true;
function readThrottled() {
  if (!vcgencmdAvailable) return Promise.resolve(null);
  return new Promise((resolve) => {
    execFile("vcgencmd", ["get_throttled"], { timeout: 1000 }, (err, stdout) => {
      if (err) {
        if (err.code === "ENOENT") vcgencmdAvailable = false;
        return resolve(null);
      }
      const match = stdout.match(/0x([0-9a-f]+)/i);
      if (!match) return resolve(null);
      const bits = parseInt(match[1], 16);
      const flags = (offset) => ({
        underVoltage: Boolean(bits & (1 << offset)),
        freqCapped: Boolean(bits & (1 << (offset + 1))),
        throttled: Boolean(bits & (1 << (offset + 2))),
        softTempLimit: Boolean(bits & (1 << (offset + 3))),
      });
      resolve({ raw: `0x${match[1]}`, now: flags(0), sinceBoot: flags(16) });
    });
  });
}

// CPU usage needs two samples of cumulative tick counters.
let lastCpuTimes = os.cpus().map((c) => c.times);
function sampleCpu() {
  const current = os.cpus().map((c) => c.times);
  const perCore = current.map((t, i) => {
    const prev = lastCpuTimes[i] ?? t;
    const busy = t.user + t.nice + t.sys + t.irq - (prev.user + prev.nice + prev.sys + prev.irq);
    const total = busy + (t.idle - prev.idle);
    return total > 0 ? (busy / total) * 100 : 0;
  });
  lastCpuTimes = current;
  const usagePercent = perCore.reduce((a, b) => a + b, 0) / (perCore.length || 1);
  return { usagePercent, perCore };
}

// ---------- sampler ----------

const model = await readModel();
const history = { timestamps: [], cpuPercent: [], temperatureC: [] };
let latest = null;

function pushHistory(key, value) {
  history[key].push(value);
  if (history[key].length > HISTORY_LENGTH) history[key].shift();
}

async function sample() {
  const [temperatureC, mem, disk, throttled] = await Promise.all([
    readTemperatureC(),
    readMemory(),
    readDisk(),
    readThrottled(),
  ]);
  const cpu = sampleCpu();
  const timestamp = Date.now();

  pushHistory("timestamps", timestamp);
  pushHistory("cpuPercent", cpu.usagePercent);
  pushHistory("temperatureC", temperatureC);

  latest = {
    hostname: os.hostname(),
    model,
    timestamp,
    uptimeSeconds: os.uptime(),
    load: os.loadavg(),
    cpu: { ...cpu, cores: cpu.perCore.length },
    temperatureC,
    memory: mem.memory,
    swap: mem.swap,
    disk,
    throttled,
  };
}

await sample();
setInterval(() => sample().catch((err) => console.error("sample failed", err)), SAMPLE_MS);

// ---------- http ----------

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json",
};

async function serveStatic(urlPath, res) {
  let file = path.join(STATIC_DIR, path.normalize(decodeURIComponent(urlPath)));
  if (!file.startsWith(STATIC_DIR + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  const info = await stat(file).catch(() => null);
  if (!info || info.isDirectory()) file = path.join(STATIC_DIR, "index.html"); // SPA fallback

  const body = await readFile(file).catch(() => null);
  if (!body) {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("Dashboard not built. Run `npm run dashboard:build`.");
    return;
  }
  const ext = path.extname(file);
  res.writeHead(200, {
    "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
    // Vite fingerprints assets, so they can be cached forever; index.html cannot.
    "Cache-Control": file.includes(`${path.sep}assets${path.sep}`) ? "public, max-age=31536000, immutable" : "no-cache",
  });
  res.end(body);
}

createServer((req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  if (pathname === "/api/stats") {
    res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    res.end(JSON.stringify({ ...latest, history }));
    return;
  }
  serveStatic(pathname, res).catch((err) => {
    console.error(err);
    res.writeHead(500).end();
  });
}).listen(PORT, HOST, () => {
  console.log(`Dashboard listening on http://${HOST}:${PORT}`);
});
