// One-time helper: authorizes your Strava API app and prints a refresh token.
//   STRAVA_CLIENT_ID=... STRAVA_CLIENT_SECRET=... node scripts/strava-auth.mjs
// Set the app's "Authorization Callback Domain" to localhost first
// (https://www.strava.com/settings/api).
import { createServer } from "node:http";

const PORT = 8723;
const { STRAVA_CLIENT_ID: clientId, STRAVA_CLIENT_SECRET: clientSecret } = process.env;
if (!clientId || !clientSecret) {
  console.error("Set STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET");
  process.exit(1);
}

const redirectUri = `http://localhost:${PORT}/callback`;
const authorizeUrl = "https://www.strava.com/oauth/authorize?" + new URLSearchParams({
  client_id: clientId,
  response_type: "code",
  redirect_uri: redirectUri,
  approval_prompt: "force",
  // read_all includes "Only Me" activities; watch uploads are often private.
  // Only daily totals are ever published.
  scope: "activity:read_all",
});

const server = createServer(async (req, res) => {
  const url = new URL(req.url, redirectUri);
  if (url.pathname !== "/callback") return res.writeHead(404).end();

  const code = url.searchParams.get("code");
  if (!code) {
    res.end(`Authorization failed: ${url.searchParams.get("error") ?? "no code"}`);
    return server.close();
  }

  const tokenRes = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
    }),
  });
  const body = await tokenRes.json();
  if (!tokenRes.ok) {
    res.end("Token exchange failed, see terminal.");
    console.error(body);
  } else {
    res.end("Done. You can close this tab.");
    console.log(`\nSTRAVA_REFRESH_TOKEN=${body.refresh_token}\n`);
  }
  server.close();
});

server.listen(PORT, () => {
  console.log(`Open this URL and approve access:\n\n${authorizeUrl}\n`);
});
