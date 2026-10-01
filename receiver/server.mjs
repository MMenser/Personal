// Workout receiver: accepts workout JSON from the iOS app, appends it to a
// JSON Lines file, and regenerates the website's activity.json. Zero dependencies. Binds to localhost only; the Cloudflare
// Tunnel is the sole way in from the internet.
import { createServer } from "node:http";
import { createHash, timingSafeEqual } from "node:crypto";
import { existsSync } from "node:fs";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeWorkouts, seedDatabase, writeActivity } from "./activity.mjs";

// Load secrets from receiver/.env (gitignored). Variables already set in the
// environment win, so systemd or the shell can still override anything here.
const ENV_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), ".env");
try {
  process.loadEnvFile(ENV_FILE); // Node 20.12+
} catch (err) {
  if (err.code !== "ENOENT") throw err;
}

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? 8788);
const DATA_FILE = path.resolve(process.env.DATA_FILE ?? "data/workouts.jsonl");
const DB_FILE = path.resolve(process.env.DB_FILE ?? path.join(path.dirname(DATA_FILE), "workouts-db.json"));
const ACTIVITY_FILE = path.resolve(process.env.ACTIVITY_FILE ?? "public/activity.json");
const MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES ?? 10 * 1024 * 1024); // routes + HR samples can be large
const TOKEN = process.env.WORKOUT_TOKEN ?? "";

// Brute-force guard: too many bad tokens from one client locks it out for a while.
const MAX_AUTH_FAILURES = 10;
const AUTH_FAILURE_WINDOW_MS = 15 * 60 * 1000;

if (TOKEN.length < 32) {
  console.error("WORKOUT_TOKEN must be set to at least 32 characters. Put it in receiver/.env (see receiver/README.md); generate one with `npm run receiver:token`.");
  process.exit(1);
}

// Hash both sides so timingSafeEqual gets equal-length buffers and the
// comparison time doesn't leak how much of the token matched.
const sha256 = (s) => createHash("sha256").update(s).digest();
const TOKEN_HASH = sha256(TOKEN);

function isAuthorized(req) {
  const match = /^Bearer (.+)$/.exec(req.headers.authorization ?? "");
  return match != null && timingSafeEqual(sha256(match[1]), TOKEN_HASH);
}

// Cloudflare sets CF-Connecting-IP to the real client; fall back to the socket for local testing.
const clientIp = (req) => req.headers["cf-connecting-ip"] ?? req.socket.remoteAddress ?? "unknown";

const authFailures = new Map(); // ip -> { count, firstAt }

function isLockedOut(ip) {
  const entry = authFailures.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > AUTH_FAILURE_WINDOW_MS) {
    authFailures.delete(ip);
    return false;
  }
  return entry.count >= MAX_AUTH_FAILURES;
}

function recordAuthFailure(ip) {
  const entry = authFailures.get(ip);
  if (!entry || Date.now() - entry.firstAt > AUTH_FAILURE_WINDOW_MS) {
    authFailures.set(ip, { count: 1, firstAt: Date.now() });
  } else {
    entry.count++;
  }
}

const tooLarge = () => Object.assign(new Error("Payload too large"), { status: 413 });

function readBody(req) {
  return new Promise((resolve, reject) => {
    if (Number(req.headers["content-length"] ?? 0) > MAX_BODY_BYTES) return reject(tooLarge());
    const chunks = [];
    let size = 0;
    const onData = (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        // Stop buffering but keep draining so the 413 response can still be delivered.
        req.off("data", onData);
        req.resume();
        reject(tooLarge());
        return;
      }
      chunks.push(chunk);
    };
    req.on("data", onData);
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

// Serialize writes so concurrent uploads never interleave lines.
let writeQueue = mkdir(path.dirname(DATA_FILE), { recursive: true });
function appendWorkouts(workouts) {
  const receivedAt = new Date().toISOString();
  const lines = workouts.map((workout) => JSON.stringify({ receivedAt, workout }) + "\n").join("");
  writeQueue = writeQueue.then(() => appendFile(DATA_FILE, lines, { mode: 0o600 }));
  return writeQueue;
}

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

async function handle(req, res) {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");

  if (pathname === "/health" && req.method === "GET") return send(res, 200, { ok: true });
  if (pathname !== "/workouts") return send(res, 404, { error: "Not found" });
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });

  const ip = clientIp(req);
  if (isLockedOut(ip)) return send(res, 429, { error: "Too many failed attempts" });
  if (!isAuthorized(req)) {
    recordAuthFailure(ip);
    console.warn(`Rejected unauthorized request from ${ip}`);
    return send(res, 401, { error: "Unauthorized" });
  }

  if (!(req.headers["content-type"] ?? "").includes("application/json")) {
    return send(res, 415, { error: "Expected application/json" });
  }

  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch (err) {
    if (err.status === 413) return send(res, 413, { error: "Payload too large" });
    return send(res, 400, { error: "Invalid JSON" });
  }
  if (payload == null || typeof payload !== "object") {
    return send(res, 400, { error: "Expected a JSON object or array" });
  }

  const workouts = Array.isArray(payload) ? payload : [payload];
  await appendWorkouts(workouts);
  console.log(`Stored ${workouts.length} workout(s) from ${ip}`);
  send(res, 201, { ok: true, received: workouts.length });

  // The upload is already saved, so a failure here shouldn't fail the request.
  writeQueue = writeQueue
    .then(async () => {
      const added = await mergeWorkouts(DB_FILE, workouts);
      if (!added) return;
      await writeActivity(DB_FILE, ACTIVITY_FILE);
      console.log(`Added ${added} new workout(s) to ${DB_FILE}`);
    })
    .catch((err) => console.error("Failed to update workout database:", err));
}

// First run: build the database from uploads already in the raw log.
if (!existsSync(DB_FILE)) {
  console.log(`Seeded ${DB_FILE} with ${await seedDatabase(DB_FILE, DATA_FILE)} workout(s)`);
}
// Rebuild at startup so activity.json is current even before the next upload.
const activity = await writeActivity(DB_FILE, ACTIVITY_FILE);
console.log(`Wrote ${ACTIVITY_FILE} (${Object.keys(activity.days).length} active days)`);

createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.error(err);
    if (!res.headersSent) send(res, 500, { error: "Internal error" });
  });
}).listen(PORT, HOST, () => {
  console.log(`Workout receiver listening on http://${HOST}:${PORT}, writing to ${DATA_FILE}`);
});
