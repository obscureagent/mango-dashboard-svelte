# 🥭 Mango Dashboard — Svelte Implementation

A modern, responsive dashboard for managing Minecraft servers via the Mango v3 API, built with **Svelte + Vite**.

## Features

✅ **Auth System** — Login/register with JWT  
✅ **Server Management** — List, start, stop, restart servers  
✅ **Real-time Stats** — CPU, memory, player count, uptime  
✅ **Server Console** — Send commands, view output (simulated)  
✅ **Mock API** — Full testing without the real backend  
✅ **Responsive Design** — Dark mode, clean UI  

## Tech Stack

- **Svelte 4** — Reactive, lightweight UI
- **Vite** — Fast dev server & build
- **TypeScript** — Type-safe stores & components
- **Express.js** — Mock API server
- **Tailwind-inspired CSS** — Custom dark theme

## Getting Started

### Run Everything Together

```bash
npm install
npm run dev:full
```

This starts:
- 🎨 Vite dev server on `http://localhost:5173`
- 🔌 Mock API on `http://localhost:5174`

### Or Separately

```bash
# Terminal 1: Mock API
npm run dev:mock

# Terminal 2: Dev server
npm run dev
```

## Test Credentials

```
Email: test@example.com
Password: password123
```

Mock servers will load automatically. You can start/stop/restart them in the UI.

## Project Structure

```
src/
  ├── App.svelte           # Main layout & routing
  ├── pages/
  │   ├── Login.svelte     # Auth (login & register)
  │   ├── ServerList.svelte # Server grid
  │   └── ServerDetail.svelte # Console, stats, controls
  ├── stores/
  │   ├── auth.ts          # Auth state & API calls
  │   └── servers.ts       # Server state & API calls
  ├── app.css              # Global styles & dark theme
  └── main.ts              # Entry point

mock-api.ts                 # Mock backend (Express)
```

## API Endpoints (Mock)

All authenticated requests need `Authorization: Bearer <email>`

### Auth
- `POST /mock/auth/login` — Login
- `POST /mock/auth/register` — Register

### Servers
- `GET /mock/servers` — List all
- `GET /mock/servers/:id` — Get one
- `POST /mock/servers/:id/start` — Start
- `POST /mock/servers/:id/stop` — Stop
- `POST /mock/servers/:id/restart` — Restart

## Next Steps (When Connecting to Real API)

1. Update `src/stores/auth.ts` — Change base URL from `localhost:5174` to real API
2. Update `src/stores/servers.ts` — Same
3. Add WebSocket support for console & live events
4. Implement file manager (browse/upload/download)
5. Add admin panel (user management)

## Building for Production

```bash
npm run build
npm run preview
```

Outputs to `dist/` — ready to deploy!

---

**Built with ❤️ in Svelte** | [Mango v3 API Docs](https://github.com/obscurecomputer/mangov3)
