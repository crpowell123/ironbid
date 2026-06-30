-- IronBid Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor

-- ─── DEMO USERS ───────────────────────────────────────────────────────────────
insert into public.users (id, email, role, company_name, full_name, phone, location) values
  ('a0000000-0000-0000-0000-000000000001', 'dealer@ironbid.demo', 'dealer', 'Powell Heavy Equipment', 'Chris Powell', '910-555-0101', 'Wilmington, NC'),
  ('a0000000-0000-0000-0000-000000000002', 'buyer@ironbid.demo',  'buyer',  null,                    'Marcus Webb',  '704-555-0182', 'Charlotte, NC'),
  ('a0000000-0000-0000-0000-000000000003', 'buyer2@ironbid.demo', 'buyer',  'Webb Construction',     'Dana Webb',    '919-555-0247', 'Raleigh, NC');

-- ─── DEMO LISTINGS ────────────────────────────────────────────────────────────
insert into public.listings (id, seller_id, title, equipment_type, year, make, model, hours, miles, condition_grade, location, asking_price, listing_type, status, description, known_issues) values
  (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    '2019 Kenworth T680 — 485k miles, clean title',
    'semi_tractor',
    2019, 'Kenworth', 'T680',
    null, 485000, 4,
    'Wilmington, NC',
    155000.00, 'auction', 'active',
    'Well-maintained day cab, Paccar MX-13 engine, 10-speed Eaton Fuller, APU, pre-pass, full service history available. Fleet-owned, single owner.',
    'Minor paint fade on driver door. Front tires at 40%.'
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    '2020 Caterpillar 320 Excavator — 2,100 hours',
    'excavator',
    2020, 'Caterpillar', '320',
    2100, null, 5,
    'Wilmington, NC',
    198000.00, 'fixed', 'active',
    'One-owner machine, used on solar construction sites in NC and SC. Full Cat dealer service records. Hydraulics rebuilt at 1800 hours. Comes with 36" bucket.',
    null
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    '2018 Fontaine Magnitude 55 RGN — 3-axle',
    'trailer_rgn',
    2018, 'Fontaine', 'Magnitude 55',
    null, null, 4,
    'Wilmington, NC',
    72000.00, 'fixed', 'active',
    '55-ton RGN, 3-axle, 29.5ft well length, hydraulic detachable neck. Used for heavy haul and solar panel delivery. Clean title, no accidents.',
    'Deck has surface rust in 2 spots, not structural. Glad hands need replacing.'
  ),
  (
    'b0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000001',
    '2021 Peterbilt 389 — 310k miles, show condition',
    'semi_tractor',
    2021, 'Peterbilt', '389',
    null, 310000, 5,
    'Wilmington, NC',
    189000.00, 'fixed', 'active',
    'Paccar MX-13 565hp, 18-speed, 244 wheelbase, chrome package, full sleeper, no DEF issues. Owner-operator truck, meticulous maintenance log.',
    null
  ),
  (
    'b0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000001',
    '2017 John Deere 850K Dozer — 3,800 hours',
    'bulldozer',
    2017, 'John Deere', '850K',
    3800, null, 3,
    'Wilmington, NC',
    118000.00, 'auction', 'active',
    'Large frame dozer, PAT blade, ripper. Used on commercial site prep. Engine strong, recent track rebuild at 3500 hours.',
    'Cab AC needs recharge. Blade cutting edge at 30%.'
  );

-- ─── LISTING PHOTOS (using Unsplash stock for demo) ───────────────────────────
insert into public.listing_photos (listing_id, url, sort_order) values
  ('b0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200', 0),
  ('b0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200', 1),
  ('b0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200', 0),
  ('b0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200', 1),
  ('b0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200', 0),
  ('b0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200', 0),
  ('b0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200', 0);

-- ─── INSPECTION REPORTS ───────────────────────────────────────────────────────
insert into public.inspection_reports (listing_id, inspector_name, inspector_co, inspection_date, hours_verified, condition_notes, engine_grade, transmission_grade, frame_grade, status, photos) values
  (
    'b0000000-0000-0000-0000-000000000001',
    'Ray Tillman', 'Southeast Equipment Inspections LLC',
    '2025-05-12', null,
    'Engine starts clean, no smoke. DPF recently serviced. Brakes at 60% front, 70% rear. Frame straight, no cracks. Lights all functional.',
    4, 4, 5, 'verified',
    '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800","https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800"]'
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'Ray Tillman', 'Southeast Equipment Inspections LLC',
    '2025-05-14', 2100,
    'Hours verified via ECU. Hydraulics tight, no leaks. Undercarriage at 60%. Swing bearing within spec. All pins and bushings recently greased.',
    5, 5, 5, 'verified',
    '["https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800"]'
  ),
  (
    'b0000000-0000-0000-0000-000000000004',
    'Ray Tillman', 'Southeast Equipment Inspections LLC',
    '2025-05-18', null,
    'Exceptional condition. Engine pulls hard, no smoke or leaks. Interior very clean. Sleeper HVAC fully operational. Tires 80%+ all around.',
    5, 5, 5, 'verified',
    '["https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800"]'
  );

-- ─── DEMO BIDS (to make auction listings look live) ───────────────────────────
insert into public.bids (listing_id, bidder_id, amount, status, created_at) values
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 138000, 'outbid',   now() - interval '3 days'),
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 142000, 'outbid',   now() - interval '2 days'),
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 147500, 'outbid',   now() - interval '1 day'),
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 151000, 'active',   now() - interval '4 hours'),
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 105000, 'outbid',   now() - interval '2 days'),
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', 109000, 'active',   now() - interval '6 hours');

-- ─── COMPARABLES (80 real-ish auction results for valuation engine) ────────────
insert into public.comparables (equipment_type, year, make, model, hours, miles, condition, sale_price, sale_date, region, source) values
  -- Semi tractors
  ('semi_tractor', 2019, 'Kenworth',  'T680',    null, 510000, 'good',      148000, '2025-03-15', 'Southeast', 'IronPlanet'),
  ('semi_tractor', 2019, 'Kenworth',  'T680',    null, 460000, 'very_good', 157000, '2025-02-20', 'Southeast', 'IronPlanet'),
  ('semi_tractor', 2019, 'Kenworth',  'T680',    null, 530000, 'fair',      138000, '2025-01-10', 'Southeast', 'Ritchie Bros'),
  ('semi_tractor', 2018, 'Kenworth',  'T680',    null, 580000, 'good',      132000, '2025-02-05', 'Southeast', 'IronPlanet'),
  ('semi_tractor', 2020, 'Kenworth',  'T680',    null, 420000, 'very_good', 168000, '2025-04-01', 'Southeast', 'Ritchie Bros'),
  ('semi_tractor', 2019, 'Peterbilt', '579',     null, 495000, 'good',      151000, '2025-03-22', 'Southeast', 'IronPlanet'),
  ('semi_tractor', 2019, 'Freightliner','Cascadia',null,520000,'good',      141000, '2025-02-14', 'Southeast', 'IronPlanet'),
  ('semi_tractor', 2019, 'Kenworth',  'T680',    null, 475000, 'good',      153000, '2025-04-10', 'Midwest',   'IronPlanet'),
  ('semi_tractor', 2019, 'Kenworth',  'T680',    null, 502000, 'good',      146000, '2025-01-28', 'Midwest',   'Ritchie Bros'),
  ('semi_tractor', 2019, 'Kenworth',  'T680',    null, 488000, 'very_good', 159000, '2025-03-05', 'Southeast', 'Dealer'),

  -- Peterbilt 389
  ('semi_tractor', 2021, 'Peterbilt', '389',     null, 290000, 'very_good', 192000, '2025-04-15', 'Southeast', 'Dealer'),
  ('semi_tractor', 2021, 'Peterbilt', '389',     null, 320000, 'very_good', 185000, '2025-03-10', 'Southeast', 'IronPlanet'),
  ('semi_tractor', 2020, 'Peterbilt', '389',     null, 380000, 'good',      172000, '2025-02-22', 'Southeast', 'Ritchie Bros'),
  ('semi_tractor', 2021, 'Peterbilt', '389',     null, 275000, 'excellent', 198000, '2025-04-20', 'Southeast', 'Dealer'),
  ('semi_tractor', 2022, 'Peterbilt', '389',     null, 210000, 'excellent', 215000, '2025-05-01', 'Southeast', 'Dealer'),
  ('semi_tractor', 2021, 'Peterbilt', '389',     null, 340000, 'good',      178000, '2025-01-15', 'Midwest',   'IronPlanet'),
  ('semi_tractor', 2020, 'Peterbilt', '389',     null, 395000, 'good',      168000, '2025-02-08', 'Southeast', 'IronPlanet'),
  ('semi_tractor', 2021, 'Peterbilt', '389',     null, 308000, 'very_good', 187000, '2025-03-28', 'Southeast', 'Dealer'),

  -- Excavators - Cat 320
  ('excavator',    2020, 'Caterpillar','320',    2100, null, 'excellent',  205000, '2025-04-18', 'Southeast', 'Ritchie Bros'),
  ('excavator',    2020, 'Caterpillar','320',    2400, null, 'very_good',  196000, '2025-03-12', 'Southeast', 'IronPlanet'),
  ('excavator',    2019, 'Caterpillar','320',    3100, null, 'good',       178000, '2025-02-25', 'Southeast', 'Ritchie Bros'),
  ('excavator',    2020, 'Caterpillar','320',    1900, null, 'excellent',  208000, '2025-04-05', 'Southeast', 'Dealer'),
  ('excavator',    2021, 'Caterpillar','320',    1500, null, 'excellent',  221000, '2025-05-02', 'Southeast', 'Dealer'),
  ('excavator',    2020, 'Caterpillar','320',    2600, null, 'good',       189000, '2025-01-20', 'Midwest',   'IronPlanet'),
  ('excavator',    2020, 'Caterpillar','320',    2200, null, 'very_good',  199000, '2025-03-30', 'Southeast', 'Ritchie Bros'),
  ('excavator',    2019, 'Caterpillar','320',    3400, null, 'fair',       162000, '2025-02-10', 'Southeast', 'IronPlanet'),
  ('excavator',    2020, 'Komatsu',   'PC290',   2300, null, 'good',       182000, '2025-03-18', 'Southeast', 'Ritchie Bros'),
  ('excavator',    2020, 'John Deere','350G',    2000, null, 'very_good',  194000, '2025-04-12', 'Southeast', 'IronPlanet'),

  -- Dozers - John Deere 850K
  ('bulldozer',    2017, 'John Deere','850K',    3800, null, 'fair',       115000, '2025-03-08', 'Southeast', 'Ritchie Bros'),
  ('bulldozer',    2017, 'John Deere','850K',    3200, null, 'good',       128000, '2025-02-18', 'Southeast', 'IronPlanet'),
  ('bulldozer',    2018, 'John Deere','850K',    2900, null, 'good',       138000, '2025-04-22', 'Southeast', 'Ritchie Bros'),
  ('bulldozer',    2017, 'John Deere','850K',    4100, null, 'fair',       108000, '2025-01-25', 'Southeast', 'IronPlanet'),
  ('bulldozer',    2016, 'John Deere','850K',    4800, null, 'fair',        98000, '2025-02-05', 'Midwest',   'Ritchie Bros'),
  ('bulldozer',    2018, 'Caterpillar','D6T',    3100, null, 'good',       142000, '2025-03-25', 'Southeast', 'IronPlanet'),
  ('bulldozer',    2017, 'Komatsu',   'D65PX',   3600, null, 'fair',       112000, '2025-02-28', 'Southeast', 'Ritchie Bros'),
  ('bulldozer',    2019, 'John Deere','850K',    2200, null, 'very_good',  155000, '2025-04-30', 'Southeast', 'Dealer'),
  ('bulldozer',    2017, 'John Deere','850K',    3900, null, 'fair',       111000, '2025-01-15', 'Southeast', 'IronPlanet'),

  -- RGN Trailers
  ('trailer_rgn',  2018, 'Fontaine',  'Magnitude 55', null, null, 'good',  69000, '2025-03-20', 'Southeast', 'Dealer'),
  ('trailer_rgn',  2018, 'Fontaine',  'Magnitude 55', null, null, 'very_good', 75000, '2025-02-12', 'Southeast', 'Dealer'),
  ('trailer_rgn',  2017, 'Fontaine',  'Magnitude 55', null, null, 'good',  64000, '2025-01-30', 'Southeast', 'IronPlanet'),
  ('trailer_rgn',  2019, 'Fontaine',  'Magnitude 55', null, null, 'very_good', 78000, '2025-04-08', 'Southeast', 'Dealer'),
  ('trailer_rgn',  2018, 'Goldhofer', 'THP/SL',       null, null, 'good',  71000, '2025-03-05', 'Midwest',   'Ritchie Bros'),
  ('trailer_rgn',  2018, 'Talbert',   '55SA-RGN',     null, null, 'good',  67000, '2025-02-22', 'Southeast', 'Dealer'),
  ('trailer_rgn',  2020, 'Fontaine',  'Magnitude 55', null, null, 'excellent', 85000, '2025-05-05', 'Southeast', 'Dealer'),
  ('trailer_rgn',  2016, 'Fontaine',  'Magnitude 55', null, null, 'fair',  58000, '2025-01-18', 'Southeast', 'IronPlanet'),

  -- Flatbed trailers
  ('trailer_flatbed', 2019, 'Wabash',  'Flatbed 48',  null, null, 'good',   18500, '2025-03-28', 'Southeast', 'Dealer'),
  ('trailer_flatbed', 2020, 'Great Dane','Flatbed 48', null, null, 'very_good', 22000, '2025-04-15', 'Southeast', 'Dealer'),
  ('trailer_flatbed', 2018, 'Wabash',  'Flatbed 48',  null, null, 'good',   16800, '2025-02-08', 'Southeast', 'IronPlanet'),
  ('trailer_flatbed', 2021, 'Fontaine','Flatbed 48',  null, null, 'excellent', 26500, '2025-05-01', 'Southeast', 'Dealer'),

  -- Cranes / lifts
  ('crane',        2018, 'Grove',     'RT760E',  4200, null, 'good',       285000, '2025-03-15', 'Southeast', 'IronPlanet'),
  ('crane',        2019, 'Manitowoc', '18000',   3100, null, 'good',       312000, '2025-04-10', 'Southeast', 'Ritchie Bros'),
  ('crane',        2017, 'Terex',     'RT665',   5100, null, 'fair',       248000, '2025-02-20', 'Southeast', 'IronPlanet'),

  -- Graders
  ('grader',       2018, 'Caterpillar','140M3',  4800, null, 'good',       168000, '2025-03-10', 'Southeast', 'Ritchie Bros'),
  ('grader',       2019, 'John Deere','672GP',   3900, null, 'good',       178000, '2025-04-05', 'Southeast', 'IronPlanet'),
  ('grader',       2017, 'Komatsu',   'GD655',   5200, null, 'fair',       148000, '2025-02-15', 'Southeast', 'Ritchie Bros'),

  -- Additional semi tractors (volume for better valuation matches)
  ('semi_tractor', 2018, 'Freightliner','Cascadia',null,620000,'fair',     118000, '2025-01-12', 'Southeast', 'IronPlanet'),
  ('semi_tractor', 2020, 'Kenworth',  'W990',    null, 380000, 'very_good', 182000, '2025-04-25', 'Southeast', 'Dealer'),
  ('semi_tractor', 2019, 'Volvo',     'VNL 860', null, 498000, 'good',     144000, '2025-03-18', 'Southeast', 'IronPlanet'),
  ('semi_tractor', 2021, 'Kenworth',  'T680',    null, 285000, 'very_good', 188000, '2025-05-08', 'Southeast', 'Dealer'),
  ('semi_tractor', 2018, 'Peterbilt', '389',     null, 490000, 'good',     158000, '2025-02-28', 'Southeast', 'IronPlanet'),
  ('semi_tractor', 2020, 'Freightliner','Cascadia',null,410000,'very_good', 158000, '2025-04-18', 'Midwest',   'IronPlanet'),
  ('semi_tractor', 2019, 'Kenworth',  'T680',    null, 515000, 'good',     145000, '2025-03-01', 'Southeast', 'Ritchie Bros'),
  ('semi_tractor', 2019, 'Kenworth',  'T680',    null, 469000, 'very_good', 161000, '2025-04-28', 'Southeast', 'Dealer'),
  ('semi_tractor', 2020, 'Peterbilt', '389',     null, 355000, 'good',     175000, '2025-03-15', 'Southeast', 'Dealer'),
  ('semi_tractor', 2019, 'Peterbilt', '389',     null, 430000, 'good',     165000, '2025-02-01', 'Southeast', 'IronPlanet'),

  -- More excavators
  ('excavator',    2021, 'Komatsu',   'PC360',   1800, null, 'excellent',  238000, '2025-05-10', 'Southeast', 'Dealer'),
  ('excavator',    2019, 'Caterpillar','320',    2900, null, 'good',       183000, '2025-02-05', 'Southeast', 'Ritchie Bros'),
  ('excavator',    2020, 'Caterpillar','320',    2050, null, 'very_good',  201000, '2025-04-22', 'Southeast', 'IronPlanet'),
  ('excavator',    2018, 'Caterpillar','320',    3800, null, 'fair',       158000, '2025-01-08', 'Southeast', 'IronPlanet'),
  ('excavator',    2020, 'Caterpillar','320',    2350, null, 'good',       193000, '2025-03-05', 'Midwest',   'Ritchie Bros');
