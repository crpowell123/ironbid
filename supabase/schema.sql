-- IronBid Demo Schema
-- Run this in your Supabase SQL editor (New project → SQL Editor → New query)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── USERS ────────────────────────────────────────────────────────────────────
create table public.users (
  id           uuid primary key default uuid_generate_v4(),
  email        text unique not null,
  role         text not null check (role in ('dealer', 'buyer', 'admin')) default 'buyer',
  company_name text,
  full_name    text,
  phone        text,
  location     text,
  created_at   timestamptz default now()
);

-- ─── LISTINGS ─────────────────────────────────────────────────────────────────
create table public.listings (
  id               uuid primary key default uuid_generate_v4(),
  seller_id        uuid references public.users(id) on delete cascade,
  title            text not null,
  equipment_type   text not null,
  year             integer not null,
  make             text not null,
  model            text not null,
  hours            integer,
  miles            integer,
  condition_grade  integer check (condition_grade between 1 and 5),
  location         text not null,
  asking_price     numeric(12,2) not null,
  listing_type     text not null check (listing_type in ('auction', 'fixed')) default 'fixed',
  status           text not null check (status in ('active', 'pending', 'sold', 'draft')) default 'active',
  description      text,
  known_issues     text,
  vin_serial       text,
  auction_end_at   timestamptz,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ─── LISTING PHOTOS ───────────────────────────────────────────────────────────
create table public.listing_photos (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid references public.listings(id) on delete cascade,
  url         text not null,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- ─── VALUATIONS ───────────────────────────────────────────────────────────────
create table public.valuations (
  id           uuid primary key default uuid_generate_v4(),
  listing_id   uuid references public.listings(id) on delete cascade unique,
  fmv_low      numeric(12,2) not null,
  fmv_high     numeric(12,2) not null,
  confidence   text check (confidence in ('high', 'medium', 'low')),
  rationale    text,
  comparables  jsonb,
  created_at   timestamptz default now()
);

-- ─── INSPECTION REPORTS ───────────────────────────────────────────────────────
create table public.inspection_reports (
  id               uuid primary key default uuid_generate_v4(),
  listing_id       uuid references public.listings(id) on delete cascade unique,
  inspector_name   text not null,
  inspector_co     text,
  inspection_date  date not null,
  hours_verified   integer,
  condition_notes  text,
  engine_grade     integer check (engine_grade between 1 and 5),
  transmission_grade integer check (transmission_grade between 1 and 5),
  frame_grade      integer check (frame_grade between 1 and 5),
  status           text check (status in ('verified', 'pending', 'failed')) default 'verified',
  photos           jsonb,
  created_at       timestamptz default now()
);

-- ─── BIDS ─────────────────────────────────────────────────────────────────────
create table public.bids (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid references public.listings(id) on delete cascade,
  bidder_id   uuid references public.users(id) on delete cascade,
  amount      numeric(12,2) not null,
  status      text check (status in ('active', 'outbid', 'won', 'cancelled')) default 'active',
  created_at  timestamptz default now()
);

-- ─── COMPARABLES ──────────────────────────────────────────────────────────────
create table public.comparables (
  id             uuid primary key default uuid_generate_v4(),
  equipment_type text not null,
  year           integer not null,
  make           text not null,
  model          text not null,
  hours          integer,
  miles          integer,
  condition      text,
  sale_price     numeric(12,2) not null,
  sale_date      date not null,
  region         text not null,
  source         text default 'auction',
  created_at     timestamptz default now()
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;
alter table public.valuations enable row level security;
alter table public.inspection_reports enable row level security;
alter table public.bids enable row level security;
alter table public.comparables enable row level security;

-- Public read on listings (anyone can browse)
create policy "Anyone can view active listings"
  on public.listings for select
  using (status = 'active');

create policy "Dealers can manage own listings"
  on public.listings for all
  using (auth.uid()::text = seller_id::text);

-- Public read on photos, valuations, inspections, comparables
create policy "Anyone can view listing photos"
  on public.listing_photos for select using (true);

create policy "Anyone can view valuations"
  on public.valuations for select using (true);

create policy "Anyone can view inspection reports"
  on public.inspection_reports for select using (true);

create policy "Anyone can view comparables"
  on public.comparables for select using (true);

-- Bids: logged in users can bid, see own bids
create policy "Anyone can view bids on a listing"
  on public.bids for select using (true);

create policy "Logged in users can place bids"
  on public.bids for insert
  with check (auth.uid() is not null);

-- Users can see their own profile
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid()::text = id::text);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid()::text = id::text);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
create index on public.listings(status);
create index on public.listings(equipment_type);
create index on public.listings(seller_id);
create index on public.bids(listing_id);
create index on public.bids(bidder_id);
create index on public.comparables(equipment_type, year);
