# Setup Supabase untuk Balincah Trip Manado

## Langkah 1: Buat Tabel di Supabase SQL Editor

1. Buka: https://supabase.com/dashboard/project/ceetfmcwizktfzviphdn/sql/new

2. Copy dan jalankan SQL berikut:

```sql
-- Buat tabel configurations
create table if not exists public.configurations (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aktifkan Row Level Security
alter table public.configurations enable row level security;

-- Policy: siapapun bisa baca (untuk landing page)
create policy "Allow public select configurations"
on public.configurations for select using (true);

-- Policy: service_role bisa tulis (untuk admin panel)
create policy "Allow service_role write configurations"
on public.configurations for all using (true) with check (true);
```

3. Klik **Run** / **Execute**

## Langkah 2: Push Data ke Supabase

Setelah tabel dibuat, jalankan perintah ini di terminal:

```bash
node scripts/push-to-supabase.mjs
```

## Langkah 3: Verifikasi

Buka admin panel → klik **Simpan Perubahan** → cek tab Network di browser untuk memastikan respons `{"success":true,"source":"supabase"}`
