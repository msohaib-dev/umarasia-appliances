# UmarAsia Appliances — Project Root README

Yes — core restructuring is done.

Current working structure:

```text
UmarAsia/
  frontend/   # Next.js + Tailwind app
  backend/    # Node.js + Express API (store + admin)
  server/     # old leftover empty folder (safe to remove when unlocked)
```

## What is completed

- Frontend and backend are separated into dedicated folders.
- Backend references updated for shared data path usage with new layout.
- Deployment docs updated for professional architecture:
  - Frontend -> Vercel
  - Backend -> Render/Railway
  - Database -> Supabase
  - Domain -> custom domain
- Frontend build check completed successfully from `frontend`.

## Local run

From project root:

```powershell
npm install --prefix frontend
npm install --prefix backend
npm run dev --prefix backend
npm run dev --prefix frontend -- --port 3001
```

## Deployment quick map

- Vercel root directory: `frontend`
- Render/Railway root directory: `backend`
- Supabase SQL file: `backend/supabase_schema.sql` (including `SQL 2` section)

## One pending cleanup item

If present, remove old locked folder when no process is using it:

```powershell
rmdir /s /q server
```

---

Detailed docs:

- `frontend/README.md`
- `frontend/DEPLOYMENT_CHECKLIST.md`
