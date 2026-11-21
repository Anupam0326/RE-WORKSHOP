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
