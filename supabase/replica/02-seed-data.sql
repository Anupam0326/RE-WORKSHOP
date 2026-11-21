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
