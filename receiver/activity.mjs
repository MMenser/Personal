// Keeps the workout database (a JSON array of workouts, one entry per id) and
// reduces it to the public activity.json: the dates (Pacific time) in the last
// year with the activity type of each workout that day. Nothing else about a
// workout (times, duration, heart rate, location) leaves the Pi.
import { createReadStream } from "node:fs";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline";

const TIME_ZONE = "America/Los_Angeles";
const WINDOW_DAYS = 365;

const pacificDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const toPacificDate = (date) => pacificDate.format(date); // "YYYY-MM-DD"

const addDays = (isoDate, days) => {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

// Write to a temp file and rename so readers never see a half-written file.
async function writeJsonAtomic(file, data, mode) {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  await writeFile(tmp, JSON.stringify(data) + "\n", { mode });
  await rename(tmp, file);
}

async function readDatabase(dbFile) {
  try {
    return JSON.parse(await readFile(dbFile, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

// An upload is a full export from the app ({ workouts: [...] }), a bare
// workout, or an array of either.
const workoutsIn = (payload) =>
  Array.isArray(payload?.workouts) ? payload.workouts : payload?.id && payload?.start ? [payload] : [];

// Appends workouts whose id isn't in the database yet; known ids are left
// untouched. Returns how many were added.
export async function mergeWorkouts(dbFile, payloads) {
  const db = await readDatabase(dbFile);
  const known = new Set(db.map((w) => w.id));
  let added = 0;
  for (const workout of payloads.flatMap(workoutsIn)) {
    if (!workout?.id || !workout?.start || known.has(workout.id)) continue;
    known.add(workout.id);
    db.push(workout);
    added++;
  }
  if (added) await writeJsonAtomic(dbFile, db, 0o600);
  return added;
}

// One-time seed: builds the database from the receiver's raw JSON Lines log.
export async function seedDatabase(dbFile, logFile) {
  const input = createReadStream(logFile, "utf8");
  let added = 0;
  try {
    for await (const line of createInterface({ input, crlfDelay: Infinity })) {
      if (!line.trim()) continue;
      try {
        added += await mergeWorkouts(dbFile, [JSON.parse(line).workout]);
      } catch {
        console.warn("Skipping unreadable line in", logFile);
      }
    }
  } catch (err) {
    if (err.code !== "ENOENT") throw err; // no log yet = nothing to seed
  }
  return added;
}

export async function writeActivity(dbFile, activityFile, now = new Date()) {
  const end = toPacificDate(now);
  const start = addDays(end, -(WINDOW_DAYS - 1));
  const workouts = (await readDatabase(dbFile)).sort((a, b) => a.start.localeCompare(b.start));
  const days = {}; // "YYYY-MM-DD" -> activity names, in start order
  for (const workout of workouts) {
    const day = toPacificDate(new Date(workout.start));
    if (day >= start && day <= end) (days[day] ??= []).push(workout.activityName ?? "workout");
  }
  const data = { generatedAt: now.toISOString(), timeZone: TIME_ZONE, start, end, days };
  await writeJsonAtomic(activityFile, data, 0o644); // public: nginx must read it
  return data;
}
