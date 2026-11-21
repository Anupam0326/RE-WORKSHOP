# Rebuild the Re Workshop database on a new Supabase project

**For:** an AI agent or developer with admin access to a new, empty Supabase project.
**Result:** an exact working copy of the live Re Workshop database: same tables, rules, security, storage bucket and every row. The website (www.reworkshop.store) then runs on it after three settings change.
**Source:** live project `gzrrwncbouybfitcvkqw`, copied on 18 Nov 2026. Everything below was read from that project, not written from memory. The three SQL files were tested together on Postgres: every count and fingerprint matched the live project.

Read the whole document once before running anything. The steps are in order; each one says how to know it worked.

---

## Rules for whoever runs this

1. **Never create, choose, store or ask for a password.** The admin login is made by a person in the Supabase dashboard (step 5).
2. **Never put a secret key (`sb_secret_…` or a `service_role` key) in the website code, the repo, a commit, a document or a chat message.** Only step 4 needs one, and only in a shell variable on the machine running the commands.
3. **Do not change the old project** (`gzrrwncbouybfitcvkqw`). It keeps serving the live site until step 6 is checked.
4. Run the SQL files **as they are, in order, each one whole**. Do not edit, split or "improve" them; the checks in step 3 compare against fingerprints of the original rows.
5. If any step fails, **stop and report** the exact error. Do not work around it by switching off row-level security or widening a policy.

---

## What the database holds (and what it does not)

| Table | Rows | What the website uses it for |
|---|---|---|
| `categories` | 4 | The store's shelves (Grains & Flours; Dals, Oils & Pantry Staples; Snacks & Premixes; Soaps & Décor). |
| `products` | 57 | Every product: name, pack size, price in ₹ (null = price on request), sub-shelf (`group_label`), chips (`details`), `featured`, `is_active` (false hides it), `availability_note`, `origin` (grain tracker, empty for all today). |
| `product_images` | 162 | Up to 5 photos per product, in `sort_order`. |
| `site_media` | 1 | Photos for fixed places on the site, set in /admin → Site photos. Only `story-today` is set; every other place uses the photo that ships with the site. |
| `admins` | 1 | Emails allowed into /admin. A signed-in user is an admin only if their email is listed here. |

Plus: 6 functions, 4 triggers, 21 security policies, and one public Storage bucket, `product-images`.

**Not in the database, so nothing to copy:**
- The product photo files. All 162 photo rows point to files that ship with the website (`client/public/products/…`), not to Supabase Storage.
- Site text, the café's popular dishes, page photos and the menu. They live in the website code.
- Orders or customers. The site takes orders on WhatsApp; there are no such tables.

**In Supabase Storage on the old project:** 10 files. Only 2 are used (the `story-today` photo, step 4). The other 8 are leftovers from early product uploads under `d40978a4-88c8-4677-9d4f-ed06c7c0c1f1/`, which no row points to. Do not copy them.

**How it works, in one paragraph:** the website reads the catalogue with the project's publishable key, as the `anon` role. Row-level security lets anyone read categories, site photos, visible products and their photos. The admin page (/admin) signs in with Supabase Auth (email and password). A signed-in user may write only when `private.is_admin()` finds their email in `public.admins`. A trigger caps photos at 5 per product. Three `reorder_*` functions save drag-to-reorder. Uploads go to the `product-images` bucket: `<product id>/` for product photos, `site/<slot>/` for site photos. The bucket is public to view; only admins may write to it.

---

## Before you start

You need:
- **A new, empty Supabase project.** Any region; Mumbai (`ap-south-1`) is closest to the customers. Note its **project ref**, the part before `.supabase.co` in its URL.
- **A way to run SQL as the `postgres` role.** Any of:
  - Dashboard → **SQL Editor**: paste a whole file and press Run.
  - `psql "<connection string>" -v ON_ERROR_STOP=1 -f <file>` (connection string from Dashboard → Connect).
  - The Supabase MCP tool `execute_sql`, given the file's full text. Do **not** use `apply_migration` for these files: they manage their own transactions.
- The three SQL files: `supabase/replica/` in the repo, or Appendices A–C below (identical copies).
- For step 4 only: `curl`, and the new project's **secret key** in a shell variable.
- For step 6: access to the Vercel project and the GitHub repo `Anupam0326/RE-WORKSHOP`.

---

## Step 1: Create the structure. Run `01-schema.sql` (Appendix A)

It creates everything except the rows, in one transaction. If it errors, nothing has been applied; fix the cause and run it again.

- **Worked if:** it finishes without an error. The Table Editor shows 5 tables in `public`, each marked RLS enabled.
- **A warning starting "Storage setup skipped" is not fatal.** It means this project would not let SQL create the bucket. Create it by hand: Dashboard → Storage → New bucket → name `product-images`, Public on, file size limit 5 MB, allowed types `image/webp, image/jpeg, image/png`. Then add the 4 policies from section 6 of the file under Storage → Policies, with the same names, operations, `authenticated` role and expressions.
- **Error "relation already exists":** the project is not empty. Use a new project; do not drop tables in a project that has data.

## Step 2: Load the rows. Run `02-seed-data.sql` (Appendix B)

One transaction. Categories and products keep their original ids and timestamps. Photo rows are rebuilt from the photo file naming, which every live row follows; their ids are new, and nothing depends on them. Running it a second time adds nothing.

- **Worked if:** no error.

## Step 3: Check. Run `03-verify.sql` (Appendix C)

Changes nothing.
- **Part A** tests behaviour as a visitor, as a signed-in non-admin, and the 5-photo limit. If anything is wrong, it stops with an error starting `FAIL:` that names the problem.
- **Part B** returns 14 rows. **Every row must show `ok = true`.** The three fingerprints compare the rows field by field with the live project as of 18 Nov 2026.

If a fingerprint is false, the file was altered or truncated in transit. Re-copy it from the repo and start again on a fresh project. If Part A fails, report it; do not loosen security.

**Expected result:**

| name | expected |
|---|---|
| categories: rows | 4 |
| products: rows | 57 |
| products: visible | 57 |
| products: featured | 6 |
| product photos: rows | 162 |
| product photos: products with photos | 50 |
| site photos: rows | story-today |
| admins: rows | 1 |
| categories: fingerprint | 60ed6d75acc09a2ca66cced2d468fada |
| products: fingerprint | 2e353cb576d77086125c8bf05f901637 |
| product photos: fingerprint | 4c2334971c6b5720b86d7c99843c8d2c |
| storage: bucket | public, 5242880, {image/webp,image/jpeg,image/png} |
| security: tables with row-level security | 5 |
| security: policies (17 on tables + 4 on storage) | 21 |

## Step 4: Copy the one uploaded site photo

The `story-today` row still points at the old project's Storage. Copy its two files to the same paths in the new bucket, then repoint the row.

**4a. Copy the files** (bash; run where `curl` can reach both projects):

```bash
NEW_REF="<new project ref>"                      # e.g. abcdefghijklmnopqrst
NEW_SECRET="<new project secret key>"            # Dashboard → Project Settings → API Keys → Secret keys. Never commit or paste this anywhere else.

OLD="https://gzrrwncbouybfitcvkqw.supabase.co/storage/v1/object/public/product-images"
NEW="https://$NEW_REF.supabase.co/storage/v1/object/product-images"

for f in site/story-today/4f6c6216-a384-426f-8e71-ed632559d7d7-1400.webp \
         site/story-today/4f6c6216-a384-426f-8e71-ed632559d7d7-600.webp; do
  curl -fsS "$OLD/$f" -o "/tmp/$(basename "$f")"
  curl -fsS -X POST "$NEW/$f" \
    -H "apikey: $NEW_SECRET" -H "Authorization: Bearer $NEW_SECRET" \
    -H "Content-Type: image/webp" -H "Cache-Control: max-age=31536000" \
    --data-binary @"/tmp/$(basename "$f")" && echo " uploaded $f"
done
unset NEW_SECRET
```

If the project only has legacy keys, use the `service_role` key in both headers instead.

**No shell?** Open the two old URLs (`$OLD/…` above) in a browser and save the files. In Dashboard → Storage → `product-images`, create the folder `site`, inside it `story-today`, and upload both files with their names unchanged.

**4b. Repoint the row.** SQL, after replacing `<NEW_REF>`:

```sql
update public.site_media
set url       = replace(url,       'https://gzrrwncbouybfitcvkqw.supabase.co', 'https://<NEW_REF>.supabase.co'),
    url_small = replace(url_small, 'https://gzrrwncbouybfitcvkqw.supabase.co', 'https://<NEW_REF>.supabase.co')
where key = 'story-today';
```

- **Worked if:** both new URLs (`select url, url_small from public.site_media;`) open the photo in a browser.

## Step 5: Admin login and sign-in settings. A person does this, in the dashboard

The agent must not do this step: it sets a password.

1. **Authentication → Users → Add user → Create new user.**
   - Email: `anupamsharma0326@gmail.com`, the email already in `public.admins`.
   - Password: chosen and typed by the person, at least 12 characters, kept in their password manager.
   - Tick **Auto Confirm User**.
2. **Authentication → Sign In / Providers:**
   - Email provider on.
   - **Allow new users to sign up: off.** Admins are only ever added by hand.
   - Minimum password length: 12.
3. **Authentication → URL Configuration:** Site URL `https://www.reworkshop.store`.

**Adding another admin later** (for example, a login for the client):
1. Create the user the same way, with their own password set by them or handed over privately.
2. Run, with the email in lowercase:
   ```sql
   insert into public.admins (email) values ('their.email@example.com');
   ```

**Removing an admin:**
1. Run:
   ```sql
   delete from public.admins where email = '…';
   ```
2. Delete the user under Authentication → Users.

## Step 6: Point the website at the new project

The website bakes the project URL and publishable key in **when it is built**, so these changes need a new deployment.

1. **New values:** Dashboard → Project Settings → API Keys.
   - URL: `https://<NEW_REF>.supabase.co`.
   - **Publishable key:** `sb_publishable_…`. The publishable key only; never the secret key.
2. **Vercel** → the Re Workshop project → Settings → Environment Variables. For Production and Preview, set:
   - `VITE_SUPABASE_URL` = `https://<NEW_REF>.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_…`
3. **Repo fallbacks.** The code falls back to the old project when the variables are missing. Replace the old URL `https://gzrrwncbouybfitcvkqw.supabase.co` and old key `sb_publishable_eHq3jJOF_y-QqmSx9qIBYw_fSEx92LN` with the new values in all three files:
   - `client/src/lib/supabase.ts`, lines 7–9
   - `scripts/seo-build.mjs`, lines 28–29
   - `.env.example`, lines 3–4
4. **Redeploy.** Push the commit (Vercel builds from `main`) or use Redeploy in Vercel. In the build log, the line `seo-build: catalogue not reachable` **must not appear**. If it does, the build could not read the new project, and the sitemap and plain-HTML product pages were built without products: fix the variables and redeploy.

No other file names the project. There is no Content-Security-Policy listing it, and no Supabase SDK; the site uses plain `fetch`.

## Step 7: Check the live site end to end

1. `https://www.reworkshop.store/shop` lists the products, and a product page shows its photos.
2. The browser's network tab shows requests going to the **new** project ref.
3. `https://www.reworkshop.store/sitemap.xml` lists about 67 URLs, including `/shop/…` product pages.
4. **/admin:**
   - Sign in with the step 5 login.
   - Change a product's pack size, save, see it on the site, then change it back.
   - Drag two products to reorder, then put them back.
5. **Storage (tests the deletion fix):**
   - In /admin, add a photo to any product, then delete it.
   - In Dashboard → Storage → `product-images`, that product's folder must be empty again.
6. Dashboard → **Advisors → Security Advisor:**
   - No errors expected.
   - "Leaked password protection" may show as a warning on the Free plan; it is a paid-plan setting.

## Step 8: Retire the old project, later

Keep the old project untouched for at least a week after step 7 passes, as a fallback: switching back is just the two Vercel variables plus a redeploy. Then pause it (Project Settings → General → Pause project). Delete it only when the person who owns it says so.

---

## Deliberate differences from the live project

All three are tighter than live, and none changes what the website can do. They are marked in `01-schema.sql`.

1. **Table privileges are explicit and minimal.**
   - `anon`: SELECT on the 4 catalogue tables.
   - `authenticated`: SELECT, INSERT, UPDATE and DELETE on them, plus SELECT on `admins`.
   - Live relies on Supabase's default "all privileges" grants. Row-level security still decides every row in both.
2. **`reorder_*` functions cannot be called by `anon`.** Live allows the call, but the function refuses non-admins anyway.
3. **An admin SELECT policy on the bucket's files.** Supabase Storage needs SELECT as well as DELETE to remove a file. Live lacks it, so deleting a photo in /admin removes the row and silently leaves the file behind.

## Troubleshooting

- **The site shows no products after step 6:** the variables in Vercel are wrong or the deployment predates them. Test from a terminal:
  ```bash
  curl "https://<NEW_REF>.supabase.co/rest/v1/products?select=slug&limit=3" -H "apikey: <publishable key>"
  ```
  - 3 slugs: the database is fine.
  - `401`: wrong key.
  - `[]`: step 2 did not run.
- **/admin says the email or password is incorrect:** the user from step 5 does not exist, or is not confirmed.
- **/admin signs in but cannot save** (error about row-level security): the login's email is not in `public.admins`, or differs in letter case. The table stores lowercase.
- **Upload fails in /admin:** check that the bucket exists with the step 3 settings and has the 4 policies.
- **"permission denied for schema private":** section 0 of `01-schema.sql` did not apply. Run the file again on a fresh project.

---

## Appendix A: `01-schema.sql`

```sql
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
```

## Appendix B: `02-seed-data.sql`

```sql
-- =====================================================================================================================
-- Re Workshop — database contents, part 2 of 3
--
-- Every row of the live project (ref gzrrwncbouybfitcvkqw) as of 18 Nov 2026:
--   4 categories (shelves) · 57 products · 162 product photos · 1 site photo · 1 admin.
-- Run AFTER 01-schema.sql, as the postgres role, on the same new project. One transaction.
--
-- Categories and products keep their original ids and timestamps. Product photo rows are rebuilt from the photo file
-- naming (every live row follows it: verified 18 Nov 2026); their ids are new, which nothing depends on.
-- The product photo FILES are not in Supabase: they ship with the website (client/public/products/…).
-- The one site photo IS in Supabase Storage: its row still points at the old project until step 4 of the runbook.
-- =====================================================================================================================

begin;

-- ---------------------------------------------------------------------------------------------------------------------
-- Categories (4)
-- ---------------------------------------------------------------------------------------------------------------------
insert into public.categories (id, slug, name, short_name, eyebrow, description, sort_order, created_at, updated_at) values
  ('9831fca4-50fa-4dd3-9255-ba1509280e59', 'grains-flours', 'The Grains & Flours', 'Grains & flours', 'Nutrient-dense ancient grains, stone-milled the slow way', 'Nutrient-dense ancient grains, stone-milled aata and sattu, traditional rice, whole pulses and seeds.', 1, '2026-09-27 18:02:53.329767+00', '2026-10-06 18:30:29.505597+00'),
  ('7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'spices-staples', 'Dals, Oils & Pantry Staples', 'Dals, oils & staples', 'Unpolished, wood-pressed and traditionally processed', 'Unpolished dals, Haldi (turmeric), desi ghee, room-temperature wood-pressed oils, Jaggery Granules, Khandasari, Jungle Honey, Himalayan pink salt, Adanshilpa poha, and pickles and chatni.', 2, '2026-09-27 18:02:53.329767+00', '2026-10-17 18:13:28.329191+00'),
  ('8d6e2518-b365-482e-89b2-0317393b2260', 'snacks-premixes', 'Guilt-Free Snacks & Premixes', 'Snacks & premixes', 'Tea-time companions, quick meal premixes and millet noodles', 'Mindfully baked tea-time companions, quick healthy meal premixes, and millet noodles and pasta.', 3, '2026-09-27 18:02:53.329767+00', '2026-10-17 18:13:28.329191+00'),
  ('d646fa18-8a09-4cc6-810d-1499afd1adf4', 'handmade-decor', 'Handmade Soaps & Décor', 'Soaps & décor', 'From the same shelves', 'Handmade soap and eco-friendly wall décor.', 4, '2026-09-27 18:02:53.329767+00', '2026-10-17 18:13:28.329191+00')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------------------------------------------------
-- Products (57, all visible)
-- ---------------------------------------------------------------------------------------------------------------------
insert into public.products (id, slug, name, category_id, group_label, pack_size, price_inr, description, details, featured, is_active, sort_order, created_at, updated_at, availability_note, origin) values
  ('d40978a4-88c8-4677-9d4f-ed06c7c0c1f1', 'kodo-millet', 'Kodo Millet', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Nutrient-dense ancient grains', '500g', 270.00, 'Kodo millet (Paspalum scrobiculatum) is a nutritious, drought-resistant ancient grain cultivated in India for over 3,000 years', '{}'::text[], false, true, 1, '2026-09-27 18:50:52.115676+00', '2026-10-06 18:30:29.505597+00', '', '{}'::jsonb),
  ('5704c522-d16e-44fc-87d9-398aebce7c8e', 'ragi-millet', 'Ragi Millet', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Nutrient-dense ancient grains', '500 g', 75.00, '', '{}'::text[], false, true, 2, '2026-09-27 18:03:22.355164+00', '2026-10-06 18:30:29.505597+00', '', '{}'::jsonb),
  ('0af57e98-f829-4267-97d7-602f1f860bb1', 'kutki-millet', 'Kutki Millet', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Nutrient-dense ancient grains', '500 g', 100.00, '', '{Organic}'::text[], false, true, 3, '2026-09-27 18:03:22.355164+00', '2026-10-06 18:30:29.505597+00', '', '{}'::jsonb),
  ('9491cf2f-d52f-4d8d-8ae8-5f6f9fbed864', 'sama-millet', 'Sama Millet', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Nutrient-dense ancient grains', '500 g', 110.00, '', '{Organic}'::text[], false, true, 4, '2026-09-27 18:03:22.355164+00', '2026-10-06 18:30:29.505597+00', '', '{}'::jsonb),
  ('9ad32f32-3537-41de-9eb9-67409d3a6cf8', 'kangani-millet', 'Kangani Millet', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Nutrient-dense ancient grains', '500 g', 100.00, '', '{Organic}'::text[], false, true, 5, '2026-09-27 18:03:22.355164+00', '2026-10-06 18:30:29.505597+00', '', '{}'::jsonb),
  ('a9bb0a23-9afd-4392-ad68-3e2e156a1d74', 'sharbati-gehu-aata', 'Sharbati Gehu Aata', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Stone-milled aata', '1.3 kg', 124.00, '', '{"Stone milled",Organic}'::text[], false, true, 6, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:53:22.407128+00', '', '{}'::jsonb),
  ('0b4539fc-8c2f-4717-85ea-df113dc30000', 'browntop-millet', 'Browntop Millet', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Nutrient-dense ancient grains', '250 g', 65.00, '', '{}'::text[], false, true, 7, '2026-09-27 18:03:22.355164+00', '2026-10-06 18:30:29.505597+00', '', '{}'::jsonb),
  ('7742b244-4d81-4c70-819d-ca7745cc7275', 'khapli-gehu-aata', 'Khapli Gehu Aata', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Stone-milled aata', '1.3 kg', 260.00, '', '{"Stone milled",Organic}'::text[], false, true, 8, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:53:22.407128+00', '', '{}'::jsonb),
  ('6ecf0704-1ceb-4567-9e06-31b99868053f', 'jwar-millet-aata', 'Jwar Millet Aata', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Stone-milled aata', '500 g', 75.00, '', '{"Stone milled"}'::text[], false, true, 9, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:53:22.407128+00', '', '{}'::jsonb),
  ('06cf5f63-896a-4522-8323-76a8e7cb64ca', 'ragi-millet-aata', 'Ragi Millet Aata', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Stone-milled aata', '500 g', 80.00, '', '{"Stone milled"}'::text[], false, true, 10, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:53:22.407128+00', '', '{}'::jsonb),
  ('92481edc-63e8-48ac-948c-be1c9d6e4cd8', 'bajra-millet-aata', 'Bajra Millet Aata', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Stone-milled aata', '500 g', 75.00, '', '{"Stone milled"}'::text[], false, true, 11, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:53:22.407128+00', '', '{}'::jsonb),
  ('3af7c8df-80b4-46aa-b326-b55703adf5dd', 'rajgira-aata', 'Rajgira Aata', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Stone-milled aata', '250 g', 80.00, '', '{"Stone milled"}'::text[], false, true, 12, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:53:22.407128+00', '', '{}'::jsonb),
  ('aa1d4893-8cf5-4f98-b492-acd4c59233fc', 'kuttu-aata', 'Kuttu Aata', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Stone-milled aata', '250 g', 100.00, '', '{"Stone milled"}'::text[], false, true, 13, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:53:22.407128+00', '', '{}'::jsonb),
  ('6cbba79a-87d3-42d4-b146-8f65a3ad46d0', 'desi-chana-besan', 'Desi Chana Besan', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Stone-milled aata', '500 g', 125.00, '', '{"Stone milled",Organic}'::text[], false, true, 14, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:53:22.407128+00', '', '{}'::jsonb),
  ('deeb4945-6f95-4157-88fd-6fe9b8e17033', 'desi-makka-aata', 'Desi Makka Aata', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Stone-milled aata', '500 g', 50.00, '', '{Organic}'::text[], false, true, 15, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:53:22.407128+00', '', '{}'::jsonb),
  ('53bf0a38-4cba-4f16-b632-fc8569e7874a', 'jau-chana-sattu', 'Jau Chana Sattu', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Sattu', '500 g', 150.00, '', '{"Made with organic desi chana & barley"}'::text[], false, true, 16, '2026-09-27 18:03:22.355164+00', '2026-10-06 18:30:29.505597+00', '', '{}'::jsonb),
  ('fb8f8377-97cb-440d-995b-5c627b5dd534', 'kali-banga-tukda-rice', 'Kali Banga Tukda Rice', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Traditional rice', '500 g', 90.00, '', '{Organic}'::text[], false, true, 17, '2026-09-27 18:03:22.355164+00', '2026-10-06 18:30:29.505597+00', '', '{}'::jsonb),
  ('beff51f7-21a6-4115-b3c9-5bc114a3cbe1', 'desi-chana', 'Desi Chana', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Whole pulses', '500 g', 80.00, '', '{Organic}'::text[], false, true, 18, '2026-09-27 18:03:22.355164+00', '2026-10-06 18:30:29.505597+00', '', '{}'::jsonb),
  ('9c9a20e1-1116-4a68-8fe4-69b573b0bb98', 'sabut-moong', 'Whole Moong', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Whole pulses', '500 g', 120.00, 'Sabut moong: whole green moong, not split.', '{Organic}'::text[], false, true, 19, '2026-09-27 18:03:22.355164+00', '2026-10-11 07:12:58.707602+00', '', '{}'::jsonb),
  ('424bd9b1-3796-48cd-a4a0-6585b5b741c7', 'black-whole-moong', 'Black Whole Moong', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Whole pulses', '', null, 'Whole black moong, not split.', '{}'::text[], false, true, 20, '2026-10-06 18:30:29.505597+00', '2026-10-06 18:30:29.505597+00', '', '{}'::jsonb),
  ('acb18216-25dd-439f-9059-fa2e7b72fcd4', 'chia-seeds', 'Chia Seeds', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Seeds', '100 g', 80.00, '', '{}'::text[], false, true, 21, '2026-09-27 18:03:22.355164+00', '2026-10-06 18:30:29.505597+00', '', '{}'::jsonb),
  ('29b33607-3936-40b4-91fc-3aa5a7d6d6fe', 'flax-seeds', 'Flax Seeds', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Seeds', '', null, '', '{}'::text[], false, true, 22, '2026-10-06 18:30:29.505597+00', '2026-10-06 18:30:29.505597+00', '', '{}'::jsonb),
  ('e2480d60-613f-45d3-bf33-5b12dc8600dd', 'sabut-kuttu', 'Sabut Kuttu', '9831fca4-50fa-4dd3-9255-ba1509280e59', 'Nutrient-dense ancient grains', '250 g', 90.00, '', '{Organic}'::text[], false, true, 23, '2026-09-27 18:03:22.355164+00', '2026-10-06 18:30:29.505597+00', '', '{}'::jsonb),
  ('88d1de11-2279-4f7c-8910-3a76d10feb2a', 'arhar-dal', 'Arhar Dal', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Unpolished dals', '500 g', 125.00, '', '{"Stone milled",Organic}'::text[], true, true, 1, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('3bacd6c3-dd68-4c53-a0b5-489f31b3fee4', 'moong-dal-chhilka', 'Moong Dal Chhilka', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Unpolished dals', '500 g', 140.00, '', '{"Stone milled",Organic}'::text[], false, true, 2, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('00c5ff4f-57e0-4358-91ae-aed6d5e5a466', 'chana-dal', 'Chana Dal', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Unpolished dals', '500 g', 120.00, '', '{"Stone milled",Organic}'::text[], false, true, 3, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('c6608e00-52a7-4b0d-bec8-38ee7bfc9753', 'haldi-powder', 'Haldi (Turmeric) Powder', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Haldi (turmeric)', '100 g', 80.00, '', '{}'::text[], false, true, 4, '2026-10-06 18:30:29.505597+00', '2026-10-06 18:30:29.505597+00', '', '{}'::jsonb),
  ('b34e1251-8f16-4b3b-bf2e-a7c3efed0ff9', 'desi-ghee', 'Desi Ghee', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Ghee & wood-pressed oils', '500 ml', 1000.00, '', '{"Desi cow’s bilona ghee"}'::text[], true, true, 8, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('9fc540a2-4064-4504-933b-198b9d934cbe', 'wood-pressed-mustard-oil', 'Wood-Pressed Mustard Oil', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Ghee & wood-pressed oils', '1 L', 440.00, '', '{"Wood pressed"}'::text[], false, true, 9, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('8a1b3f83-c9a9-46e5-9fd7-a78f37b8bb13', 'wood-pressed-groundnut-oil', 'Wood-Pressed Groundnut Oil', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Ghee & wood-pressed oils', '1 L', 465.00, '', '{"Wood pressed"}'::text[], false, true, 10, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('d1570e74-6ff5-4cf1-bf88-c8f46b712e00', 'wood-pressed-sesame-oil', 'Wood-Pressed Sesame Oil', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Ghee & wood-pressed oils', '500 ml', 440.00, '', '{"Wood pressed"}'::text[], false, true, 11, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('67e280d8-9b99-460b-b4a5-eaf27b0f665e', 'wood-pressed-coconut-oil', 'Wood-Pressed Coconut Oil', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Ghee & wood-pressed oils', '500 ml', 450.00, '', '{"Wood pressed"}'::text[], false, true, 12, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('c198528c-9b67-40aa-afb4-4e3cf9d23243', 'wood-pressed-castor-oil', 'Wood-Pressed Castor Oil', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Ghee & wood-pressed oils', '500 ml', 450.00, '', '{"Wood pressed"}'::text[], false, true, 13, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('63fabca3-154b-4ef5-ad95-4b091d2fe327', 'jaggery-granules', 'Jaggery Granules', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Jaggery, khandasari & honey', '500 g', 90.00, '', '{"Made with organic sugarcane"}'::text[], false, true, 14, '2026-09-27 18:03:22.355164+00', '2026-10-17 18:13:28.329191+00', '', '{}'::jsonb),
  ('0a536fcd-c1d9-4594-aba6-0fb77e5c2a1f', 'khandsari', 'Khandasari', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Jaggery, khandasari & honey', '500 g', 100.00, '', '{"Made with organic sugarcane"}'::text[], false, true, 15, '2026-09-27 18:03:22.355164+00', '2026-10-17 18:13:28.329191+00', '', '{}'::jsonb),
  ('88c91d2b-4b6d-4ba5-a94c-09c75a2b71bb', 'jungle-honey', 'Jungle Honey', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Jaggery, khandasari & honey', '250 g', 250.00, '', '{}'::text[], false, true, 16, '2026-09-27 18:03:22.355164+00', '2026-10-17 18:13:28.329191+00', '', '{}'::jsonb),
  ('e68e30b9-4d06-48d4-85ab-2c99d1226732', 'himalayan-pink-salt', 'Himalayan Pink Salt', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Salt & poha', '500 g', 70.00, '', '{}'::text[], false, true, 17, '2026-09-27 18:03:22.355164+00', '2026-10-17 18:13:28.329191+00', '', '{}'::jsonb),
  ('98c23ba8-847c-4b2f-b733-d588a227ab20', 'adanshilpa-poha', 'Adanshilpa Poha', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Salt & poha', '200 g', 50.00, '', '{"Product of Jharkhand"}'::text[], false, true, 18, '2026-09-27 18:03:22.355164+00', '2026-10-17 18:13:28.329191+00', '', '{}'::jsonb),
  ('eb669c47-b81e-45a9-97b5-09897a53df53', 'mango-pickle', 'Aam ka Chhunda', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Pickles & chatni', '500 g', 350.00, '', '{}'::text[], false, true, 19, '2026-09-27 18:03:22.355164+00', '2026-11-17 18:42:01.818819+00', '', '{}'::jsonb),
  ('19669a20-ad28-4d79-a218-d970ab77c39f', 'lemon-pickle', 'Lemon Pickle', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Pickles & chatni', '500 g', 350.00, '', '{}'::text[], false, true, 20, '2026-09-27 18:03:22.355164+00', '2026-10-17 18:13:28.329191+00', '', '{}'::jsonb),
  ('793b63bf-778e-4813-b7da-c61899464e42', 'nimbu-ki-khatti-mithi-chatni', 'Nimbu Ki Khatti Mithi Chatni', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Pickles & chatni', '600 g', 380.00, '', '{}'::text[], false, true, 21, '2026-09-27 18:03:22.355164+00', '2026-10-17 18:13:28.329191+00', '', '{}'::jsonb),
  ('6810f51a-9c41-4efc-85ae-b7725d82380d', 'thekua', 'Baked Thekuas: The Indian Cookies', '8d6e2518-b365-482e-89b2-0317393b2260', 'Tea-time companions', '100 g', 100.00, '', '{"Baked, not fried","Made with khapli aata, jaggery & desi ghee"}'::text[], true, true, 1, '2026-09-27 18:03:22.355164+00', '2026-10-11 07:12:58.707602+00', '', '{}'::jsonb),
  ('9c53e778-5914-4313-977d-ea4b363f08fc', 'jwar-kodo-salty', 'Jwar Kodo Salty', '8d6e2518-b365-482e-89b2-0317393b2260', 'Tea-time companions', '90 g', 75.00, '', '{"Made with jwar, whole wheat & kodo"}'::text[], true, true, 2, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('3587d865-30c8-467e-bb21-0362339c9d3a', 'peri-cori-bite', 'Peri-Cori Bite', '8d6e2518-b365-482e-89b2-0317393b2260', 'Tea-time companions', '100 g', 85.00, '', '{}'::text[], false, true, 3, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('209ad21e-4662-4c13-ae81-2ed471ec59d3', 'rose-awla-marbles', 'Rose Awla Marbles', '8d6e2518-b365-482e-89b2-0317393b2260', 'Tea-time companions', '100 g', 100.00, '', '{}'::text[], false, true, 4, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('cae2e2cc-bec8-4cb6-82b6-0e2a77963bc3', 'marzipan-square', 'Marzipan Square', '8d6e2518-b365-482e-89b2-0317393b2260', 'Tea-time companions', '500 g', 350.00, '', '{}'::text[], false, true, 5, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('06d2c446-fce5-4f7e-981d-b1c29ef26db5', 'bajra-gond-laddu', 'Bajra Gond Laddu', '8d6e2518-b365-482e-89b2-0317393b2260', 'Tea-time companions', '350 g', 350.00, '', '{}'::text[], false, true, 6, '2026-09-27 18:03:22.355164+00', '2026-10-06 18:30:29.505597+00', 'Winter only', '{}'::jsonb),
  ('7e4e094c-b51a-45ba-be3d-30780537c12b', 'kodo-upma-premix', 'Kodo Upma Premix', '8d6e2518-b365-482e-89b2-0317393b2260', 'Quick meal premixes', '150 g', 170.00, '', '{}'::text[], true, true, 10, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('3e853bdf-b137-4b61-b7bf-929f82261663', 'kodo-masala-idly-premix', 'Kodo Masala Idly Premix', '8d6e2518-b365-482e-89b2-0317393b2260', 'Quick meal premixes', '150 g', 150.00, '', '{}'::text[], false, true, 11, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('b74b5a56-9df9-4c61-9f7c-4e57b1fb1ade', 'kodo-halva-premix', 'Kodo Halva Premix', '8d6e2518-b365-482e-89b2-0317393b2260', 'Quick meal premixes', '150 g', 150.00, '', '{}'::text[], false, true, 12, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('c8da53ae-8751-43a2-860d-76aeb278d8d7', 'adanshilpa-poha-premix', 'Adanshilpa Poha Premix', '8d6e2518-b365-482e-89b2-0317393b2260', 'Quick meal premixes', '150 g', 75.00, '', '{}'::text[], false, true, 13, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('1ef20786-5c1f-4e63-90ec-2cd8f14e9fe7', 'masala-sattu-cooler-premix', 'Masala Sattu Cooler Premix', '8d6e2518-b365-482e-89b2-0317393b2260', 'Quick meal premixes', '150 g', 150.00, '', '{}'::text[], false, true, 14, '2026-09-27 18:03:22.355164+00', '2026-09-27 18:03:22.355164+00', '', '{}'::jsonb),
  ('7f0e4e10-da7c-48fa-a5be-68378391b371', 'millet-noodles', 'Millet Noodles', '8d6e2518-b365-482e-89b2-0317393b2260', 'Millet noodles & pasta', '175 g', 120.00, '', '{"Made with 50% kodo & 50% whole wheat"}'::text[], true, true, 15, '2026-09-27 18:03:22.355164+00', '2026-10-17 18:13:28.329191+00', '', '{}'::jsonb),
  ('ba753bbb-a17c-4ce4-ba39-0a6f1b66abfd', 'millet-pasta', 'Millet Pasta', '8d6e2518-b365-482e-89b2-0317393b2260', 'Millet noodles & pasta', '175 g', 120.00, '', '{"Made with 50% kodo & 50% whole wheat"}'::text[], false, true, 16, '2026-09-27 18:03:22.355164+00', '2026-10-17 18:13:28.329191+00', '', '{}'::jsonb),
  ('af22e454-3d74-4ec0-a70a-cc6b8c4043b1', 'gluten-free-spaghetti-noodles', 'Gluten-Free Spaghetti / Noodles', '8d6e2518-b365-482e-89b2-0317393b2260', 'Millet noodles & pasta', '200 g', 130.00, '', '{"Made with foxtail millet & rice"}'::text[], false, true, 17, '2026-09-27 18:03:22.355164+00', '2026-10-17 18:13:28.329191+00', '', '{}'::jsonb),
  ('0872faa1-bb3f-4872-bce4-2d9c27f963b8', 'handmade-soap', 'Handmade Soap', 'd646fa18-8a09-4cc6-810d-1499afd1adf4', 'Handmade soaps', '100 g', 100.00, '', '{}'::text[], false, true, 1, '2026-09-27 18:03:22.355164+00', '2026-10-17 18:13:28.329191+00', '', '{}'::jsonb),
  ('438bc3eb-491d-4d90-b83e-988617e1ced6', 'ecofriendly-wall-decor', 'Eco-Friendly Wall Décor', 'd646fa18-8a09-4cc6-810d-1499afd1adf4', 'Eco-friendly décor', '1 pc', 650.00, '', '{}'::text[], false, true, 2, '2026-09-27 18:03:22.355164+00', '2026-10-17 18:13:28.329191+00', '', '{}'::jsonb)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------------------------------------------------
-- Product photos (162 rows for 50 products)
--   studio  = how many studio photos the product has: /products/v2/<slug>-1 … -<n>, sort_order 0 … n-1
--   classic = sort_order of its one older photo /products/<slug>, or null
--   Each photo is two files: <path>-960.webp (url) and <path>-480.webp (url_small).
-- Skips any product that already has photos, so running this twice adds nothing.
-- ---------------------------------------------------------------------------------------------------------------------
insert into public.product_images (product_id, url, url_small, sort_order)
select p.id, f.path || '-960.webp', f.path || '-480.webp', f.sort_order
from (values
  ('adanshilpa-poha-premix', 4, null),
  ('adanshilpa-poha', 4, null),
  ('arhar-dal', 4, null),
  ('bajra-gond-laddu', 0, 1),
  ('bajra-millet-aata', 4, null),
  ('browntop-millet', 5, null),
  ('chana-dal', 4, null),
  ('chia-seeds', 0, 1),
  ('desi-chana-besan', 4, null),
  ('desi-chana', 5, null),
  ('desi-ghee', 0, 1),
  ('desi-makka-aata', 0, 1),
  ('ecofriendly-wall-decor', 0, 1),
  ('gluten-free-spaghetti-noodles', 4, null),
  ('haldi-powder', 4, null),
  ('handmade-soap', 4, null),
  ('himalayan-pink-salt', 5, null),
  ('jaggery-granules', 4, null),
  ('jau-chana-sattu', 4, null),
  ('jungle-honey', 0, 1),
  ('jwar-kodo-salty', 5, null),
  ('jwar-millet-aata', 4, null),
  ('kali-banga-tukda-rice', 2, null),
  ('kangani-millet', 5, null),
  ('khandsari', 4, null),
  ('khapli-gehu-aata', 4, null),
  ('kodo-halva-premix', 4, null),
  ('kodo-masala-idly-premix', 5, null),
  ('kodo-millet', 4, null),
  ('kodo-upma-premix', 4, null),
  ('kutki-millet', 4, null),
  ('lemon-pickle', 3, null),
  ('marzipan-square', 0, 1),
  ('masala-sattu-cooler-premix', 0, 1),
  ('millet-noodles', 4, null),
  ('millet-pasta', 5, null),
  ('moong-dal-chhilka', 4, null),
  ('nimbu-ki-khatti-mithi-chatni', 3, null),
  ('peri-cori-bite', 5, null),
  ('ragi-millet-aata', 4, null),
  ('ragi-millet', 0, 1),
  ('rose-awla-marbles', 0, 1),
  ('sabut-kuttu', 0, 1),
  ('sabut-moong', 5, null),
  ('sama-millet', 4, null),
  ('sharbati-gehu-aata', 4, null),
  ('thekua', 3, null),
  ('wood-pressed-coconut-oil', 0, 1),
  ('wood-pressed-groundnut-oil', 0, 1),
  ('wood-pressed-mustard-oil', 0, 1)
) as v(slug, studio, classic)
join public.products p on p.slug = v.slug
cross join lateral (
  select '/products/v2/' || v.slug || '-' || n as path, n - 1 as sort_order from generate_series(1, v.studio) as n
  union all
  select '/products/' || v.slug, v.classic where v.classic is not null
) as f
where not exists (select 1 from public.product_images x where x.product_id = p.id)
order by p.slug, f.sort_order;

-- ---------------------------------------------------------------------------------------------------------------------
-- Site photos (1): the "Today's story" photo, uploaded in /admin. Its files are in Storage on the OLD project;
-- step 4 of the runbook copies them and points this row at the new project.
-- ---------------------------------------------------------------------------------------------------------------------
insert into public.site_media (key, url, url_small, storage_paths, alt, caption, updated_at) values
  ('story-today', 'https://gzrrwncbouybfitcvkqw.supabase.co/storage/v1/object/public/product-images/site/story-today/4f6c6216-a384-426f-8e71-ed632559d7d7-1400.webp', 'https://gzrrwncbouybfitcvkqw.supabase.co/storage/v1/object/public/product-images/site/story-today/4f6c6216-a384-426f-8e71-ed632559d7d7-600.webp', '{site/story-today/4f6c6216-a384-426f-8e71-ed632559d7d7-1400.webp,site/story-today/4f6c6216-a384-426f-8e71-ed632559d7d7-600.webp}'::text[], '', 'Beetroot Amla Detox', '2026-10-30 09:46:22.472951+00')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------------------------------------------------
-- Admins (1). This only lists the email; the login itself (Supabase Auth user + password) is created by a person in
-- the dashboard (runbook step 5). Lowercase only.
-- ---------------------------------------------------------------------------------------------------------------------
insert into public.admins (email, created_at) values
  ('anupamsharma0326@gmail.com', '2026-09-27 18:23:54.602451+00')
on conflict (email) do nothing;

commit;
```

## Appendix C: `03-verify.sql`

```sql
-- =====================================================================================================================
-- Re Workshop — checks, part 3 of 3
--
-- Run AFTER 01-schema.sql and 02-seed-data.sql, as the postgres role. Changes nothing (every test is rolled back).
-- Part A stops with an error naming the problem if security or the photo limit is wrong.
-- Part B returns one row per check; every row must say ok = true. The fingerprints compare the copied rows with the
-- live project's rows field by field, so a single changed character anywhere shows up as false.
-- (After runbook step 4 the site_media row points at the new project, which is expected; its check ignores the URL.)
-- =====================================================================================================================

-- ---------------------------------------------------------------------------------------------------------------------
-- Part A: behaviour
-- ---------------------------------------------------------------------------------------------------------------------
begin;

-- A visitor (anon) reads the catalogue and nothing else, and cannot write.
set local role anon;
do $$
declare n int;
begin
  select count(*) into n from public.products;
  if n <> 57 then raise exception 'FAIL: a visitor sees % products, expected 57', n; end if;
  select count(*) into n from public.product_images;
  if n <> 162 then raise exception 'FAIL: a visitor sees % product photos, expected 162', n; end if;
  begin
    perform 1 from public.admins;
    raise exception 'FAIL: a visitor can read the admins table';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.categories (slug, name) values ('rls-test', 'RLS test');
    raise exception 'FAIL: a visitor can add a category';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

-- A signed-in user who is NOT in public.admins cannot write or see the admin list.
set local role authenticated;
set local request.jwt.claims to '{"sub": "00000000-0000-0000-0000-000000000000", "role": "authenticated"}';
do $$
declare n int;
begin
  select count(*) into n from public.admins;
  if n <> 0 then raise exception 'FAIL: a non-admin sees % admin rows', n; end if;
  begin
    insert into public.categories (slug, name) values ('rls-test', 'RLS test');
    raise exception 'FAIL: a non-admin can add a category';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.reorder_products(array[]::uuid[]);
    raise exception 'FAIL: a non-admin can reorder products';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

-- A sixth photo for one product is refused.
do $$
begin
  insert into public.product_images (product_id, url)
  select id, '/test.webp' from public.products where slug = 'browntop-millet';
  raise exception 'FAIL: a product took a sixth photo';
exception when check_violation then null;
end $$;

rollback;

-- ---------------------------------------------------------------------------------------------------------------------
-- Part B: contents (every row must say ok = true)
-- ---------------------------------------------------------------------------------------------------------------------
with checks (name, expected, actual) as (
  select 'categories: rows', '4', (select count(*)::text from public.categories)
  union all
  select 'products: rows', '57', (select count(*)::text from public.products)
  union all
  select 'products: visible', '57', (select count(*)::text from public.products where is_active)
  union all
  select 'products: featured', '6', (select count(*)::text from public.products where featured)
  union all
  select 'product photos: rows', '162', (select count(*)::text from public.product_images)
  union all
  select 'product photos: products with photos', '50', (select count(distinct product_id)::text from public.product_images)
  union all
  select 'site photos: rows', 'story-today', (select string_agg(key, ',' order by key) from public.site_media)
  union all
  select 'admins: rows', '1', (select count(*)::text from public.admins)
  union all
  select 'categories: fingerprint', '60ed6d75acc09a2ca66cced2d468fada',
    (select md5(string_agg(concat_ws('|', id, slug, name, short_name, eyebrow, description, sort_order,
       created_at at time zone 'UTC', updated_at at time zone 'UTC'), E'\n' order by slug)) from public.categories)
  union all
  select 'products: fingerprint', '2e353cb576d77086125c8bf05f901637',
    (select md5(string_agg(concat_ws('|', p.id, p.slug, p.name, c.slug, p.group_label, p.pack_size,
       coalesce(p.price_inr::text, '∅'), p.description, p.details::text, p.featured, p.is_active, p.sort_order,
       p.created_at at time zone 'UTC', p.updated_at at time zone 'UTC', p.availability_note, p.origin::text),
       E'\n' order by p.slug))
     from public.products p join public.categories c on c.id = p.category_id)
  union all
  select 'product photos: fingerprint', '4c2334971c6b5720b86d7c99843c8d2c',
    (select md5(string_agg(p.slug || '|' || i.sort_order || '|' || i.url || '|' || coalesce(i.url_small, '∅') || '|' ||
       i.storage_paths::text, E'\n' order by p.slug, i.sort_order, i.url))
     from public.product_images i join public.products p on p.id = i.product_id)
  union all
  select 'storage: bucket', 'public, 5242880, {image/webp,image/jpeg,image/png}',
    (select case when public then 'public' else 'private' end || ', ' || file_size_limit || ', ' || allowed_mime_types::text
     from storage.buckets where id = 'product-images')
  union all
  select 'security: tables with row-level security', '5',
    (select count(*)::text from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity
       and c.relname in ('admins', 'categories', 'products', 'product_images', 'site_media'))
  union all
  select 'security: policies (17 on tables + 4 on storage)', '21',
    (select count(*)::text from pg_policies
     where (schemaname = 'public' and tablename in ('admins', 'categories', 'products', 'product_images', 'site_media'))
        or (schemaname = 'storage' and tablename = 'objects' and policyname like 'Admins % product images'))
)
select name, expected, actual, expected = actual as ok from checks;
```
