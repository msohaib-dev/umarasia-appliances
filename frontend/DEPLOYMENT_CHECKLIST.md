# UmarAsia Production Deployment Checklist

## 1) Frontend (Vercel)

Set in Vercel Project Settings -> Environment Variables:

- `NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com`

Build/Runtime:

- Framework: Next.js
- Build command: `npm run build`
- Start command: `npm run start`

## 2) Backend (Render/Railway)

Set environment variables:

- `NODE_ENV=production`
- `PORT=5000` (or platform-provided)
- `PUBLIC_API_BASE_URL=https://your-backend-domain.com`
- `CORS_ORIGIN=https://your-frontend-domain.vercel.app`
- `JWT_SECRET=<strong-random-secret>`
- `IMAGE_TOKEN_SECRET=<strong-random-secret>`
- `ADMIN_EMAIL=<admin-email>`
- `ADMIN_PASSWORD=<strong-admin-password>`
- `SUPABASE_URL=<your-supabase-url>`
- `SUPABASE_SERVICE_ROLE_KEY=<service-role-key>`
- `USE_DUMMY_DATA=false`
- `RATE_LIMIT_WINDOW_MS=900000`
- `RATE_LIMIT_MAX=300`
- `AUTH_RATE_LIMIT_WINDOW_MS=900000`
- `AUTH_RATE_LIMIT_MAX=20`

Render suggested service settings:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node app.js`

Notes:

- In production, app enforces HTTPS and strict CORS allowlist.
- In production, dummy mode is disabled by code path.
- If Supabase keys are missing in production, backend fails fast.

## 3) Supabase

- Run `backend/supabase_schema.sql` in SQL editor.
- Confirm tables exist: `categories`, `products`, `orders`, `admins`.
- Confirm RLS and policies are enabled.

Also run `SQL 2` section in same file for `hero_slides`.

## 4) End-to-end QA flow (must pass)

### Admin

1. Login at `/admin/login`.
2. Create product with image.
3. Edit product fields and save.
4. Delete product.
5. Create/edit/delete category.
6. Change order status in admin orders.

### Storefront

1. Search suggestions + result navigation works.
2. Add to cart, update quantity, remove item, clear cart.
3. Checkout validation and successful order creation.
4. Contact form validation and successful submission.
5. Order success page renders order details.

### Stability

1. No 404 for implemented routes.
2. No CORS errors in browser console.
3. No unhandled promise rejections.
4. Protected image routes respond with no-store headers.
