// Writes activity.json for hosts without Netlify Functions (the Pi) and for
// local dev. Run it from cron to keep the file fresh:
//   node --env-file=.env.strava scripts/strava-activity.mjs /var/www/site/activity.json
// With no argument it writes public/activity.json, which Vite serves in dev.
import { writeFile, rename } from "node:fs/promises";
import { buildActivity, readStravaEnv } from "../strava/activity.mjs";

const out = process.argv[2] ?? "public/activity.json";
const data = await buildActivity(readStravaEnv());

// Write then rename so nginx never serves a half-written file.
await writeFile(`${out}.tmp`, JSON.stringify(data));
await rename(`${out}.tmp`, out);
console.log(`Wrote ${Object.keys(data.days).length} active days to ${out}`);
