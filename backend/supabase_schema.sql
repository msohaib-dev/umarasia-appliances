-- UmarAsia-Appliances final production schema (Phase 3)
-- Run in Supabase SQL Editor.

create extension if not exists "pgcrypto";

-- 1) categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  price numeric(12, 2) not null check (price >= 0),
  old_price numeric(12, 2) check (old_price is null or old_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  category_id uuid references public.categories(id) on delete set null,
  images jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '[]'::jsonb,
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text,
  city text not null,
  address text not null,
  items jsonb not null,
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  status text not null default 'Pending',
  created_at timestamptz not null default now()
);

-- 3.1) contact_messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- 4) admins
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password text not null,
  created_at timestamptz not null default now()
);

-- indexes
create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at desc);

-- updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

-- Row Level Security
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admins enable row level security;

-- clear existing policies safely
drop policy if exists categories_select_public on public.categories;
drop policy if exists categories_modify_admin on public.categories;

drop policy if exists products_select_public on public.products;
drop policy if exists products_modify_admin on public.products;

drop policy if exists orders_insert_public on public.orders;
drop policy if exists orders_read_admin on public.orders;
drop policy if exists orders_update_admin on public.orders;

drop policy if exists contact_messages_insert_public on public.contact_messages;
drop policy if exists contact_messages_read_admin on public.contact_messages;

drop policy if exists admins_all_admin_only on public.admins;

-- categories
create policy categories_select_public
on public.categories
for select
to public
using (true);

create policy categories_modify_admin
on public.categories
for all
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- products
create policy products_select_public
on public.products
for select
to public
using (true);

create policy products_modify_admin
on public.products
for all
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- orders
create policy orders_insert_public
on public.orders
for insert
to public
with check (true);

create policy orders_read_admin
on public.orders
for select
to authenticated
using (auth.role() = 'authenticated');

create policy orders_update_admin
on public.orders
for update
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- contact messages
create policy contact_messages_insert_public
on public.contact_messages
for insert
to public
with check (true);

create policy contact_messages_read_admin
on public.contact_messages
for select
to authenticated
using (auth.role() = 'authenticated');

-- admins (no public access)
create policy admins_all_admin_only
on public.admins
for all
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- SQL 2:
-- Hero slides table for admin-managed homepage hero content

create table if not exists public.hero_slides (
  id bigserial primary key,
  title text not null,
  subtitle text not null,
  image text not null,
  sort_order integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_hero_slides_sort_order on public.hero_slides(sort_order);

drop trigger if exists trg_hero_slides_updated_at on public.hero_slides;
create trigger trg_hero_slides_updated_at
before update on public.hero_slides
for each row
execute function public.set_updated_at();

alter table public.hero_slides enable row level security;

drop policy if exists hero_slides_select_public on public.hero_slides;
drop policy if exists hero_slides_modify_admin on public.hero_slides;

create policy hero_slides_select_public
on public.hero_slides
for select
to public
using (is_active = true);

create policy hero_slides_modify_admin
on public.hero_slides
for all
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

insert into public.hero_slides (title, subtitle, image, sort_order, is_active)
select
  v.title,
  v.subtitle,
  v.image,
  v.sort_order,
  v.is_active
from (
  values
    (
      'Reliable DC Performance for Every Power Situation',
      'Engineered appliances built for Pakistan''s load-shedding reality with efficient operation and dependable daily performance.',
      'https://images.unsplash.com/photo-1581092921461-7031e4d9f2f6?auto=format&fit=crop&w=1400&q=80',
      1,
      true
    ),
    (
      'Energy-Efficient Appliances for Homes and Workshops',
      'From DC fans to heavy-duty motors, UmarAsia-Appliances delivers practical solutions with engineering-grade durability.',
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1400&q=80',
      2,
      true
    ),
    (
      'Built for Practical Buyers Across Pakistan',
      'Professional product range for shops, small businesses, and households that need trustworthy electrical performance.',
      'https://images.unsplash.com/photo-1581092160607-ee22731f9c5b?auto=format&fit=crop&w=1400&q=80',
      3,
      true
    )
) as v(title, subtitle, image, sort_order, is_active)
where not exists (select 1 from public.hero_slides limit 1);


