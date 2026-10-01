// Serves /activity.json on Netlify. The CDN caches the response for an hour,
// so Strava is hit at most ~24 times a day no matter how much traffic comes in.
import { buildActivity, readStravaEnv } from "../../strava/activity.mjs";

export default async () => {
  try {
    const data = await buildActivity(readStravaEnv());
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, max-age=300",
        "Netlify-CDN-Cache-Control": "public, durable, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "activity unavailable" }, {
      status: 502,
      headers: { "Cache-Control": "no-store" },
    });
  }
};

export const config = { path: "/activity.json" };
