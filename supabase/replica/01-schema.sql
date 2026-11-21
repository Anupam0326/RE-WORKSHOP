-- =====================================================================================================================
-- Re Workshop — database schema, part 1 of 3
--
-- Rebuilds the Re Workshop database on a NEW, EMPTY Supabase project: 5 tables, their constraints and indexes,
-- 6 functions, 4 triggers, row-level security, the "product-images" storage bucket and its policies.
--
-- Copied from the live project (ref gzrrwncbouybfitcvkqw) on 18 Nov 2026.
-- Run it once, as the postgres role: Supabase dashboard → SQL Editor → paste → Run (or psql with the project's
-- connection string). It runs as one transaction: if any statement fails, nothing is applied.
--
-- Three deliberate differences from the live project (all tighter, none changes what the website can do):
--   1. Table privileges are granted explicitly and minimally (anon: read; authenticated: read and write), instead of
--      relying on Supabase's default "all privileges" grants. Row-level security still decides every row.
--   2. The three reorder_* functions are not executable by anon (on the live project anon may call them, but they
--      refuse anyone who is not an admin anyway).
--   3. Admins get a SELECT policy on their bucket's files. Supabase Storage needs SELECT as well as DELETE to remove
--      a file; without it, deleting a photo in /admin removes the database row but leaves the file behind.
-- =====================================================================================================================

begin;

-- ---------------------------------------------------------------------------------------------------------------------
-- 0. Private schema: holds the admin check. It is NOT exposed through the Data API (leave it out of
--    Settings → API → Exposed schemas). anon and authenticated need USAGE because the public read policies call
--    private.is_admin().
-- ---------------------------------------------------------------------------------------------------------------------
create schema if not exists private;
grant usage on schema private to anon, authenticated;

-- ---------------------------------------------------------------------------------------------------------------------
-- 1. Tables (column order matches the live project)
-- ---------------------------------------------------------------------------------------------------------------------

-- Who may use /admin. A signed-in Supabase Auth user is an admin when their email is in this table.
create table public.admins (
  email      text        primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

-- Store shelves (the website calls them shelves; the database calls them categories).
create table public.categories (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text        not null check (char_length(name) >= 1 and char_length(name) <= 80),
  short_name  text        not null default '' check (char_length(short_name) <= 40),
  eyebrow     text        not null default '' check (char_length(eyebrow) <= 120),
  description text        not null default '' check (char_length(description) <= 400),
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.products (
  id                uuid        primary key default gen_random_uuid(),
  slug              text        not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name              text        not null check (char_length(name) >= 1 and char_length(name) <= 120),
  category_id       uuid        not null references public.categories (id) on delete restrict,
  group_label       text        not null default '' check (char_length(group_label) <= 60),   -- sub-shelf heading
  pack_size         text        not null default '' check (char_length(pack_size) <= 40),
  price_inr         numeric              default 0 check (price_inr >= 0),                   -- null = price on request
  description       text        not null default '' check (char_length(description) <= 2000),
  details           text[]      not null default '{}',                                       -- short chips, e.g. "Wood pressed"
  featured          boolean     not null default false,
  is_active         boolean     not null default true,                                       -- false = hidden from the public
  sort_order        integer     not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  availability_note text        not null default '' check (char_length(availability_note) <= 40), -- e.g. "Winter only"
  origin            jsonb       not null default '{}'::jsonb,                                -- grain tracker (farm, village, harvest…)
  constraint products_origin_shape check (jsonb_typeof(origin) = 'object' and pg_column_size(origin) <= 4000)
);

-- Up to 5 photos per product (enforced by a trigger below). url / url_small are either site paths such as
-- /products/v2/<slug>-1-960.webp (files shipped with the website) or public Storage URLs for photos uploaded in /admin;
-- storage_paths lists the Storage files to delete with the row (empty for site paths).
create table public.product_images (
  id            uuid        primary key default gen_random_uuid(),
  product_id    uuid        not null references public.products (id) on delete cascade,
  url           text        not null,
  url_small     text,
  storage_paths text[]      not null default '{}',
  sort_order    integer     not null default 0,
  created_at    timestamptz not null default now()
);

-- Photos for fixed places on the website ("site photo slots", /admin → Site photos), keyed by slot name.
create table public.site_media (
  key           text        primary key check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  url           text        not null,
  url_small     text,
  storage_paths text[]      not null default '{}',
  alt           text        not null default '' check (char_length(alt) <= 200),
  updated_at    timestamptz not null default now(),
  caption       text        not null default '' check (char_length(caption) <= 60)
);

create index product_images_product_sort_idx on public.product_images (product_id, sort_order);
create index products_category_sort_idx     on public.products (category_id, sort_order);

-- ---------------------------------------------------------------------------------------------------------------------
-- 2. Functions
-- ---------------------------------------------------------------------------------------------------------------------

-- True when the caller is signed in and their email is in public.admins. SECURITY DEFINER so it can read auth.users.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path to ''
as $function$
  select exists (
    select 1
    from auth.users u
    join public.admins a on a.email = lower(u.email)
    where u.id = auth.uid()
  );
$function$;

revoke execute on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path to ''
as $function$
begin
  new.updated_at := now();
  return new;
end $function$;

create or replace function public.enforce_max_product_images()
returns trigger
language plpgsql
set search_path to ''
as $function$
begin
  if (select count(*) from public.product_images where product_id = new.product_id) >= 5 then
    raise exception 'A product can have at most 5 images' using errcode = 'check_violation';
  end if;
  return new;
end $function$;

-- Drag-to-reorder in /admin: the array order becomes sort_order 1, 2, 3…
create or replace function public.reorder_categories(p_ids uuid[])
returns void
language plpgsql
set search_path to ''
as $function$
begin
  if not private.is_admin() then raise exception 'Not allowed' using errcode = '42501'; end if;
  update public.categories c set sort_order = o.pos from unnest(p_ids) with ordinality as o(id, pos) where c.id = o.id;
end $function$;

create or replace function public.reorder_products(p_ids uuid[])
returns void
language plpgsql
set search_path to ''
as $function$
begin
  if not private.is_admin() then raise exception 'Not allowed' using errcode = '42501'; end if;
  update public.products p set sort_order = o.pos from unnest(p_ids) with ordinality as o(id, pos) where p.id = o.id;
end $function$;

create or replace function public.reorder_product_images(p_ids uuid[])
returns void
language plpgsql
set search_path to ''
as $function$
begin
  if not private.is_admin() then raise exception 'Not allowed' using errcode = '42501'; end if;
  update public.product_images i set sort_order = o.pos from unnest(p_ids) with ordinality as o(id, pos) where i.id = o.id;
end $function$;

revoke execute on function public.reorder_categories(uuid[])     from public, anon;
revoke execute on function public.reorder_products(uuid[])       from public, anon;
revoke execute on function public.reorder_product_images(uuid[]) from public, anon;
grant  execute on function public.reorder_categories(uuid[])     to authenticated, service_role;
grant  execute on function public.reorder_products(uuid[])       to authenticated, service_role;
grant  execute on function public.reorder_product_images(uuid[]) to authenticated, service_role;

-- ---------------------------------------------------------------------------------------------------------------------
-- 3. Triggers
-- ---------------------------------------------------------------------------------------------------------------------
create trigger categories_touch        before update on public.categories     for each row execute function public.touch_updated_at();
create trigger products_touch          before update on public.products       for each row execute function public.touch_updated_at();
create trigger site_media_touch        before update on public.site_media     for each row execute function public.touch_updated_at();
create trigger product_images_max_five before insert on public.product_images for each row execute function public.enforce_max_product_images();

-- ---------------------------------------------------------------------------------------------------------------------
-- 4. Table privileges (row-level security below decides which rows)
-- ---------------------------------------------------------------------------------------------------------------------
revoke all on public.admins, public.categories, public.products, public.product_images, public.site_media from anon, authenticated;
grant select                         on public.categories, public.products, public.product_images, public.site_media to anon;
grant select, insert, update, delete on public.categories, public.products, public.product_images, public.site_media to authenticated;
grant select                         on public.admins to authenticated;
grant all                            on public.admins, public.categories, public.products, public.product_images, public.site_media to service_role;

-- ---------------------------------------------------------------------------------------------------------------------
-- 5. Row-level security: everyone reads the catalogue (hidden products and their photos only for admins);
--    only admins write. The admins table is readable by admins only and has no write policy at all: add or remove
--    admins in the SQL editor.
-- ---------------------------------------------------------------------------------------------------------------------
alter table public.admins         enable row level security;
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.product_images enable row level security;
alter table public.site_media     enable row level security;

create policy "Admins can see the admin list" on public.admins
  for select to authenticated using ((select private.is_admin()));

create policy "Categories are public" on public.categories
  for select to anon, authenticated using (true);
create policy "Admins insert categories" on public.categories
  for insert to authenticated with check ((select private.is_admin()));
create policy "Admins update categories" on public.categories
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete categories" on public.categories
  for delete to authenticated using ((select private.is_admin()));

create policy "Visible products are public" on public.products
  for select to anon, authenticated using (is_active or (select private.is_admin()));
create policy "Admins insert products" on public.products
  for insert to authenticated with check ((select private.is_admin()));
create policy "Admins update products" on public.products
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete products" on public.products
  for delete to authenticated using ((select private.is_admin()));

create policy "Images of visible products are public" on public.product_images
  for select to anon, authenticated using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id and (p.is_active or (select private.is_admin()))
    )
  );
create policy "Admins insert images" on public.product_images
  for insert to authenticated with check ((select private.is_admin()));
create policy "Admins update images" on public.product_images
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete images" on public.product_images
  for delete to authenticated using ((select private.is_admin()));

create policy "Site media is public" on public.site_media
  for select to anon, authenticated using (true);
create policy "Admins insert site media" on public.site_media
  for insert to authenticated with check ((select private.is_admin()));
create policy "Admins update site media" on public.site_media
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins delete site media" on public.site_media
  for delete to authenticated using ((select private.is_admin()));

-- ---------------------------------------------------------------------------------------------------------------------
-- 6. Storage: one public bucket for every uploaded photo (products under <product id>/, site photos under
--    site/<slot>/). Public = anyone can view a file by its URL; only admins upload, replace or delete.
--    5 MB per file; WebP, JPEG or PNG only (the admin page compresses every upload to WebP, or JPEG in browsers
--    that cannot make WebP, as a 1400 px and a 600 px copy).
-- ---------------------------------------------------------------------------------------------------------------------
--    If this project does not let the SQL editor change storage (rare), the block below only warns, the rest still
--    applies, and 03-verify.sql reports what is missing: then create the bucket and the four policies by hand in
--    Dashboard → Storage with exactly these settings.
do $storage$
begin
  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('product-images', 'product-images', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
  on conflict (id) do update
    set public = excluded.public,
        file_size_limit = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;

  drop policy if exists "Admins upload product images" on storage.objects;
  drop policy if exists "Admins update product images" on storage.objects;
  drop policy if exists "Admins delete product images" on storage.objects;
  drop policy if exists "Admins read product images"   on storage.objects;

  create policy "Admins upload product images" on storage.objects
    for insert to authenticated with check (bucket_id = 'product-images' and (select private.is_admin()));
  create policy "Admins update product images" on storage.objects
    for update to authenticated using (bucket_id = 'product-images' and (select private.is_admin()));
  create policy "Admins delete product images" on storage.objects
    for delete to authenticated using (bucket_id = 'product-images' and (select private.is_admin()));
  -- Not on the live project (difference 3 above): Storage needs SELECT to delete or replace a file.
  create policy "Admins read product images" on storage.objects
    for select to authenticated using (bucket_id = 'product-images' and (select private.is_admin()));
exception when others then
  raise warning 'Storage setup skipped (%). Create the bucket and its 4 policies in Dashboard → Storage.', sqlerrm;
end
$storage$;

-- ---------------------------------------------------------------------------------------------------------------------
-- 7. Newer Supabase projects may come with an event trigger that switches RLS on for every new table, run by a
--    SECURITY DEFINER function public.rls_auto_enable(). Keep it, but make sure the API roles cannot call it
--    (the live project has it the same way). Nothing happens if the function does not exist.
-- ---------------------------------------------------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'rls_auto_enable'
  ) then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end $$;

commit;
