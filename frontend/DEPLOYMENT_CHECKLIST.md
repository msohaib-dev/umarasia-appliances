# UmarAsia Production Deployment Checklist (Vercel Only)

## 1) Vercel Project (frontend)

Set in Vercel Project Settings -> Environment Variables:

- `SUPABASE_URL=<your-supabase-url>`
- `SUPABASE_SERVICE_ROLE_KEY=<service-role-key>`
- `JWT_SECRET=<strong-random-secret>`
- `IMAGE_TOKEN_SECRET=<strong-random-secret>`
- `ADMIN_EMAIL=<admin-email>`
- `ADMIN_PASSWORD=<strong-admin-password>`
- `SUPABASE_STORAGE_BUCKET=<bucket-name>` (optional, defaults to `product-images`)
- `NEXT_PUBLIC_API_BASE_URL=` (optional, keep empty for same-origin API)

Build/Runtime:

- Framework: Next.js
- Root Directory: `frontend`
- Build command: `npm run build`
- Start command: `npm run start`

## 2) Supabase

- Run `backend/supabase_schema.sql` in SQL editor.
- Ensure tables exist and policies are applied.
- Ensure storage bucket exists for uploads.

## 3) End-to-end QA flow (must pass)

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
4. `/api/admin/*` routes reject unauthorized requests.
