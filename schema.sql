-- ============================================================
-- Multi-Table Schema untuk Balincah Trip Manado
-- Jalankan di: https://supabase.com/dashboard/project/ceetfmcwizktfzviphdn/sql/new
-- ============================================================

-- 1. Site Configuration (brand, contact, hero, about)
create table if not exists public.site_config (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text,
  updated_at timestamptz default timezone('utc', now())
);

-- 2. Paket Wisata
create table if not exists public.packages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  type text,
  location text,
  duration text,
  price_from integer default 0,
  rating numeric(3,1) default 5.0,
  featured boolean default false,
  image text,
  location_detail text,
  sort_order integer default 0,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- 3. Item per Paket (fasilitas, eksklusi, akomodasi, kebijakan)
create table if not exists public.package_items (
  id uuid default gen_random_uuid() primary key,
  package_id uuid references public.packages(id) on delete cascade,
  type text not null check (type in ('facility','exclusion','accommodation','policy')),
  text text not null,
  sort_order integer default 0
);

-- 4. Itinerary per Paket
create table if not exists public.package_itinerary (
  id uuid default gen_random_uuid() primary key,
  package_id uuid references public.packages(id) on delete cascade,
  time text,
  text text not null,
  sort_order integer default 0
);

-- 5. Galeri Global
create table if not exists public.gallery (
  id uuid default gen_random_uuid() primary key,
  title text,
  description text,
  image text,
  sort_order integer default 0,
  created_at timestamptz default timezone('utc', now())
);

-- 6. Galeri per Paket (foto khusus tiap paket)
create table if not exists public.package_gallery (
  id uuid default gen_random_uuid() primary key,
  package_id uuid references public.packages(id) on delete cascade,
  title text,
  description text,
  image text,
  sort_order integer default 0
);

-- 7. Destinasi Wisata
create table if not exists public.destinations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image text,
  sort_order integer default 0
);

-- 8. Testimoni Pelanggan
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  quote text not null,
  author text,
  sort_order integer default 0
);

-- 9. FAQ
create table if not exists public.faqs (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  answer text not null,
  sort_order integer default 0
);

-- 10. Alasan Memilih Kami
create table if not exists public.reasons (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  sort_order integer default 0
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.site_config enable row level security;
alter table public.packages enable row level security;
alter table public.package_items enable row level security;
alter table public.package_itinerary enable row level security;
alter table public.gallery enable row level security;
alter table public.package_gallery enable row level security;
alter table public.destinations enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.reasons enable row level security;

-- Allow public read (for landing page)
create policy "public read site_config" on public.site_config for select using (true);
create policy "public read packages" on public.packages for select using (true);
create policy "public read package_items" on public.package_items for select using (true);
create policy "public read package_itinerary" on public.package_itinerary for select using (true);
create policy "public read gallery" on public.gallery for select using (true);
create policy "public read package_gallery" on public.package_gallery for select using (true);
create policy "public read destinations" on public.destinations for select using (true);
create policy "public read testimonials" on public.testimonials for select using (true);
create policy "public read faqs" on public.faqs for select using (true);
create policy "public read reasons" on public.reasons for select using (true);

-- Allow service_role full access (for admin panel)
create policy "service write site_config" on public.site_config for all using (true) with check (true);
create policy "service write packages" on public.packages for all using (true) with check (true);
create policy "service write package_items" on public.package_items for all using (true) with check (true);
create policy "service write package_itinerary" on public.package_itinerary for all using (true) with check (true);
create policy "service write gallery" on public.gallery for all using (true) with check (true);
create policy "service write package_gallery" on public.package_gallery for all using (true) with check (true);
create policy "service write destinations" on public.destinations for all using (true) with check (true);
create policy "service write testimonials" on public.testimonials for all using (true) with check (true);
create policy "service write faqs" on public.faqs for all using (true) with check (true);
create policy "service write reasons" on public.reasons for all using (true) with check (true);
