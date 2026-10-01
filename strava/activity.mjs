// Pulls the last year of Strava activities and reduces them to per-day totals.
// Shared by the Netlify Function (netlify/functions/activity.mjs) and the Pi
// CLI (scripts/strava-activity.mjs). Only aggregates leave this module: no
// names, locations, routes, or heart rate ever reach the public site.

const TOKEN_URL = "https://www.strava.com/oauth/token";
const ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities";
const PAGE_SIZE = 200; // Strava's max
const MAX_PAGES = 10;
const WINDOW_DAYS = 371; // 53 weeks, enough to fill the full grid

export function readStravaEnv(env = process.env) {
  const clientId = env.STRAVA_CLIENT_ID;
  const clientSecret = env.STRAVA_CLIENT_SECRET;
  const refreshToken = env.STRAVA_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET and STRAVA_REFRESH_TOKEN must be set");
  }
  return { clientId, clientSecret, refreshToken };
}

async function getAccessToken({ clientId, clientSecret, refreshToken }) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) throw new Error(`Strava token refresh failed: ${res.status} ${await res.text()}`);
  const body = await res.json();
  if (body.refresh_token && body.refresh_token !== refreshToken) {
    console.warn("Strava issued a new refresh token; update STRAVA_REFRESH_TOKEN:", body.refresh_token);
  }
  return body.access_token;
}

async function fetchActivities(accessToken, afterEpoch) {
  const all = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${ACTIVITIES_URL}?after=${afterEpoch}&per_page=${PAGE_SIZE}&page=${page}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) throw new Error(`Strava activities fetch failed: ${res.status} ${await res.text()}`);
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < PAGE_SIZE) break;
  }
  return all;
}

// sport_type values like "TrailRun" -> "Trail Run"
const prettySport = (sport) => sport.replace(/([a-z])([A-Z])/g, "$1 $2");

export async function buildActivity(creds) {
  const accessToken = await getAccessToken(creds);
  const afterEpoch = Math.floor(Date.now() / 1000) - WINDOW_DAYS * 86400;
  const activities = await fetchActivities(accessToken, afterEpoch);

  const days = {};
  for (const a of activities) {
    // start_date_local is wall-clock time with a misleading "Z"; the date part is what we want.
    const date = a.start_date_local.slice(0, 10);
    const day = (days[date] ??= { minutes: 0, count: 0, sports: [] });
    day.minutes += Math.round(a.moving_time / 60);
    day.count += 1;
    const sport = prettySport(a.sport_type ?? a.type);
    if (!day.sports.includes(sport)) day.sports.push(sport);
  }

  return { generatedAt: new Date().toISOString(), days };
}
