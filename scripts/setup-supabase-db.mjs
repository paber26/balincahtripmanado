/**
 * setup-supabase-db.mjs
 * 
 * Connects directly to Supabase PostgreSQL, creates the configurations table,
 * and inserts the default content.
 * 
 * Usage:
 *   SUPABASE_DB_URL="postgresql://postgres:[password]@db.ceetfmcwizktfzviphdn.supabase.co:5432/postgres" \
 *   node scripts/setup-supabase-db.mjs
 * 
 * Or set SUPABASE_DB_URL in your .env file.
 */

import postgres from "postgres";
import * as dotenv from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load .env manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "../.env");
try {
  const envContent = dotenv.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length > 0) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  }
} catch {}

const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error("❌ SUPABASE_DB_URL tidak ditemukan di .env");
  console.error("\nTambahkan baris ini ke .env:");
  console.error('SUPABASE_DB_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[project-ref].supabase.co:5432/postgres');
  console.error("\nPassword dapat ditemukan di:");
  console.error("https://supabase.com/dashboard/project/ceetfmcwizktfzviphdn/settings/database");
  process.exit(1);
}

const defaultContent = {
  siteName: "Balincah Trip Manado",
  tagline: "Explore Bunaken, Feel the Ocean Experience",
  whatsappE164: "6281245474575",
  instagramHandle: "balincahtripmanado",
  location: "Pantai Liang, Bunaken, Sulawesi Utara",
  heroTitle: "Explore Bunaken with Balincah Trip",
  heroSubtitle: "Open Trip, Private Trip, Snorkeling, Diving, dan Boat Charter Bunaken",
  aboutText:
    "Balincah Trip Manado adalah penyedia layanan wisata bahari di Manado yang berfokus pada perjalanan ke Bunaken, Nain Island, Siladen Island, dan destinasi laut terbaik di Sulawesi Utara.\n\nKami melayani open trip, private trip, boat charter, snorkeling, diving, serta perjalanan wisata rombongan dengan pelayanan yang nyaman, aman, dan menyenangkan.",
  packages: [
    {
      name: "Open Trip Bunaken",
      desc: "Cocok untuk individu, pasangan, atau grup kecil yang ingin bergabung dalam trip bersama peserta lain.",
      type: "open_trip",
      location: "Bunaken, Manado",
      duration: "1 Day",
      priceFrom: 350000,
      rating: 4.9,
      featured: true,
      image: "/gotur/blog-1-343x241.jpg",
      facilities: ["Kapal wisata", "Guide lokal", "Dokumentasi", "Snorkeling", "Kunjungan pulau", "Life jacket"],
      exclusions: ["Pengeluaran pribadi selama trip", "Penerbangan / Transportasi ke meeting point Manado", "Tips untuk tour guide / crew boat (sukarela)", "Asuransi perjalanan (opsional)", "Peralatan diving tambahan di luar paket snorkeling"],
      itinerary: [
        { time: "08.00", text: "Meeting point di Pelabuhan Manado" },
        { time: "08.30", text: "Berangkat menuju Bunaken" },
        { time: "09.30", text: "Tiba di Bunaken dan briefing singkat" },
        { time: "10.00", text: "Snorkeling / diving / foto-foto" },
        { time: "12.00", text: "Istirahat dan makan siang" },
        { time: "13.00", text: "Island hopping / kunjungan spot wisata" },
        { time: "15.00", text: "Perjalanan kembali ke Manado" },
        { time: "16.00", text: "Trip selesai" }
      ],
      accommodations: ["Dermaga penyeberangan Marina Plaza Manado", "Fasilitas peristirahatan di Pantai Liang Bunaken", "Sewa gazebo pantai (opsional)", "Kamar bilas / kamar ganti setelah snorkeling/diving"],
      location_detail: "Spot Snorkeling Bunaken, Nain Island, Siladen Island, Sulawesi Utara.",
      policies: ["DP (Down Payment) minimal 30% didepositkan saat melakukan booking.", "Pelunasan dilakukan paling lambat pada hari H sebelum kapal berangkat.", "Pembatalan trip oleh peserta sebelum H-3 dapat mengembalikan DP sebesar 50%.", "Pembatalan trip oleh pihak Balincah Trip akibat cuaca buruk (Force Majeure) akan direfund penuh (100%).", "Anak di bawah 3 tahun bebas biaya (gratis)."],
      gallery: []
    },
    {
      name: "Private Trip Bunaken",
      desc: "Cocok untuk keluarga, kantor, komunitas, atau rombongan yang ingin perjalanan lebih fleksibel dan eksklusif.",
      type: "private_trip", location: "Bunaken, Manado", duration: "1 Day", priceFrom: 750000, rating: 4.9, featured: true, image: "/gotur/blog-4-343x241.jpg",
      facilities: ["Kapal private", "Jadwal fleksibel", "Guide lokal", "Spot foto terbaik", "Snorkeling", "Dokumentasi"],
      exclusions: ["Pengeluaran pribadi selama trip", "Penerbangan / Transportasi ke meeting point Manado", "Tips untuk tour guide / crew boat (sukarela)", "Asuransi perjalanan (opsional)"],
      itinerary: [{ time: "08.00", text: "Meeting point di Pelabuhan Manado" }, { time: "08.30", text: "Berangkat menuju Bunaken" }, { time: "09.30", text: "Tiba di Bunaken dan briefing singkat" }, { time: "10.00", text: "Snorkeling / diving / foto-foto" }, { time: "12.00", text: "Istirahat dan makan siang" }, { time: "13.00", text: "Island hopping / kunjungan spot wisata" }, { time: "15.00", text: "Perjalanan kembali ke Manado" }, { time: "16.00", text: "Trip selesai" }],
      accommodations: ["Dermaga penyeberangan Marina Plaza Manado", "Fasilitas peristirahatan di Pantai Liang Bunaken", "Sewa gazebo pantai (opsional)", "Kamar bilas / kamar ganti setelah snorkeling/diving"],
      location_detail: "Spot Snorkeling Bunaken, Nain Island, Siladen Island, Sulawesi Utara.",
      policies: ["DP (Down Payment) minimal 30% didepositkan saat melakukan booking.", "Pelunasan dilakukan paling lambat pada hari H sebelum kapal berangkat.", "Pembatalan trip oleh peserta sebelum H-3 dapat mengembalikan DP sebesar 50%.", "Pembatalan trip oleh pihak Balincah Trip akibat cuaca buruk (Force Majeure) akan direfund penuh (100%).", "Anak di bawah 3 tahun bebas biaya (gratis)."],
      gallery: []
    },
    {
      name: "Boat Charter Bunaken",
      desc: "Layanan sewa kapal untuk perjalanan wisata, rombongan, atau kebutuhan khusus.",
      type: "charter", location: "Manado", duration: "By Request", priceFrom: 1200000, rating: 4.8, featured: false, image: "/gotur/blog-5-343x241.jpg",
      facilities: ["Kapal sesuai kapasitas", "Rute sesuai kebutuhan", "Waktu fleksibel", "Cocok untuk rombongan"],
      exclusions: ["Pengeluaran pribadi selama trip", "Bahan bakar tambahan di luar estimasi rute", "Asuransi perjalanan (opsional)"],
      itinerary: [],
      accommodations: ["Fasilitas di atas kapal", "Dermaga penyeberangan Marina Plaza Manado"],
      location_detail: "Perairan Bunaken, Nain, Siladen, dan sekitarnya sesuai request.",
      policies: ["DP minimal 50% saat booking.", "Pelunasan dilakukan sebelum keberangkatan.", "Pembatalan H-3 atau lebih awal dapat refund 50%.", "Cuaca buruk akan direschedule."],
      gallery: []
    },
    {
      name: "Snorkeling Trip",
      desc: "Pengalaman menikmati keindahan bawah laut Bunaken dengan ikan warna-warni dan terumbu karang.",
      type: "snorkeling", location: "Bunaken", duration: "Half Day", priceFrom: 300000, rating: 4.9, featured: false, image: "/gotur/blog-7-343x241.jpg",
      facilities: ["Spot snorkeling pilihan", "Peralatan snorkeling (sesuai paket)", "Pendampingan guide"],
      exclusions: ["Pengeluaran pribadi selama trip", "Peralatan snorkeling pribadi jika tidak disediakan paket", "Asuransi perjalanan (opsional)"],
      itinerary: [{ time: "08.00", text: "Meeting point di Pelabuhan Manado" }, { time: "09.00", text: "Tiba di spot snorkeling Bunaken" }, { time: "09.15", text: "Briefing dan perlengkapan" }, { time: "09.30", text: "Snorkeling di spot pilihan" }, { time: "12.00", text: "Kembali ke daratan" }],
      accommodations: ["Dermaga penyeberangan Marina Plaza Manado"],
      location_detail: "Spot Snorkeling unggulan di sekitar Bunaken.",
      policies: ["DP minimal 30% saat booking.", "Pelunasan sebelum keberangkatan.", "Cuaca buruk direschedule atau refund penuh."],
      gallery: []
    },
    {
      name: "Diving Experience",
      desc: "Paket diving untuk menikmati pesona bawah laut Bunaken bersama instruktur profesional.",
      type: "diving", location: "Bunaken", duration: "Half Day", priceFrom: 650000, rating: 4.8, featured: false, image: "/gotur/blog-8-343x241.jpg",
      facilities: ["Briefing & safety", "Spot diving unggulan", "Cocok untuk pemula & berpengalaman"],
      exclusions: ["Pengeluaran pribadi selama trip", "Perlengkapan diving tambahan di luar paket", "Asuransi perjalanan (opsional)"],
      itinerary: [{ time: "08.00", text: "Meeting point & briefing keselamatan" }, { time: "09.00", text: "Tiba di spot diving" }, { time: "09.15", text: "Persiapan peralatan" }, { time: "09.30", text: "Dive 1" }, { time: "11.00", text: "Istirahat permukaan" }, { time: "11.30", text: "Dive 2 (opsional)" }, { time: "13.00", text: "Kembali ke daratan" }],
      accommodations: ["Dermaga penyeberangan Marina Plaza Manado", "Fasilitas bilas setelah diving"],
      location_detail: "Spot Diving unggulan di sekitar Bunaken.",
      policies: ["DP minimal 30% saat booking.", "Wajib mengisi form kesehatan sebelum diving.", "Peserta dengan kondisi medis tertentu wajib konsultasi dokter.", "Cuaca buruk direschedule atau refund penuh."],
      gallery: []
    },
    {
      name: "Trip 3 Pulau (Bunaken - Nain - Siladen)",
      desc: "Rute wisata ke Bunaken, Nain Island, dan Siladen Island.",
      type: "island_hopping", location: "Bunaken • Nain • Siladen", duration: "1 Day", priceFrom: 500000, rating: 4.9, featured: true, image: "/gotur/blog-9-343x241.jpg",
      facilities: ["Island hopping", "Spot pasir putih", "Dokumentasi momen"],
      exclusions: ["Pengeluaran pribadi selama trip", "Penerbangan / Transportasi ke meeting point Manado", "Tips untuk tour guide / crew boat (sukarela)", "Asuransi perjalanan (opsional)"],
      itinerary: [{ time: "07.30", text: "Meeting point di Pelabuhan Manado" }, { time: "08.00", text: "Berangkat menuju Bunaken" }, { time: "09.00", text: "Snorkeling / explore Bunaken" }, { time: "10.30", text: "Menuju Nain Island" }, { time: "11.30", text: "Explore Nain Island" }, { time: "12.30", text: "Makan siang & istirahat" }, { time: "13.30", text: "Menuju Siladen Island" }, { time: "14.30", text: "Explore Siladen - pasir putih" }, { time: "15.30", text: "Perjalanan kembali ke Manado" }, { time: "16.30", text: "Trip selesai" }],
      accommodations: ["Dermaga penyeberangan Marina Plaza Manado", "Fasilitas di Pantai Liang Bunaken", "Akses pasir putih Siladen"],
      location_detail: "Bunaken Island → Nain Island → Siladen Island, Sulawesi Utara.",
      policies: ["DP minimal 30% saat booking.", "Pelunasan sebelum keberangkatan.", "Pembatalan H-3 refund 50%.", "Cuaca buruk direschedule atau refund penuh.", "Anak di bawah 3 tahun bebas biaya (gratis)."],
      gallery: []
    }
  ],
  destinations: [
    { name: "Bunaken Island", desc: "Ikon wisata bahari Sulawesi Utara dengan pemandangan laut dan terumbu karang." },
    { name: "Nain Island", desc: "Pulau cantik untuk island hopping, spot foto, dan suasana tenang." },
    { name: "Siladen Island", desc: "Pasir putih dan air jernih — cocok untuk santai setelah snorkeling/dive." },
    { name: "Underwater Bunaken", desc: "Spot underwater yang kaya biota laut—pengalaman visual yang sulit dilupakan." }
  ],
  gallery: [
    { title: "Drone View", desc: "Foto drone perjalanan ke Bunaken.", image: "/gotur/hero-1-1-image.jpg" },
    { title: "Underwater", desc: "Terumbu karang dan ikan warna-warni.", image: "/gotur/hero-1-2-image.jpg" },
    { title: "Peserta Trip", desc: "Momen seru bareng peserta trip.", image: "/gotur/about-2-1.jpg" },
    { title: "Kapal", desc: "Kapal wisata siap berangkat.", image: "/gotur/about-s-2-1.jpg" },
    { title: "Pulau & Pasir Putih", desc: "Spot foto pasir putih yang estetik.", image: "/gotur/destination-slider-1-2-268x391.jpg" },
    { title: "Sunset Vibes", desc: "Golden hour di laut Manado.", image: "/gotur/destination-slider-1-3-268x391.jpg" },
    { title: "Snorkeling Spot", desc: "Air jernih & view bawah laut.", image: "/gotur/blog-7-343x241.jpg" },
    { title: "Island Hopping", desc: "Trip 3 pulau: Bunaken–Nain–Siladen.", image: "/gotur/blog-9-343x241.jpg" },
    { title: "Resort Area", desc: "Area dermaga dan resort.", image: "/gotur/blog-5-343x241.jpg" }
  ],
  itinerary: [
    { time: "08.00", text: "Meeting point di Pelabuhan Manado" },
    { time: "08.30", text: "Berangkat menuju Bunaken" },
    { time: "09.30", text: "Tiba di Bunaken dan briefing singkat" },
    { time: "10.00", text: "Snorkeling / diving / foto-foto" },
    { time: "12.00", text: "Istirahat dan makan siang" },
    { time: "13.00", text: "Island hopping / kunjungan spot wisata" },
    { time: "15.00", text: "Perjalanan kembali ke Manado" },
    { time: "16.00", text: "Trip selesai" }
  ],
  reasons: ["Berpengalaman melayani wisata Bunaken", "Dokumentasi perjalanan menarik", "Cocok untuk open trip dan private trip", "Pelayanan ramah dan komunikatif", "Pilihan paket fleksibel", "Booking mudah via WhatsApp", "Cocok untuk wisatawan lokal, nasional, dan internasional"],
  testimonials: [
    { quote: "Trip-nya seru, guide ramah, pemandangan Bunaken luar biasa. Sangat recommended!", by: "Customer Open Trip" },
    { quote: "Pelayanan bagus, dokumentasi keren, dan perjalanan sangat menyenangkan.", by: "Customer Private Trip" },
    { quote: "Cocok untuk liburan keluarga dan rombongan kantor.", by: "Customer Rombongan" }
  ],
  faqs: [
    { q: "Apakah bisa booking untuk rombongan?", a: "Bisa. Balincah Trip melayani private trip, rombongan kantor, komunitas, keluarga, dan grup wisata." },
    { q: "Apakah tersedia alat snorkeling?", a: "Ya, tersedia perlengkapan snorkeling sesuai paket yang dipilih." },
    { q: "Apakah bisa private trip?", a: "Bisa. Jadwal dan rute dapat disesuaikan dengan kebutuhan peserta." },
    { q: "Apakah trip aman untuk pemula?", a: "Ya. Peserta akan didampingi oleh guide lokal dan menggunakan perlengkapan keselamatan." },
    { q: "Bagaimana cara booking?", a: "Booking dapat dilakukan langsung melalui WhatsApp dengan mengisi nama, tanggal trip, jumlah peserta, dan jenis paket." }
  ]
};

async function setup() {
  console.log("🚀 Setup Supabase PostgreSQL untuk Balincah Trip Manado\n");
  console.log(`   DB URL: ${dbUrl.replace(/:[^:@]+@/, ':***@')}\n`);

  const sql = postgres(dbUrl, { ssl: "require", max: 1 });

  try {
    // Step 1: Create table
    console.log("1️⃣  Membuat tabel 'configurations'...");
    await sql`
      create table if not exists public.configurations (
        id uuid default gen_random_uuid() primary key,
        key text unique not null,
        content jsonb not null,
        updated_at timestamp with time zone default timezone('utc'::text, now()) not null
      )
    `;
    console.log("   ✅ Tabel berhasil dibuat / sudah ada\n");

    // Step 2: Enable RLS
    console.log("2️⃣  Mengaktifkan Row Level Security...");
    await sql`alter table public.configurations enable row level security`;
    console.log("   ✅ RLS aktif\n");

    // Step 3: Create policies (ignore if already exists)
    console.log("3️⃣  Membuat RLS policies...");
    try {
      await sql`
        create policy "Allow public select configurations"
        on public.configurations for select using (true)
      `;
    } catch { /* already exists */ }
    try {
      await sql`
        create policy "Allow service_role write configurations"
        on public.configurations for all using (true) with check (true)
      `;
    } catch { /* already exists */ }
    console.log("   ✅ Policies berhasil dibuat\n");

    // Step 4: Upsert content
    console.log("4️⃣  Menyimpan data konten ke Supabase...");
    await sql`
      insert into public.configurations (key, content, updated_at)
      values ('balincah_content', ${JSON.stringify(defaultContent)}::jsonb, now())
      on conflict (key) do update
      set content = excluded.content, updated_at = excluded.updated_at
    `;
    console.log("   ✅ Data berhasil disimpan!\n");

    // Step 5: Verify
    console.log("5️⃣  Verifikasi data...");
    const result = await sql`
      select key, updated_at, 
             jsonb_array_length(content->'packages') as package_count,
             jsonb_array_length(content->'gallery') as gallery_count
      from public.configurations 
      where key = 'balincah_content'
    `;
    const row = result[0];
    console.log(`   ✅ Terverifikasi!`);
    console.log(`      - key: ${row.key}`);
    console.log(`      - packages: ${row.package_count} item`);
    console.log(`      - gallery: ${row.gallery_count} item`);
    console.log(`      - updated_at: ${row.updated_at}\n`);

    console.log("═".repeat(60));
    console.log("🎉 Setup selesai! Semua data tersimpan di Supabase.");
    console.log("   Admin panel sekarang akan otomatis save/load dari Supabase.");
    console.log("═".repeat(60));

  } catch (err) {
    console.error("❌ Error:", err.message || err);
  } finally {
    await sql.end();
  }
}

setup();
