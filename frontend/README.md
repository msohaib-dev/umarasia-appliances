# UmarAsia Appliances Frontend

Next.js App Router application with integrated API route handlers under `app/api`.

## Architecture

- UI: Next.js App Router
- API: Next.js Route Handlers (`frontend/app/api/*`)
- Database: Supabase (service role key on server routes only)
- Admin Auth: JWT in `httpOnly` cookie
- Uploads: Supabase Storage (`/api/upload`)

## Local run

```powershell
npm install --prefix frontend
npm run dev --prefix frontend -- --port 3001
```

Open:

- Store: `http://localhost:3001`
- Admin: `http://localhost:3001/admin/login`

## Build

```powershell
npm run build --prefix frontend
```

## Supabase schema

Run SQL file:

- `backend/supabase_schema.sql`

## Deployment

Deploy `frontend` on Vercel.

For required environment variables and go-live checks, see:

- `frontend/DEPLOYMENT_CHECKLIST.md`


