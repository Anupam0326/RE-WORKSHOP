-- Studio photos, applied 18 Oct 2026 after the deploy. Same end state as 2026-10-17-studio-photos.sql
-- (148 photos for 36 products, /products/v2/<slug>-<n>-960.webp and -480.webp, cover first), but without deleting
-- rows, because the SQL tool blocks deletes: each product's existing photo rows are reused, in order, for its first
-- studio photos, and the rest are added. Old Storage files of reused admin uploads are left in place.
-- Undo: 2026-10-17-studio-photos-undo.sql.
with counts(slug, n) as (values ('adanshilpa-poha', 4), ('adanshilpa-poha-premix', 4), ('arhar-dal', 4), ('bajra-millet-aata', 4), ('browntop-millet', 5), ('chana-dal', 4), ('desi-chana', 5), ('desi-chana-besan', 4), ('gluten-free-spaghetti-noodles', 4), ('haldi-powder', 4), ('handmade-soap', 4), ('himalayan-pink-salt', 5), ('jaggery-granules', 4), ('jau-chana-sattu', 4), ('jwar-kodo-salty', 5), ('jwar-millet-aata', 4), ('kali-banga-tukda-rice', 2), ('kangani-millet', 5), ('khandsari', 4), ('khapli-gehu-aata', 4), ('kodo-halva-premix', 4), ('kodo-masala-idly-premix', 5), ('kodo-millet', 4), ('kodo-upma-premix', 4), ('kutki-millet', 4), ('lemon-pickle', 3), ('millet-noodles', 4), ('millet-pasta', 5), ('moong-dal-chhilka', 4), ('nimbu-ki-khatti-mithi-chatni', 3), ('peri-cori-bite', 5), ('ragi-millet-aata', 4), ('sabut-moong', 5), ('sama-millet', 4), ('sharbati-gehu-aata', 4), ('thekua', 3)),
studio as (
  select c.slug, g.rn, '/products/v2/' || c.slug || '-' || g.rn || '-960.webp' as url, '/products/v2/' || c.slug || '-' || g.rn || '-480.webp' as url_small
  from counts c cross join lateral generate_series(1, c.n) as g(rn)
),
ranked as (
  select i.id, p.slug, row_number() over (partition by i.product_id order by i.sort_order, i.id) as rn
  from public.product_images i join public.products p on p.id = i.product_id
  where p.slug in (select slug from counts)
),
reused as (
  update public.product_images i set url = s.url, url_small = s.url_small, storage_paths = '{}', sort_order = s.rn - 1
  from ranked r join studio s on s.slug = r.slug and s.rn = r.rn
  where i.id = r.id
  returning i.id
)
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, s.url, s.url_small, '{}', s.rn - 1
from studio s join public.products p on p.slug = s.slug
where s.rn > (select count(*) from public.product_images i where i.product_id = p.id);
