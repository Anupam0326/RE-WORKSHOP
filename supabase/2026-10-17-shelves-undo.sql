-- UNDO for 2026-10-17-shelves.sql: puts the five shelves back exactly as they were on 17 Oct 2026, 23:40 IST.

begin;

insert into public.categories (id, slug, name, short_name, eyebrow, description, sort_order, created_at)
values ('f8179b67-36e6-4acf-be47-0574217b69ff', 'noodles-pasta', 'Millet Noodles & Pasta', 'Noodles & pasta', 'Everyday comfort food, made with millets',
        'Millet noodles, millet pasta and gluten-free spaghetti, made with kodo or foxtail millet.', 4, '2026-10-06T18:30:29.505597+00:00')
on conflict (id) do update set sort_order = 4;  -- the shelf was kept (empty) by the change, so this just restores its position

update public.categories set slug = 'pickles-honey', name = 'Pickles, Honey & Handmade Soaps', short_name = 'Pickles, honey & soaps', eyebrow = 'From the same shelves',
  description = 'Pickles and chatni, Jungle Honey, handmade soaps and eco-friendly décor.', sort_order = 5
where id = 'd646fa18-8a09-4cc6-810d-1499afd1adf4';
update public.categories set eyebrow = 'Tea-time companions and quick healthy meals', description = 'Mindfully baked tea-time companions and quick healthy meal premixes.', sort_order = 3
where id = '8d6e2518-b365-482e-89b2-0317393b2260';
update public.categories set description = 'Unpolished dals, Haldi (turmeric), desi ghee, room-temperature wood-pressed oils, Jaggery Granules, Khandasari, Himalayan pink salt and Adanshilpa poha.'
where id = '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6';

update public.products p set category_id = v.category_id::uuid, group_label = v.group_label, sort_order = v.sort_order
from (values
  ('millet-noodles', 'f8179b67-36e6-4acf-be47-0574217b69ff', 'Millet noodles & pasta', 1),
  ('millet-pasta', 'f8179b67-36e6-4acf-be47-0574217b69ff', 'Millet noodles & pasta', 2),
  ('gluten-free-spaghetti-noodles', 'f8179b67-36e6-4acf-be47-0574217b69ff', 'Millet noodles & pasta', 3),
  ('jaggery-granules', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Jaggery & Khandasari', 14),
  ('khandsari', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Jaggery & Khandasari', 15),
  ('himalayan-pink-salt', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Salt & poha', 16),
  ('adanshilpa-poha', '7f2716bf-0cf8-4f1d-9d04-1de150ede7f6', 'Salt & poha', 17),
  ('mango-pickle', 'd646fa18-8a09-4cc6-810d-1499afd1adf4', 'Pickles & chatni', 1),
  ('lemon-pickle', 'd646fa18-8a09-4cc6-810d-1499afd1adf4', 'Pickles & chatni', 2),
  ('nimbu-ki-khatti-mithi-chatni', 'd646fa18-8a09-4cc6-810d-1499afd1adf4', 'Pickles & chatni', 3),
  ('jungle-honey', 'd646fa18-8a09-4cc6-810d-1499afd1adf4', 'Honey', 4),
  ('handmade-soap', 'd646fa18-8a09-4cc6-810d-1499afd1adf4', 'Handmade soaps', 5),
  ('ecofriendly-wall-decor', 'd646fa18-8a09-4cc6-810d-1499afd1adf4', 'Eco-friendly décor', 6)
) as v(slug, category_id, group_label, sort_order)
where p.slug = v.slug;

commit;
