<script setup lang="ts">
import type { SiteContent } from "~/composables/useContent";

const { data } = await useContent();
const content = computed<SiteContent>(() => data.value || {});

const waNumber = computed(() => String(content.value.whatsappE164 || "6281245474575").replace(/[^\d]/g, ""));
const waBase = computed(() => `https://wa.me/${waNumber.value}`);

function buildWaMessage(paket: string) {
  const lines = [
    "Halo Balincah Trip Manado, saya ingin booking trip.",
    "",
    "Nama: -",
    "Tanggal Trip: -",
    "Jumlah Peserta: -",
    `Paket: ${paket || "-"}`,
    "Catatan: -",
    "",
    "Mohon info ketersediaan dan detail harganya. Terima kasih.",
  ];
  return encodeURIComponent(lines.join("\n"));
}

const route = useRoute();
const q = ref(String(route.query.q || ""));
const type = ref(String(route.query.type || "all"));
const sort = ref(String(route.query.sort || "featured"));

watch([q, type, sort], () => {
  const query: Record<string, string> = {};
  if (q.value.trim()) query.q = q.value.trim();
  if (type.value !== "all") query.type = type.value;
  if (sort.value !== "featured") query.sort = sort.value;
  navigateTo({ path: "/tours", query }, { replace: true });
});

const packages = computed(() => content.value.packages || []);

const filtered = computed(() => {
  let rows = [...packages.value];
  const qq = q.value.trim().toLowerCase();
  if (qq) {
    rows = rows.filter((p) => `${p.name || ""} ${p.desc || ""}`.toLowerCase().includes(qq));
  }
  if (type.value !== "all") {
    rows = rows.filter((p) => (p.type || "other") === type.value);
  }

  if (sort.value === "name") {
    rows.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
  } else if (sort.value === "rating") {
    rows.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    // featured first (default)
    rows.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }
  return rows;
});

useHead(() => ({
  title: `Tour List | ${content.value.siteName || "Balincah Trip Manado"}`,
  meta: [
    {
      name: "description",
      content: "Daftar paket tour: open trip, private trip, snorkeling, diving, dan boat charter.",
    },
  ],
}));
</script>

<template>
  <div>
    <!-- Page header -->
    <section class="relative overflow-hidden border-b border-navy/10 bg-navy/5 py-14">
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(800px_520px_at_20%_20%,rgba(0,174,239,0.25),transparent_60%),radial-gradient(700px_460px_at_70%_10%,rgba(255,212,59,0.18),transparent_60%)]"></div>
      <div class="mx-auto w-full max-w-6xl px-5">
        <div class="text-[12px] font-extrabold tracking-wide text-ocean" data-aos="fade-up">TOUR LIST</div>
        <h1 class="mt-2 font-display text-[34px] font-extrabold tracking-[-0.02em] md:text-[44px]" data-aos="fade-up" data-aos-delay="80">
          Tour Listing
        </h1>
        <div class="mt-3 text-[13px] font-semibold text-black/60" data-aos="fade-up" data-aos-delay="140">
          <NuxtLink class="hover:underline" to="/">Home</NuxtLink>
          <span class="mx-2 text-black/35">/</span>
          <span class="text-black/75">Tours</span>
        </div>
      </div>
    </section>

    <section class="py-14">
      <div class="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-5 lg:grid-cols-[320px_1fr]">
        <!-- Filters (left) -->
        <aside class="rounded-3xl border border-navy/10 bg-white/80 p-5 shadow-soft" data-aos="fade-up">
          <div class="font-display text-[18px] font-extrabold">Filter Tours</div>
          <div class="mt-4 grid gap-3">
            <div class="grid gap-2">
              <label class="text-[12px] font-extrabold text-black/70">Cari</label>
              <input
                v-model="q"
                class="rounded-2xl border border-navy/10 bg-white px-4 py-3 text-[14px] font-semibold outline-none focus:ring-4 focus:ring-ocean/15"
                placeholder="contoh: bunaken, snorkeling..."
              />
            </div>

            <div class="grid gap-2">
              <label class="text-[12px] font-extrabold text-black/70">Tipe</label>
              <select
                v-model="type"
                class="rounded-2xl border border-navy/10 bg-white px-4 py-3 text-[14px] font-semibold outline-none focus:ring-4 focus:ring-ocean/15"
              >
                <option value="all">Semua</option>
                <option value="open_trip">Open Trip</option>
                <option value="private_trip">Private Trip</option>
                <option value="charter">Boat Charter</option>
                <option value="snorkeling">Snorkeling</option>
                <option value="diving">Diving</option>
                <option value="island_hopping">Island Hopping</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div class="grid gap-2">
              <label class="text-[12px] font-extrabold text-black/70">Urutkan</label>
              <select
                v-model="sort"
                class="rounded-2xl border border-navy/10 bg-white px-4 py-3 text-[14px] font-semibold outline-none focus:ring-4 focus:ring-ocean/15"
              >
                <option value="featured">Featured</option>
                <option value="rating">Rating</option>
                <option value="name">Nama</option>
              </select>
            </div>

            <div class="rounded-2xl border border-navy/10 bg-sand/60 p-4 text-[12px] font-semibold text-black/65">
              <div class="font-extrabold text-black/70">Butuh bantuan?</div>
              <div class="mt-1 leading-6">Chat WhatsApp untuk rekomendasi paket terbaik sesuai tanggal & jumlah peserta.</div>
              <a
                class="mt-3 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-b from-[#FFE382] to-yellow px-4 py-2 text-[13px] font-extrabold text-navy"
                :href="`${waBase}?text=${buildWaMessage('Konsultasi paket')}`"
                target="_blank"
                rel="noreferrer"
              >
                Konsultasi WhatsApp
              </a>
            </div>
          </div>
        </aside>

        <!-- List (right) -->
        <div>
          <div class="flex items-center justify-between gap-4">
            <div class="text-[13px] font-semibold text-black/60" data-aos="fade-up">
              Menampilkan <span class="font-extrabold text-black/80">{{ filtered.length }}</span> paket
            </div>
            <NuxtLink
              class="hidden rounded-full border border-navy/10 bg-white px-4 py-2 text-[13px] font-extrabold text-black/70 hover:bg-sand md:inline-flex"
              to="/#booking"
              data-aos="fade-up"
            >
              Ke Booking Form
            </NuxtLink>
          </div>

          <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="(p, i) in filtered"
              :key="i"
              class="group overflow-hidden rounded-3xl border border-navy/10 bg-white/85 shadow-soft"
              data-aos="fade-up"
              :data-aos-delay="(i % 6) * 60"
            >
              <div class="relative">
                <img
                  class="h-44 w-full object-cover"
                  :src="p.image || `/gotur/blog-${(i % 6) + 1}-343x241.jpg`"
                  :alt="p.name || 'Tour'"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-navy/45 via-navy/10 to-transparent"></div>
                <div class="absolute left-4 top-4 flex items-center gap-2">
                  <span
                    v-if="p.featured"
                    class="rounded-full bg-yellow px-3 py-1 text-[11px] font-extrabold text-navy"
                  >
                    Featured
                  </span>
                  <span class="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-extrabold text-white">
                    {{ (p.type || "other").replaceAll("_", " ") }}
                  </span>
                </div>
              </div>

              <div class="p-5">
                <div class="flex items-center gap-2 text-[12px] font-extrabold text-black/60">
                  <span>★</span>
                  <span>{{ (p.rating || 4.8).toFixed(1) }}</span>
                  <span class="text-black/35">•</span>
                  <span>{{ p.duration || "1 Day" }}</span>
                </div>

                <h3 class="mt-2 font-display text-[18px] font-extrabold leading-snug">
                  {{ p.name }}
                </h3>
                <p class="mt-2 line-clamp-2 text-[13px] font-semibold leading-6 text-black/65">
                  {{ p.desc }}
                </p>

                <div class="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <div class="text-[11px] font-extrabold text-black/45">Mulai dari</div>
                    <div class="font-display text-[18px] font-extrabold text-black/85">
                      Rp {{ (p.priceFrom || 350000).toLocaleString("id-ID") }}
                    </div>
                  </div>
                  <a
                    class="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#FFE382] to-yellow px-4 py-2 text-[13px] font-extrabold text-navy"
                    :href="`${waBase}?text=${buildWaMessage(p.name || '')}`"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Booking
                  </a>
                </div>
              </div>
            </article>
          </div>

          <div v-if="filtered.length === 0" class="mt-10 rounded-3xl border border-navy/10 bg-white/80 p-6 text-center shadow-soft">
            <div class="font-display text-[18px] font-extrabold">Tidak ada hasil</div>
            <p class="mt-2 text-[13px] font-semibold text-black/60">Coba ubah keyword atau pilih tipe lain.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

