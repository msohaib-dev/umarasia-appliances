# UmarAsia Appliances

Monorepo with a Next.js App Router storefront and API routes.

## Current structure

```text
UmarAsia/
  frontend/   # Next.js App Router (UI + /app/api backend routes)
  backend/    # Supabase SQL + backend package metadata (Express runtime removed)
  server/     # legacy folder (not used by runtime)
```

## API runtime

- All backend endpoints now run from `frontend/app/api/*`.
- No Express server, no `app.listen`, no custom server.
- Deployment target is Vercel (frontend + API together).

## Build

```powershell
npm install --prefix frontend
npm run build --prefix frontend
```

## Docs

- `frontend/README.md`
- `frontend/DEPLOYMENT_CHECKLIST.md`
