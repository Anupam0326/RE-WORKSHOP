-- Undo for 2026-10-22-product-origin.sql. Deletes every seed/origin fact the store team entered: export them first.
alter table public.products drop constraint if exists products_origin_shape;
alter table public.products drop column if exists origin;
