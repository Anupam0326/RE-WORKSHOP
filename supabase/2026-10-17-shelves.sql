-- Re Workshop: three food shelves (client request, 17 Oct 2026, 23:37 IST).
--  * Millet Noodles & Pasta joins Guilt-Free Snacks & Premixes as the sub-shelf "Millet noodles & pasta"; the empty shelf stays, hidden.
--  * Pickles & chatni and Jungle Honey join Dals, Oils & Pantry Staples (honey sits with jaggery and khandasari).
--  * Handmade soap and the eco-friendly wall décor become a small "Handmade Soaps & Décor" shelf (shop only, not on the home page).
-- Applied to the live database on 17 Oct 2026 at about 23:50 IST. Undo: 2026-10-17-shelves-undo.sql.

begin;

-- Snacks: noodles and pasta after the premixes.
update public.products p set category_id = c.id, group_label = 'Millet noodles & pasta', sort_order = v.sort_order
from public.categories c, (values ('millet-noodles', 15), ('millet-pasta', 16), ('gluten-free-spaghetti-noodles', 17)) as v(slug, sort_order)
where c.slug = 'snacks-premixes' and p.slug = v.slug;
update public.categories set eyebrow = 'Tea-time companions, quick meal premixes and millet noodles',
  description = 'Mindfully baked tea-time companions, quick healthy meal premixes, and millet noodles and pasta.', sort_order = 3
where slug = 'snacks-premixes';
-- The now-empty Millet Noodles & Pasta shelf is kept (a delete was blocked here); the site hides shelves without products.
-- Remove it in /admin > Categories when convenient.
update public.categories set sort_order = 9 where slug = 'noodles-pasta';

-- Pantry: honey with jaggery and khandasari, then salt & poha, then pickles & chatni.
update public.products p set category_id = c.id, group_label = v.group_label, sort_order = v.sort_order
from public.categories c, (values
  ('jaggery-granules', 'Jaggery, khandasari & honey', 14),
  ('khandsari', 'Jaggery, khandasari & honey', 15),
  ('jungle-honey', 'Jaggery, khandasari & honey', 16),
  ('himalayan-pink-salt', 'Salt & poha', 17),
  ('adanshilpa-poha', 'Salt & poha', 18),
  ('mango-pickle', 'Pickles & chatni', 19),
  ('lemon-pickle', 'Pickles & chatni', 20),
  ('nimbu-ki-khatti-mithi-chatni', 'Pickles & chatni', 21)
) as v(slug, group_label, sort_order)
where c.slug = 'spices-staples' and p.slug = v.slug;
update public.categories set description = 'Unpolished dals, Haldi (turmeric), desi ghee, room-temperature wood-pressed oils, Jaggery Granules, Khandasari, Jungle Honey, Himalayan pink salt, Adanshilpa poha, and pickles and chatni.'
where slug = 'spices-staples';

-- Handmade: what is left of the old pickles shelf, renamed (old /shop/pickles-honey links redirect in the app).
update public.categories set slug = 'handmade-decor', name = 'Handmade Soaps & Décor', short_name = 'Soaps & décor',
  description = 'Handmade soap and eco-friendly wall décor.', sort_order = 4
where slug = 'pickles-honey';
update public.products set sort_order = 1 where slug = 'handmade-soap';
update public.products set sort_order = 2 where slug = 'ecofriendly-wall-decor';

commit;

-- Check
select c.sort_order, c.slug, p.group_label, count(*) as products from public.categories c join public.products p on p.category_id = c.id
group by c.sort_order, c.slug, p.group_label order by c.sort_order, min(p.sort_order);
