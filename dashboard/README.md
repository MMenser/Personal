# Pi command center

A private dashboard for the Pi that shows live system stats. It is a separate app
from the public site. Nothing from it ships in `dist/`, and it's only reachable
over Tailscale.

```
browser (tailnet device) → tailscale serve (HTTPS, tailnet only) → node server on 127.0.0.1:8787
                                                                      ├─ /api/stats  (samples every 2s)
                                                                      └─ dist-dashboard/ (built UI)
```

nginx keeps serving the public site. It doesn't know about the dashboard.

## Local development

```
npm run dashboard:server   # stats API on 127.0.0.1:8787 (temp/throttle show as unavailable off-Pi)
npm run dashboard:dev      # UI on http://localhost:5174, proxies /api to the server
```

## Deploy on the Pi

1. Build the UI:
   ```
   npm run dashboard:build
   ```
2. Run the server under systemd. First edit `User` and `WorkingDirectory` in
   `deploy/pi-dashboard.service`, then:
   ```
   sudo cp dashboard/deploy/pi-dashboard.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable --now pi-dashboard
   curl -s localhost:8787/api/stats | head -c 200   # sanity check
   ```
   The server needs Node 18.15+ (for `fs.statfs`).
3. Expose it to your tailnet only:
   ```
   sudo tailscale serve --bg 8787
   tailscale serve status
   ```
   Then open `https://<pi-name>.<tailnet>.ts.net` from any of your Tailscale devices.
   The first time, you may need to enable MagicDNS and HTTPS certificates in the
   Tailscale admin console (DNS page).

Don't use `tailscale funnel` for this port. Funnel makes it public.

To update later: `git pull && npm run dashboard:build && sudo systemctl restart pi-dashboard`.

## Environment variables

| Variable    | Default     | Purpose                        |
|-------------|-------------|--------------------------------|
| `HOST`      | `127.0.0.1` | Interface to bind              |
| `PORT`      | `8787`      | Port to bind                   |
| `DISK_PATH` | `/`         | Filesystem shown in Disk tile  |
