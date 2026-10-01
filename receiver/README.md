# Workout receiver

Accepts workout data from the iOS app over the internet and stores it on the Pi.

```
iPhone ──HTTPS──▶ Cloudflare ──tunnel──▶ cloudflared ──▶ nginx (/workouts) ──▶ node receiver on 127.0.0.1:8788
                                                                               └─ appends to workouts.jsonl
```

After every upload it also merges the workouts into `DB_FILE` (default
`workouts-db.json` next to `DATA_FILE`), a JSON array with one entry per workout
id. IDs already in the database are skipped. If anything new was added, it
rewrites `ACTIVITY_FILE` (default `public/activity.json`), which is what the
website's workout graph reads. That file contains only the Pacific-time dates in
the last 365 days that had a workout. On first start, the database is seeded
from the existing `DATA_FILE`. See `activity.mjs`.

The receiver binds to localhost only. The only way in is nginx forwarding
`/workouts`. The dashboard (port 8787) stays on Tailscale only.

## API

| Request | Response |
|---|---|
| `POST /workouts` with `Authorization: Bearer <token>` and `Content-Type: application/json`, body is one workout object or an array of them | `201 {"ok":true,"received":N}` |
| Missing or wrong token | `401` (10 failures from one IP within 15 min → `429` for that IP) |
| Not JSON / wrong content type / body over 10 MB | `400` / `415` / `413` |
| `GET /health` (no auth) | `200 {"ok":true}` |

Each workout is stored as one line: `{"receivedAt":"<ISO time>","workout":{...as sent...}}`.

## Setup on the Pi

### 1. Generate the token into `receiver/.env`

```
echo "WORKOUT_TOKEN=$(npm run -s receiver:token)" > receiver/.env
chmod 600 receiver/.env
cat receiver/.env   # copy the token into the iOS app, then clear your terminal
```

`receiver/.env` is gitignored, so it never reaches GitHub. Run
`git check-ignore receiver/.env` to confirm; it should print the path. See
`.env.example` for the format. The server loads this file itself, which needs
Node 20.12 or newer. Variables already set in the environment take precedence.

To rotate the token, repeat this step, restart the service, and update the app.

### 2. Run the receiver with systemd

If your Pi user or repo path differ, edit `User`, `WorkingDirectory` and `DATA_FILE` in `deploy/workout-receiver.service` first.

If Node was installed with nvm, systemd can't find it (`env: 'node': No such file or directory`).
Link it somewhere systemd can see. Rerun this after switching Node versions with nvm:

```
sudo ln -sf "$(which node)" /usr/local/bin/node
```

Then:

```
sudo cp receiver/deploy/workout-receiver.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now workout-receiver
curl -s localhost:8788/health
```

### 3. Route `masonmenser.com/workouts` to the receiver in nginx

The tunnel already sends `masonmenser.com` to nginx, so the tunnel doesn't need to
change. In the nginx `server` block for the site, add:

```nginx
location = /workouts {
    proxy_pass http://127.0.0.1:8788;
    client_max_body_size 10m;   # nginx defaults to 1 MB; workouts with routes/HR can be bigger
}
```

nginx checks exact-match (`=`) locations before `location /`, so the site's
`index.html` fallback can't swallow this route. Request headers, including Cloudflare's
`CF-Connecting-IP`, are forwarded, so the per-IP lockout still sees real client IPs.

```
sudo nginx -t && sudo systemctl reload nginx
```

`/health` isn't routed publicly. Check it on the Pi with `curl localhost:8788/health`.

### 4. Test from outside

```
# No token: expect 401 with {"error":"Unauthorized"}. That JSON proves nginx forwarded the request to the receiver.
curl -i -X POST https://masonmenser.com/workouts -H "Content-Type: application/json" -d '{}'

# With the token: expect 201
curl -i -X POST https://masonmenser.com/workouts   -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"   -d '{"type":"test"}'
```

## iOS app

Send the token in the `Authorization` header. Store it in the Keychain, not in
source code, because anything compiled into the app can be extracted from it.

```swift
var request = URLRequest(url: URL(string: "https://masonmenser.com/workouts")!)
request.httpMethod = "POST"
request.setValue("application/json", forHTTPHeaderField: "Content-Type")
request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
request.httpBody = try JSONEncoder().encode(workouts)
let (_, response) = try await URLSession.shared.data(for: request)
// Treat anything other than 201 as "not delivered" and retry later.
```

## Optional hardening

- **Cloudflare WAF rate limiting** on `masonmenser.com/workouts`. This stops floods
  before they reach the Pi.
- **Cloudflare Access service token.** Requires `CF-Access-Client-Id` and
  `CF-Access-Client-Secret` headers at Cloudflare's edge, as a second layer on top of the
  bearer token.
