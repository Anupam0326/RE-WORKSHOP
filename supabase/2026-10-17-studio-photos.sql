-- Re Workshop: switch product photos to the Oct 2026 studio shoot (client Drive folder "AMAZON PHOTO SHOOT").
-- Run AFTER the redesign is deployed: the rows point at /products/v2/*.webp files that ship with the new build.
-- Replaces every photo of the products listed below (including the 4 photos uploaded to Kodo Millet in /admin;
-- their files stay in Storage and can be removed later). Products not listed keep their current photos.
-- Safe to run twice: each product's rows are deleted before the new ones are inserted.

begin;

-- adanshilpa-poha: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'adanshilpa-poha');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/adanshilpa-poha-1-960.webp', '/products/v2/adanshilpa-poha-1-480.webp', 0),
  ('/products/v2/adanshilpa-poha-2-960.webp', '/products/v2/adanshilpa-poha-2-480.webp', 1),
  ('/products/v2/adanshilpa-poha-3-960.webp', '/products/v2/adanshilpa-poha-3-480.webp', 2),
  ('/products/v2/adanshilpa-poha-4-960.webp', '/products/v2/adanshilpa-poha-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'adanshilpa-poha';

-- adanshilpa-poha-premix: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'adanshilpa-poha-premix');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/adanshilpa-poha-premix-1-960.webp', '/products/v2/adanshilpa-poha-premix-1-480.webp', 0),
  ('/products/v2/adanshilpa-poha-premix-2-960.webp', '/products/v2/adanshilpa-poha-premix-2-480.webp', 1),
  ('/products/v2/adanshilpa-poha-premix-3-960.webp', '/products/v2/adanshilpa-poha-premix-3-480.webp', 2),
  ('/products/v2/adanshilpa-poha-premix-4-960.webp', '/products/v2/adanshilpa-poha-premix-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'adanshilpa-poha-premix';

-- arhar-dal: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'arhar-dal');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/arhar-dal-1-960.webp', '/products/v2/arhar-dal-1-480.webp', 0),
  ('/products/v2/arhar-dal-2-960.webp', '/products/v2/arhar-dal-2-480.webp', 1),
  ('/products/v2/arhar-dal-3-960.webp', '/products/v2/arhar-dal-3-480.webp', 2),
  ('/products/v2/arhar-dal-4-960.webp', '/products/v2/arhar-dal-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'arhar-dal';

-- bajra-millet-aata: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'bajra-millet-aata');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/bajra-millet-aata-1-960.webp', '/products/v2/bajra-millet-aata-1-480.webp', 0),
  ('/products/v2/bajra-millet-aata-2-960.webp', '/products/v2/bajra-millet-aata-2-480.webp', 1),
  ('/products/v2/bajra-millet-aata-3-960.webp', '/products/v2/bajra-millet-aata-3-480.webp', 2),
  ('/products/v2/bajra-millet-aata-4-960.webp', '/products/v2/bajra-millet-aata-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'bajra-millet-aata';

-- browntop-millet: 5 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'browntop-millet');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/browntop-millet-1-960.webp', '/products/v2/browntop-millet-1-480.webp', 0),
  ('/products/v2/browntop-millet-2-960.webp', '/products/v2/browntop-millet-2-480.webp', 1),
  ('/products/v2/browntop-millet-3-960.webp', '/products/v2/browntop-millet-3-480.webp', 2),
  ('/products/v2/browntop-millet-4-960.webp', '/products/v2/browntop-millet-4-480.webp', 3),
  ('/products/v2/browntop-millet-5-960.webp', '/products/v2/browntop-millet-5-480.webp', 4)
) as v(url, url_small, sort_order) where p.slug = 'browntop-millet';

-- chana-dal: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'chana-dal');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/chana-dal-1-960.webp', '/products/v2/chana-dal-1-480.webp', 0),
  ('/products/v2/chana-dal-2-960.webp', '/products/v2/chana-dal-2-480.webp', 1),
  ('/products/v2/chana-dal-3-960.webp', '/products/v2/chana-dal-3-480.webp', 2),
  ('/products/v2/chana-dal-4-960.webp', '/products/v2/chana-dal-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'chana-dal';

-- desi-chana: 5 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'desi-chana');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/desi-chana-1-960.webp', '/products/v2/desi-chana-1-480.webp', 0),
  ('/products/v2/desi-chana-2-960.webp', '/products/v2/desi-chana-2-480.webp', 1),
  ('/products/v2/desi-chana-3-960.webp', '/products/v2/desi-chana-3-480.webp', 2),
  ('/products/v2/desi-chana-4-960.webp', '/products/v2/desi-chana-4-480.webp', 3),
  ('/products/v2/desi-chana-5-960.webp', '/products/v2/desi-chana-5-480.webp', 4)
) as v(url, url_small, sort_order) where p.slug = 'desi-chana';

-- desi-chana-besan: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'desi-chana-besan');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/desi-chana-besan-1-960.webp', '/products/v2/desi-chana-besan-1-480.webp', 0),
  ('/products/v2/desi-chana-besan-2-960.webp', '/products/v2/desi-chana-besan-2-480.webp', 1),
  ('/products/v2/desi-chana-besan-3-960.webp', '/products/v2/desi-chana-besan-3-480.webp', 2),
  ('/products/v2/desi-chana-besan-4-960.webp', '/products/v2/desi-chana-besan-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'desi-chana-besan';

-- gluten-free-spaghetti-noodles: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'gluten-free-spaghetti-noodles');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/gluten-free-spaghetti-noodles-1-960.webp', '/products/v2/gluten-free-spaghetti-noodles-1-480.webp', 0),
  ('/products/v2/gluten-free-spaghetti-noodles-2-960.webp', '/products/v2/gluten-free-spaghetti-noodles-2-480.webp', 1),
  ('/products/v2/gluten-free-spaghetti-noodles-3-960.webp', '/products/v2/gluten-free-spaghetti-noodles-3-480.webp', 2),
  ('/products/v2/gluten-free-spaghetti-noodles-4-960.webp', '/products/v2/gluten-free-spaghetti-noodles-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'gluten-free-spaghetti-noodles';

-- haldi-powder: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'haldi-powder');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/haldi-powder-1-960.webp', '/products/v2/haldi-powder-1-480.webp', 0),
  ('/products/v2/haldi-powder-2-960.webp', '/products/v2/haldi-powder-2-480.webp', 1),
  ('/products/v2/haldi-powder-3-960.webp', '/products/v2/haldi-powder-3-480.webp', 2),
  ('/products/v2/haldi-powder-4-960.webp', '/products/v2/haldi-powder-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'haldi-powder';

-- handmade-soap: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'handmade-soap');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/handmade-soap-1-960.webp', '/products/v2/handmade-soap-1-480.webp', 0),
  ('/products/v2/handmade-soap-2-960.webp', '/products/v2/handmade-soap-2-480.webp', 1),
  ('/products/v2/handmade-soap-3-960.webp', '/products/v2/handmade-soap-3-480.webp', 2),
  ('/products/v2/handmade-soap-4-960.webp', '/products/v2/handmade-soap-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'handmade-soap';

-- himalayan-pink-salt: 5 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'himalayan-pink-salt');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/himalayan-pink-salt-1-960.webp', '/products/v2/himalayan-pink-salt-1-480.webp', 0),
  ('/products/v2/himalayan-pink-salt-2-960.webp', '/products/v2/himalayan-pink-salt-2-480.webp', 1),
  ('/products/v2/himalayan-pink-salt-3-960.webp', '/products/v2/himalayan-pink-salt-3-480.webp', 2),
  ('/products/v2/himalayan-pink-salt-4-960.webp', '/products/v2/himalayan-pink-salt-4-480.webp', 3),
  ('/products/v2/himalayan-pink-salt-5-960.webp', '/products/v2/himalayan-pink-salt-5-480.webp', 4)
) as v(url, url_small, sort_order) where p.slug = 'himalayan-pink-salt';

-- jaggery-granules: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'jaggery-granules');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/jaggery-granules-1-960.webp', '/products/v2/jaggery-granules-1-480.webp', 0),
  ('/products/v2/jaggery-granules-2-960.webp', '/products/v2/jaggery-granules-2-480.webp', 1),
  ('/products/v2/jaggery-granules-3-960.webp', '/products/v2/jaggery-granules-3-480.webp', 2),
  ('/products/v2/jaggery-granules-4-960.webp', '/products/v2/jaggery-granules-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'jaggery-granules';

-- jau-chana-sattu: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'jau-chana-sattu');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/jau-chana-sattu-1-960.webp', '/products/v2/jau-chana-sattu-1-480.webp', 0),
  ('/products/v2/jau-chana-sattu-2-960.webp', '/products/v2/jau-chana-sattu-2-480.webp', 1),
  ('/products/v2/jau-chana-sattu-3-960.webp', '/products/v2/jau-chana-sattu-3-480.webp', 2),
  ('/products/v2/jau-chana-sattu-4-960.webp', '/products/v2/jau-chana-sattu-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'jau-chana-sattu';

-- jwar-kodo-salty: 5 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'jwar-kodo-salty');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/jwar-kodo-salty-1-960.webp', '/products/v2/jwar-kodo-salty-1-480.webp', 0),
  ('/products/v2/jwar-kodo-salty-2-960.webp', '/products/v2/jwar-kodo-salty-2-480.webp', 1),
  ('/products/v2/jwar-kodo-salty-3-960.webp', '/products/v2/jwar-kodo-salty-3-480.webp', 2),
  ('/products/v2/jwar-kodo-salty-4-960.webp', '/products/v2/jwar-kodo-salty-4-480.webp', 3),
  ('/products/v2/jwar-kodo-salty-5-960.webp', '/products/v2/jwar-kodo-salty-5-480.webp', 4)
) as v(url, url_small, sort_order) where p.slug = 'jwar-kodo-salty';

-- jwar-millet-aata: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'jwar-millet-aata');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/jwar-millet-aata-1-960.webp', '/products/v2/jwar-millet-aata-1-480.webp', 0),
  ('/products/v2/jwar-millet-aata-2-960.webp', '/products/v2/jwar-millet-aata-2-480.webp', 1),
  ('/products/v2/jwar-millet-aata-3-960.webp', '/products/v2/jwar-millet-aata-3-480.webp', 2),
  ('/products/v2/jwar-millet-aata-4-960.webp', '/products/v2/jwar-millet-aata-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'jwar-millet-aata';

-- kali-banga-tukda-rice: 2 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'kali-banga-tukda-rice');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/kali-banga-tukda-rice-1-960.webp', '/products/v2/kali-banga-tukda-rice-1-480.webp', 0),
  ('/products/v2/kali-banga-tukda-rice-2-960.webp', '/products/v2/kali-banga-tukda-rice-2-480.webp', 1)
) as v(url, url_small, sort_order) where p.slug = 'kali-banga-tukda-rice';

-- kangani-millet: 5 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'kangani-millet');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/kangani-millet-1-960.webp', '/products/v2/kangani-millet-1-480.webp', 0),
  ('/products/v2/kangani-millet-2-960.webp', '/products/v2/kangani-millet-2-480.webp', 1),
  ('/products/v2/kangani-millet-3-960.webp', '/products/v2/kangani-millet-3-480.webp', 2),
  ('/products/v2/kangani-millet-4-960.webp', '/products/v2/kangani-millet-4-480.webp', 3),
  ('/products/v2/kangani-millet-5-960.webp', '/products/v2/kangani-millet-5-480.webp', 4)
) as v(url, url_small, sort_order) where p.slug = 'kangani-millet';

-- khandsari: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'khandsari');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/khandsari-1-960.webp', '/products/v2/khandsari-1-480.webp', 0),
  ('/products/v2/khandsari-2-960.webp', '/products/v2/khandsari-2-480.webp', 1),
  ('/products/v2/khandsari-3-960.webp', '/products/v2/khandsari-3-480.webp', 2),
  ('/products/v2/khandsari-4-960.webp', '/products/v2/khandsari-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'khandsari';

-- khapli-gehu-aata: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'khapli-gehu-aata');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/khapli-gehu-aata-1-960.webp', '/products/v2/khapli-gehu-aata-1-480.webp', 0),
  ('/products/v2/khapli-gehu-aata-2-960.webp', '/products/v2/khapli-gehu-aata-2-480.webp', 1),
  ('/products/v2/khapli-gehu-aata-3-960.webp', '/products/v2/khapli-gehu-aata-3-480.webp', 2),
  ('/products/v2/khapli-gehu-aata-4-960.webp', '/products/v2/khapli-gehu-aata-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'khapli-gehu-aata';

-- kodo-halva-premix: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'kodo-halva-premix');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/kodo-halva-premix-1-960.webp', '/products/v2/kodo-halva-premix-1-480.webp', 0),
  ('/products/v2/kodo-halva-premix-2-960.webp', '/products/v2/kodo-halva-premix-2-480.webp', 1),
  ('/products/v2/kodo-halva-premix-3-960.webp', '/products/v2/kodo-halva-premix-3-480.webp', 2),
  ('/products/v2/kodo-halva-premix-4-960.webp', '/products/v2/kodo-halva-premix-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'kodo-halva-premix';

-- kodo-masala-idly-premix: 5 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'kodo-masala-idly-premix');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/kodo-masala-idly-premix-1-960.webp', '/products/v2/kodo-masala-idly-premix-1-480.webp', 0),
  ('/products/v2/kodo-masala-idly-premix-2-960.webp', '/products/v2/kodo-masala-idly-premix-2-480.webp', 1),
  ('/products/v2/kodo-masala-idly-premix-3-960.webp', '/products/v2/kodo-masala-idly-premix-3-480.webp', 2),
  ('/products/v2/kodo-masala-idly-premix-4-960.webp', '/products/v2/kodo-masala-idly-premix-4-480.webp', 3),
  ('/products/v2/kodo-masala-idly-premix-5-960.webp', '/products/v2/kodo-masala-idly-premix-5-480.webp', 4)
) as v(url, url_small, sort_order) where p.slug = 'kodo-masala-idly-premix';

-- kodo-millet: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'kodo-millet');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/kodo-millet-1-960.webp', '/products/v2/kodo-millet-1-480.webp', 0),
  ('/products/v2/kodo-millet-2-960.webp', '/products/v2/kodo-millet-2-480.webp', 1),
  ('/products/v2/kodo-millet-3-960.webp', '/products/v2/kodo-millet-3-480.webp', 2),
  ('/products/v2/kodo-millet-4-960.webp', '/products/v2/kodo-millet-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'kodo-millet';

-- kodo-upma-premix: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'kodo-upma-premix');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/kodo-upma-premix-1-960.webp', '/products/v2/kodo-upma-premix-1-480.webp', 0),
  ('/products/v2/kodo-upma-premix-2-960.webp', '/products/v2/kodo-upma-premix-2-480.webp', 1),
  ('/products/v2/kodo-upma-premix-3-960.webp', '/products/v2/kodo-upma-premix-3-480.webp', 2),
  ('/products/v2/kodo-upma-premix-4-960.webp', '/products/v2/kodo-upma-premix-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'kodo-upma-premix';

-- kutki-millet: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'kutki-millet');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/kutki-millet-1-960.webp', '/products/v2/kutki-millet-1-480.webp', 0),
  ('/products/v2/kutki-millet-2-960.webp', '/products/v2/kutki-millet-2-480.webp', 1),
  ('/products/v2/kutki-millet-3-960.webp', '/products/v2/kutki-millet-3-480.webp', 2),
  ('/products/v2/kutki-millet-4-960.webp', '/products/v2/kutki-millet-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'kutki-millet';

-- lemon-pickle: 3 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'lemon-pickle');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/lemon-pickle-1-960.webp', '/products/v2/lemon-pickle-1-480.webp', 0),
  ('/products/v2/lemon-pickle-2-960.webp', '/products/v2/lemon-pickle-2-480.webp', 1),
  ('/products/v2/lemon-pickle-3-960.webp', '/products/v2/lemon-pickle-3-480.webp', 2)
) as v(url, url_small, sort_order) where p.slug = 'lemon-pickle';

-- millet-noodles: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'millet-noodles');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/millet-noodles-1-960.webp', '/products/v2/millet-noodles-1-480.webp', 0),
  ('/products/v2/millet-noodles-2-960.webp', '/products/v2/millet-noodles-2-480.webp', 1),
  ('/products/v2/millet-noodles-3-960.webp', '/products/v2/millet-noodles-3-480.webp', 2),
  ('/products/v2/millet-noodles-4-960.webp', '/products/v2/millet-noodles-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'millet-noodles';

-- millet-pasta: 5 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'millet-pasta');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/millet-pasta-1-960.webp', '/products/v2/millet-pasta-1-480.webp', 0),
  ('/products/v2/millet-pasta-2-960.webp', '/products/v2/millet-pasta-2-480.webp', 1),
  ('/products/v2/millet-pasta-3-960.webp', '/products/v2/millet-pasta-3-480.webp', 2),
  ('/products/v2/millet-pasta-4-960.webp', '/products/v2/millet-pasta-4-480.webp', 3),
  ('/products/v2/millet-pasta-5-960.webp', '/products/v2/millet-pasta-5-480.webp', 4)
) as v(url, url_small, sort_order) where p.slug = 'millet-pasta';

-- moong-dal-chhilka: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'moong-dal-chhilka');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/moong-dal-chhilka-1-960.webp', '/products/v2/moong-dal-chhilka-1-480.webp', 0),
  ('/products/v2/moong-dal-chhilka-2-960.webp', '/products/v2/moong-dal-chhilka-2-480.webp', 1),
  ('/products/v2/moong-dal-chhilka-3-960.webp', '/products/v2/moong-dal-chhilka-3-480.webp', 2),
  ('/products/v2/moong-dal-chhilka-4-960.webp', '/products/v2/moong-dal-chhilka-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'moong-dal-chhilka';

-- nimbu-ki-khatti-mithi-chatni: 3 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'nimbu-ki-khatti-mithi-chatni');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/nimbu-ki-khatti-mithi-chatni-1-960.webp', '/products/v2/nimbu-ki-khatti-mithi-chatni-1-480.webp', 0),
  ('/products/v2/nimbu-ki-khatti-mithi-chatni-2-960.webp', '/products/v2/nimbu-ki-khatti-mithi-chatni-2-480.webp', 1),
  ('/products/v2/nimbu-ki-khatti-mithi-chatni-3-960.webp', '/products/v2/nimbu-ki-khatti-mithi-chatni-3-480.webp', 2)
) as v(url, url_small, sort_order) where p.slug = 'nimbu-ki-khatti-mithi-chatni';

-- peri-cori-bite: 5 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'peri-cori-bite');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/peri-cori-bite-1-960.webp', '/products/v2/peri-cori-bite-1-480.webp', 0),
  ('/products/v2/peri-cori-bite-2-960.webp', '/products/v2/peri-cori-bite-2-480.webp', 1),
  ('/products/v2/peri-cori-bite-3-960.webp', '/products/v2/peri-cori-bite-3-480.webp', 2),
  ('/products/v2/peri-cori-bite-4-960.webp', '/products/v2/peri-cori-bite-4-480.webp', 3),
  ('/products/v2/peri-cori-bite-5-960.webp', '/products/v2/peri-cori-bite-5-480.webp', 4)
) as v(url, url_small, sort_order) where p.slug = 'peri-cori-bite';

-- ragi-millet-aata: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'ragi-millet-aata');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/ragi-millet-aata-1-960.webp', '/products/v2/ragi-millet-aata-1-480.webp', 0),
  ('/products/v2/ragi-millet-aata-2-960.webp', '/products/v2/ragi-millet-aata-2-480.webp', 1),
  ('/products/v2/ragi-millet-aata-3-960.webp', '/products/v2/ragi-millet-aata-3-480.webp', 2),
  ('/products/v2/ragi-millet-aata-4-960.webp', '/products/v2/ragi-millet-aata-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'ragi-millet-aata';

-- sabut-moong: 5 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'sabut-moong');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/sabut-moong-1-960.webp', '/products/v2/sabut-moong-1-480.webp', 0),
  ('/products/v2/sabut-moong-2-960.webp', '/products/v2/sabut-moong-2-480.webp', 1),
  ('/products/v2/sabut-moong-3-960.webp', '/products/v2/sabut-moong-3-480.webp', 2),
  ('/products/v2/sabut-moong-4-960.webp', '/products/v2/sabut-moong-4-480.webp', 3),
  ('/products/v2/sabut-moong-5-960.webp', '/products/v2/sabut-moong-5-480.webp', 4)
) as v(url, url_small, sort_order) where p.slug = 'sabut-moong';

-- sama-millet: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'sama-millet');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/sama-millet-1-960.webp', '/products/v2/sama-millet-1-480.webp', 0),
  ('/products/v2/sama-millet-2-960.webp', '/products/v2/sama-millet-2-480.webp', 1),
  ('/products/v2/sama-millet-3-960.webp', '/products/v2/sama-millet-3-480.webp', 2),
  ('/products/v2/sama-millet-4-960.webp', '/products/v2/sama-millet-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'sama-millet';

-- sharbati-gehu-aata: 4 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'sharbati-gehu-aata');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/sharbati-gehu-aata-1-960.webp', '/products/v2/sharbati-gehu-aata-1-480.webp', 0),
  ('/products/v2/sharbati-gehu-aata-2-960.webp', '/products/v2/sharbati-gehu-aata-2-480.webp', 1),
  ('/products/v2/sharbati-gehu-aata-3-960.webp', '/products/v2/sharbati-gehu-aata-3-480.webp', 2),
  ('/products/v2/sharbati-gehu-aata-4-960.webp', '/products/v2/sharbati-gehu-aata-4-480.webp', 3)
) as v(url, url_small, sort_order) where p.slug = 'sharbati-gehu-aata';

-- thekua: 3 photos
delete from public.product_images where product_id = (select id from public.products where slug = 'thekua');
insert into public.product_images (product_id, url, url_small, storage_paths, sort_order)
select p.id, v.url, v.url_small, '{}', v.sort_order from public.products p, (values
  ('/products/v2/thekua-1-960.webp', '/products/v2/thekua-1-480.webp', 0),
  ('/products/v2/thekua-2-960.webp', '/products/v2/thekua-2-480.webp', 1),
  ('/products/v2/thekua-3-960.webp', '/products/v2/thekua-3-480.webp', 2)
) as v(url, url_small, sort_order) where p.slug = 'thekua';

commit;

-- Check: every listed product now has its studio photos.
select p.slug, count(i.id) as photos from public.products p left join public.product_images i on i.product_id = p.id where p.slug in ('adanshilpa-poha', 'adanshilpa-poha-premix', 'arhar-dal', 'bajra-millet-aata', 'browntop-millet', 'chana-dal', 'desi-chana', 'desi-chana-besan', 'gluten-free-spaghetti-noodles', 'haldi-powder', 'handmade-soap', 'himalayan-pink-salt', 'jaggery-granules', 'jau-chana-sattu', 'jwar-kodo-salty', 'jwar-millet-aata', 'kali-banga-tukda-rice', 'kangani-millet', 'khandsari', 'khapli-gehu-aata', 'kodo-halva-premix', 'kodo-masala-idly-premix', 'kodo-millet', 'kodo-upma-premix', 'kutki-millet', 'lemon-pickle', 'millet-noodles', 'millet-pasta', 'moong-dal-chhilka', 'nimbu-ki-khatti-mithi-chatni', 'peri-cori-bite', 'ragi-millet-aata', 'sabut-moong', 'sama-millet', 'sharbati-gehu-aata', 'thekua') group by p.slug order by p.slug;