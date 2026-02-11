# UmarAsia Appliances â€” Professional Structure + Deployment Guide

## Final Project Structure

```text
project-root/
  frontend/   (Next.js + Tailwind)
  backend/    (Node.js + Express + Admin + uploads)
```

Current architecture:

- Frontend: Next.js
- Backend: Express API (store + admin APIs)
- Database: Supabase
- Admin: same backend (`/api/admin/*`)
- Images: local upload (temporary; production should use Cloudinary/Supabase Storage)

---

## 1) Local Development Run

From project root:

```powershell
cd c:\Users\game\OneDrive\Desktop\UmarAsia
```

Install dependencies:

```powershell
npm install --prefix frontend
npm install --prefix backend
```

Backend env file: `backend/.env`

Minimum variables:

- `PORT=5000`
- `NODE_ENV=development`
- `CORS_ORIGIN=http://localhost:3001`
- `USE_DUMMY_DATA=true` (until Supabase fully connected)
- `SUPABASE_URL=...`
- `SUPABASE_ANON_KEY=...`
- `JWT_SECRET=...`
- `IMAGE_TOKEN_SECRET=...`
- `ADMIN_EMAIL=admin@umarasia.com`
- `ADMIN_PASSWORD=Admin@123`

Run backend (Terminal 1):

```powershell
npm run dev --prefix backend
```

Run frontend (Terminal 2):

```powershell
npm run dev --prefix frontend -- --port 3001
```

Open:

- Store: `http://localhost:3001`
- Admin: `http://localhost:3001/admin/login`
- Hero management: `http://localhost:3001/admin/hero`

---

## 2) Supabase SQL

Run SQL from:

- `backend/supabase_schema.sql`

Important:

- `SQL 2` section in the same file adds `hero_slides` table/policies/seed.
- Execute it in Supabase SQL editor (append/update only, no destructive overwrite flow).

---

## 3) Final Deployment Architecture

- Frontend -> **Vercel**
- Backend -> **Render** (or Railway)
- Database -> **Supabase**
- Domain -> custom domain (Hostinger/Namecheap etc.)

This is the recommended practical production setup for cost + scaling + easy ops.

---

## 4) Deployment Steps (Short)

1. Push repository to GitHub
2. Deploy backend from `backend` folder on Render/Railway
3. Deploy frontend from `frontend` folder on Vercel
4. Set `NEXT_PUBLIC_API_BASE_URL` in frontend to deployed backend URL
5. Set backend `CORS_ORIGIN` to frontend domain
6. Attach custom domain on Vercel and update CORS allowlist accordingly

---

## 5) Production Security Checklist

- Disable dummy mode (`USE_DUMMY_DATA=false`)
- Keep `helmet` enabled
- Keep rate limits enabled
- Use strong secrets (`JWT_SECRET`, `IMAGE_TOKEN_SECRET`)
- Confirm Supabase RLS policies are active
- Restrict CORS to production frontend origin only

---

## 6) Image Upload Note

Local uploads are temporary only.

On Render free tier, filesystem is ephemeral and uploaded files can disappear after restart/redeploy.

For production move uploads to:

- Cloudinary (recommended), or
- Supabase Storage

---

For full deployment checklist see:

- `frontend/DEPLOYMENT_CHECKLIST.md`

