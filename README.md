# web-client

React frontend for the distributed ray tracer. Users log in, pick a scene and quality, start renders, watch progress and the image appear live, cancel tasks and browse their history. Admins see every worker and all running tasks.

The client talks **only** to [web-load-balancer](../web-load-balancer). It never calls the workers directly.

> Part of the [raytracer](../) project. The other repos are [web-load-balancer](../web-load-balancer) (FastAPI gateway) and [web-ray-worker](../web-ray-worker) (C# ray tracer).

---

## Pages

| Route | Page | What it does |
|---|---|---|
| `/login`, `/register` | Auth | Get a JWT and store it |
| `/` | New render | Pick a scene, resolution and quality, see the estimated cost, then start |
| `/renders/:id` | Task view | Status, progress bar, live partial image, queue position and ETA, cancel button |
| `/history` | History | The user's past and current tasks with thumbnails, status, time, worker and resolution |
| `/admin` | Admin panel | *(admins only)* Workers with load and status, plus all running and queued tasks |

### New render form

- **Scene:** cards for the worker scenes listed in `src/scenes.ts` (`spheres`, `glass`, `random`)
- **Resolution:** presets (480p, 720p, 1080p) or custom width and height
- **Quality:** samples per pixel (e.g. 16 / 64 / 256)
- **Complexity meter:** `width × height × spp` compared with the limit, turning red when over

Validation mirrors the gateway's limits so the user gets instant feedback. The gateway still re-checks everything and is the source of truth.

| Limit | Value |
|---|---|
| Max resolution | 1920 × 1080 |
| Max samples per pixel | 256 |
| Max complexity | 150,000,000 |
| Active tasks per user | 3 |

If the user already has 3 active tasks, the Start button is disabled with an explanation.

### Task view

- A progress bar driven by WebSocket messages
- The partial image refreshes every few seconds while running, then shows the final PNG
- A **queued** state shows "Position 2 in queue, about 40 s wait"
- The worker name is shown, so load balancing is visible in the demo
- Cancel works for both queued and running tasks
- Done tasks get a Download PNG button

### Admin panel

- A worker list showing name, status (up or down), `running / capacity` and a load bar
- Running and queued tasks across all users
- Auto-refresh every 2 seconds
- Optional: a small chart of total load over time

---

## API used

All requests go to the gateway. Authenticated requests send `Authorization: Bearer <jwt>`.

| Method | Path | Used by |
|---|---|---|
| `POST` | `/auth/register`, `/auth/login` | Auth pages |
| `POST` | `/renders` | Start button |
| `GET` | `/renders` | History |
| `GET` | `/renders/{id}` | Task view (initial load, polling fallback) |
| `GET` | `/renders/{id}/image` | Task view, history thumbnails |
| `DELETE` | `/renders/{id}` | Cancel button |
| `WS` | `/ws/renders/{id}?token=<jwt>` | Live progress |
| `GET` | `/admin/renderers`, `/admin/tasks` | Admin panel |

Task statuses: `queued → running → done | cancelled | failed`.

### Two details to get right

- **Images need auth.** `<img src="/renders/1/image">` can't send the `Authorization` header. Fetch the image with the token, turn it into a blob, and use `URL.createObjectURL(blob)` as the `src`. Revoke the old URL when refreshing.
- **WebSockets can't send headers either.** Pass the JWT as a `?token=` query parameter and have the gateway check it.

---

## Tech stack

React 18 · TypeScript · Vite · React Router · TanStack Query (fetching, caching, polling) · a small `fetch` wrapper that adds the token and handles `401` by redirecting to login · plain CSS or Tailwind

## Project structure

```
web-client/
├── src/
│   ├── main.tsx, App.tsx      # router, providers
│   ├── api/
│   │   ├── client.ts          # fetch wrapper with JWT
│   │   ├── renders.ts         # render endpoints
│   │   └── useRenderSocket.ts # WebSocket hook for progress
│   ├── auth/                  # AuthContext, login/register pages, ProtectedRoute
│   ├── pages/
│   │   ├── NewRender.tsx
│   │   ├── TaskView.tsx
│   │   ├── History.tsx
│   │   └── Admin.tsx
│   ├── components/            # ProgressBar, ComplexityMeter, RenderImage, StatusBadge
│   ├── limits.ts              # same limits as the gateway
│   └── scenes.ts              # scene list (the gateway has no GET /scenes)
├── index.html
├── vite.config.ts             # dev proxy to the gateway (/api)
├── nginx.conf                 # production proxy and SPA fallback
├── Dockerfile
└── package.json
```

## Running

**Development:**

```bash
npm install
npm run dev        # http://localhost:5173
```

The client calls the API under `/api/...`. `vite.config.ts` proxies that prefix to the gateway and strips it, so there is no CORS setup and page routes like `/renders/:id` or `/admin` never clash with API paths:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      ws: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

**Production build:**

```bash
npm run build      # outputs dist/
```

`dist/` is static files. The `Dockerfile` builds them with Node and serves them with nginx. `nginx.conf` falls back to `index.html` for client-side routes and proxies `/api/` (HTTP and WebSocket) to `load-balancer:8000`, exactly like the dev proxy. The browser still only talks to one origin.

**Whole system:** run `docker compose up --build` from the main `raytracer` repo and open http://localhost:8080.

## Roadmap

- [x] Vite + React + TypeScript project, routing, layout
- [x] Login and register, token storage, protected routes
- [x] New render form with client-side validation and the complexity meter
- [x] Task view with polling first (progress + partial image)
- [x] Switch progress to WebSocket
- [x] History page with thumbnails
- [x] Queue position and ETA display
- [x] Admin panel
- [x] Dockerfile with nginx serving the static build

## Backlog

- [ ] Before/after slider comparing low and high quality renders
- [ ] Scene customisation UI (camera, number of spheres, materials)
- [ ] Load-over-time chart in the admin panel
