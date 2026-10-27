-- 22 Oct 2026: seed and origin facts per product, for "Track your grain" on /our-story.
-- Applied to the live project (gzrrwncbouybfitcvkqw) as migration "product_origin_for_grain_tracker".
-- Backward compatible: older site code selects named columns and never touches origin.
-- Keys (all optional text): seed_variety, seed_source, grown_at, season, farming, processing, note.
-- Filled by the store team in /admin -> Products -> a product -> "Seed and origin". Only true, confirmed facts.
alter table public.products add column if not exists origin jsonb not null default '{}'::jsonb;
alter table public.products drop constraint if exists products_origin_shape;
alter table public.products add constraint products_origin_shape check (jsonb_typeof(origin) = 'object' and pg_column_size(origin) <= 4000);
comment on column public.products.origin is 'Seed and origin facts for the Track your grain tracker on /our-story (keys: seed_variety, seed_source, grown_at, season, farming, processing, note). Filled by the store team in /admin. Only true, confirmed facts.';
