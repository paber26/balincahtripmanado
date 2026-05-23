<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Content = {
  siteName?: string;
  tagline?: string;
  whatsappE164?: string;
  instagramHandle?: string;
  location?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutText?: string;
  packages?: { name?: string; desc?: string; facilities?: string[] }[];
  destinations?: { name?: string; desc?: string }[];
  gallery?: { title?: string; desc?: string }[];
  itinerary?: { time?: string; text?: string }[];
  reasons?: string[];
  testimonials?: { quote?: string; by?: string }[];
  faqs?: { q?: string; a?: string }[];
};

const config = useRuntimeConfig();
const { data } = await useFetch<Content>(config.public.contentUrl, { default: () => ({}) });
const content = computed(() => data.value || {});

const waNumber = computed(() => String(content.value.whatsappE164 || "6281245474575").replace(/[^\d]/g, ""));
const igHandle = computed(() => String(content.value.instagramHandle || "balincahtripmanado").replace(/^@/, ""));
const waBase = computed(() => `https://wa.me/${waNumber.value}`);
const igUrl = computed(() => `https://www.instagram.com/${igHandle.value}/`);

function buildWaMessage(params: { paket?: string; tanggal?: string; jumlah?: string; catatan?: string }) {
  const lines = [
    "Halo Balincah Trip Manado, saya ingin booking trip.",
    "",
    `Nama: -`,
    `Tanggal Trip: ${params.tanggal || "-"}`,
    `Jumlah Peserta: ${params.jumlah || "-"}`,
    `Paket: ${params.paket || "-"}`,
    `Catatan: ${params.catatan || "-"}`,
    "",
    "Mohon info ketersediaan dan detail harganya. Terima kasih.",
  ];
  return encodeURIComponent(lines.join("\n"));
}

const form = reactive({
  paket: "",
  tanggal: "",
  jumlah: "1",
  catatan: "",
});

watchEffect(() => {
  if (!form.paket) form.paket = content.value.packages?.[0]?.name || "Open Trip Bunaken";
});

const waLink = computed(() => `${waBase.value}?text=${buildWaMessage(form)}`);

const gallerySlides = computed(() => (content.value.gallery || []).slice(0, 9));
const testimonials = computed(() => (content.value.testimonials || []).slice(0, 8));

const itinerary = computed(() => (content.value.itinerary || []).slice(0, 10));
const reasons = computed(() => (content.value.reasons || []).slice(0, 8));

const heroImages = [
  { src: "/gotur/hero-1-1-image.jpg", alt: "Bunaken trip 1" },
  { src: "/gotur/hero-1-2-image.jpg", alt: "Bunaken trip 2" },
  { src: "/gotur/hero-1-3-image.jpg", alt: "Bunaken trip 3" },
];

const destinationImages = [
  "/gotur/destination-slider-1-2-268x391.jpg",
  "/gotur/destination-slider-1-3-268x391.jpg",
  "/gotur/hero-1-2-image.jpg",
  "/gotur/hero-1-1-image.jpg",
];

useHead(() => ({
  title: content.value.siteName || "Balincah Trip Manado",
  meta: [
    {
      name: "description",
      content:
        `${content.value.siteName || "Balincah Trip Manado"} — ${content.value.tagline || "Explore Bunaken, Feel the Ocean Experience"}. Booking mudah via WhatsApp.`,
    },
  ],
}));
</script>

<template>
  <div>
    <!-- Hero (Gotur-like: slider + search card) -->
    <section id="top" class="relative overflow-hidden py-12">
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(800px_520px_at_20%_20%,rgba(0,174,239,0.35),transparent_60%),radial-gradient(700px_460px_at_70%_10%,rgba(255,212,59,0.22),transparent_60%),linear-gradient(140deg,rgba(6,40,61,0.08),rgba(0,174,239,0.05))]"></div>
      <img class="pointer-events-none absolute -right-10 top-14 hidden w-[360px] opacity-90 md:block" src="/gotur/hero-shapr-1-3.png" alt="" aria-hidden="true" />
      <img class="pointer-events-none absolute right-32 top-24 hidden w-[120px] opacity-80 md:block" src="/gotur/hero-shapr-1-2-2.png" alt="" aria-hidden="true" />
      <img class="pointer-events-none absolute right-10 top-56 hidden w-[90px] opacity-80 md:block" src="/gotur/hero-shapr-1-2-1.png" alt="" aria-hidden="true" />

      <div class="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-8 px-5 md:grid-cols-2">
        <div class="pt-2">
          <div class="inline-flex rounded-full border border-navy/10 bg-white/60 px-3 py-2 text-[12px] font-bold text-black/80" data-aos="fade-up">
            {{ content.tagline || "Explore Bunaken, Feel the Ocean Experience" }}
          </div>
          <h1 class="mt-4 font-display text-[38px] font-extrabold leading-[1.05] tracking-[-0.02em] md:text-[54px]" data-aos="fade-up" data-aos-delay="80">
            {{ content.heroTitle || "Explore Bunaken with Balincah Trip" }}
          </h1>
          <p class="mt-3 text-[16px] leading-7 text-black/70" data-aos="fade-up" data-aos-delay="140">
            {{ content.heroSubtitle || "Open Trip, Private Trip, Snorkeling, Diving, dan Boat Charter Bunaken" }}
          </p>

          <div class="mt-5 flex flex-wrap gap-3" data-aos="fade-up" data-aos-delay="220">
            <a
              class="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#FFE382] to-yellow px-5 py-3 text-[14px] font-extrabold text-navy shadow-[0_18px_45px_rgba(255,212,59,0.35)]"
              :href="waLink"
              target="_blank"
              rel="noreferrer"
            >
              Booking via WhatsApp
            </a>
            <a class="inline-flex items-center justify-center rounded-full border border-navy/10 bg-white/70 px-5 py-3 text-[14px] font-extrabold text-black/80 hover:bg-white" href="#paket">
              Lihat Paket
            </a>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3" data-aos="fade-up" data-aos-delay="280">
            <div class="rounded-2xl border border-navy/10 bg-white/60 p-3">
              <div class="text-[12px] font-extrabold text-black/60">Destinasi</div>
              <div class="mt-1 text-[13px] font-extrabold">Bunaken • Nain • Siladen</div>
            </div>
            <div class="rounded-2xl border border-navy/10 bg-white/60 p-3">
              <div class="text-[12px] font-extrabold text-black/60">Aktivitas</div>
              <div class="mt-1 text-[13px] font-extrabold">Snorkeling • Diving</div>
            </div>
            <div class="rounded-2xl border border-navy/10 bg-white/60 p-3">
              <div class="text-[12px] font-extrabold text-black/60">Booking</div>
              <div class="mt-1 text-[13px] font-extrabold">Cepat via WhatsApp</div>
            </div>
          </div>
        </div>

        <div class="flex items-stretch" data-aos="fade-left">
          <div class="relative w-full overflow-hidden rounded-3xl border border-navy/10 bg-white/80 shadow-soft">
            <ClientOnly>
              <div class="absolute inset-0 -z-10 opacity-[0.18]">
                <Swiper :modules="[Autoplay]" :slides-per-view="1" :loop="true" :autoplay="{ delay: 2600, disableOnInteraction: false }">
                  <SwiperSlide v-for="(img, i) in heroImages" :key="i">
                    <div class="h-full w-full">
                      <img :src="img.src" :alt="img.alt" class="h-full w-full object-cover" />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </ClientOnly>
            <div class="p-5 pb-2">
              <div class="font-display text-[18px] font-extrabold">Cari Trip</div>
              <div class="mt-1 text-[12px] font-semibold text-black/60">Pilih paket, tanggal, dan jumlah peserta.</div>
            </div>

            <div class="px-5 pb-5">
              <form class="grid gap-3" @submit.prevent="() => $router.push('#booking')">
                <div class="grid gap-2">
                  <label class="text-[12px] font-extrabold text-black/70">Paket</label>
                  <select v-model="form.paket" class="rounded-2xl border border-navy/10 bg-white px-4 py-3 text-[14px] font-semibold outline-none focus:ring-4 focus:ring-ocean/15">
                    <option v-for="(p, i) in content.packages || []" :key="i" :value="p.name || ''">
                      {{ p.name }}
                    </option>
                  </select>
                </div>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div class="grid gap-2">
                    <label class="text-[12px] font-extrabold text-black/70">Tanggal</label>
                    <input v-model="form.tanggal" type="date" class="rounded-2xl border border-navy/10 bg-white px-4 py-3 text-[14px] font-semibold outline-none focus:ring-4 focus:ring-ocean/15" />
                  </div>
                  <div class="grid gap-2">
                    <label class="text-[12px] font-extrabold text-black/70">Peserta</label>
                    <input v-model="form.jumlah" type="number" min="1" class="rounded-2xl border border-navy/10 bg-white px-4 py-3 text-[14px] font-semibold outline-none focus:ring-4 focus:ring-ocean/15" />
                  </div>
                </div>
                <div class="grid gap-2">
                  <label class="text-[12px] font-extrabold text-black/70">Catatan</label>
                  <input v-model="form.catatan" class="rounded-2xl border border-navy/10 bg-white px-4 py-3 text-[14px] font-semibold outline-none focus:ring-4 focus:ring-ocean/15" placeholder="contoh: bawa anak, request dokumentasi" />
                </div>
                <a
                  class="mt-1 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#FFE382] to-yellow px-5 py-3 text-[14px] font-extrabold text-navy shadow-[0_18px_45px_rgba(255,212,59,0.35)]"
                  :href="waLink"
                  target="_blank"
                  rel="noreferrer"
                >
                  Lanjut Booking
                </a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular tours (Swiper) -->
    <section id="paket" class="py-14">
      <div class="mx-auto w-full max-w-6xl px-5">
        <div class="flex items-end justify-between gap-6">
          <div>
            <div class="text-[12px] font-extrabold tracking-wide text-ocean">POPULAR TOURS</div>
            <h2 class="mt-2 font-display text-[28px] font-extrabold">Paket Wisata Pilihan</h2>
            <p class="mt-2 max-w-2xl text-[14px] leading-6 text-black/65">
              Pilih trip sesuai gaya liburanmu: gabung open trip atau ambil private trip yang lebih fleksibel.
            </p>
          </div>
          <div class="hidden gap-2 md:flex">
            <button class="rounded-2xl border border-navy/10 bg-white px-4 py-2 text-[13px] font-extrabold text-black/70 hover:bg-sand" type="button">
              Prev
            </button>
            <button class="rounded-2xl border border-navy/10 bg-white px-4 py-2 text-[13px] font-extrabold text-black/70 hover:bg-sand" type="button">
              Next
            </button>
          </div>
        </div>

        <ClientOnly>
          <div class="mt-7" data-aos="fade-up">
            <Swiper
              :modules="[Autoplay, Pagination, Navigation]"
              :slides-per-view="1"
              :space-between="16"
              :pagination="{ clickable: true }"
              :autoplay="{ delay: 3500, disableOnInteraction: false }"
              :breakpoints="{
                640: { slidesPerView: 2, spaceBetween: 16 },
                1024: { slidesPerView: 3, spaceBetween: 18 }
              }"
            >
              <SwiperSlide v-for="(p, i) in content.packages || []" :key="i">
                <div class="group h-full overflow-hidden rounded-3xl border border-navy/10 bg-white/80 shadow-soft">
                  <div class="h-40 w-full bg-[radial-gradient(260px_160px_at_40%_30%,rgba(0,174,239,0.45),transparent_62%),radial-gradient(260px_160px_at_70%_60%,rgba(255,212,59,0.22),transparent_62%),linear-gradient(140deg,rgba(6,40,61,0.05),rgba(0,174,239,0.10))]"></div>
                  <div class="p-5">
                    <div class="flex flex-wrap gap-2 text-[12px] font-extrabold text-black/60">
                      <span class="rounded-full border border-navy/10 bg-white px-3 py-1">Bunaken</span>
                      <span class="rounded-full border border-navy/10 bg-white px-3 py-1">{{ (p.name || "").includes("3 Pulau") ? "Island Hopping" : "One Day Trip" }}</span>
                    </div>
                    <div class="mt-3 font-display text-[18px] font-extrabold leading-snug">{{ p.name }}</div>
                    <p class="mt-2 text-[13px] leading-6 text-black/65">{{ p.desc }}</p>
                    <ul class="mt-3 list-disc pl-5 text-[13px] font-semibold text-black/70">
                      <li v-for="(f, j) in (p.facilities || []).slice(0, 4)" :key="j">{{ f }}</li>
                    </ul>
                    <div class="mt-4 flex flex-wrap gap-2">
                      <a class="inline-flex rounded-full bg-yellow px-4 py-2 text-[13px] font-extrabold text-navy" :href="`${waBase}?text=${buildWaMessage({ paket: p.name })}`" target="_blank" rel="noreferrer">
                        Booking
                      </a>
                      <a class="inline-flex rounded-full border border-navy/10 bg-white px-4 py-2 text-[13px] font-extrabold text-black/70 hover:bg-sand" href="#booking">
                        Isi Form
                      </a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </ClientOnly>
      </div>
    </section>

    <!-- Destinations -->
    <section id="destinasi" class="bg-ocean/5 py-14">
      <div class="mx-auto w-full max-w-6xl px-5">
        <div class="text-[12px] font-extrabold tracking-wide text-ocean">DESTINATIONS</div>
        <h2 class="mt-2 font-display text-[28px] font-extrabold">Destinasi Unggulan</h2>
        <p class="mt-2 max-w-2xl text-[14px] leading-6 text-black/65">Bunaken, Nain, dan Siladen — plus spot underwater dan pasir putih.</p>

        <div class="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" data-aos="fade-up">
          <div v-for="(d, i) in content.destinations || []" :key="i" class="overflow-hidden rounded-3xl border border-navy/10 bg-white/80 shadow-soft">
            <div class="relative h-44 w-full">
              <img class="h-full w-full object-cover" :src="destinationImages[i % destinationImages.length]" :alt="d.name || 'Destination'" />
              <div class="absolute inset-0 bg-gradient-to-t from-navy/50 via-navy/10 to-transparent"></div>
            </div>
            <div class="p-4">
              <div class="font-display text-[16px] font-extrabold">{{ d.name }}</div>
              <p class="mt-1 text-[13px] leading-6 text-black/65">{{ d.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About / Why us (Gotur-like about block) -->
    <section class="py-14">
      <div class="mx-auto w-full max-w-6xl px-5">
        <div class="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div class="relative" data-aos="fade-right">
            <div class="aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-navy/10 shadow-soft">
              <img src="/gotur/about-2-1.jpg" alt="About" class="h-full w-full object-cover" />
            </div>
            <div class="absolute -bottom-5 -right-3 w-[62%] overflow-hidden rounded-[26px] border border-navy/10 bg-white/85 p-4 shadow-soft">
              <div class="text-[12px] font-extrabold text-black/60">Highlight</div>
              <div class="mt-1 font-display text-[18px] font-extrabold">Local Expert</div>
              <div class="mt-1 text-[13px] font-semibold leading-6 text-black/65">
                Guide lokal + itinerary fleksibel + dokumentasi momen.
              </div>
            </div>
            <img src="/gotur/about-s-2-1.jpg" alt="" aria-hidden="true" class="absolute -left-4 bottom-10 hidden w-[42%] rounded-[26px] border border-navy/10 shadow-soft md:block" />
          </div>

          <div data-aos="fade-up">
            <div class="text-[12px] font-extrabold tracking-wide text-ocean">ABOUT US</div>
            <h2 class="mt-2 font-display text-[28px] font-extrabold">Trip bahari yang nyaman dan tanpa ribet</h2>
            <p class="mt-3 whitespace-pre-line text-[14px] leading-7 text-black/65">
              {{ content.aboutText }}
            </p>

            <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div v-for="(r, i) in reasons" :key="i" class="rounded-2xl border border-navy/10 bg-white/80 p-3 shadow-[0_14px_35px_rgba(6,40,61,0.10)]">
                <div class="text-[13px] font-extrabold text-black/80">{{ r }}</div>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap gap-3">
              <a
                class="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#FFE382] to-yellow px-5 py-3 text-[14px] font-extrabold text-navy shadow-[0_18px_45px_rgba(255,212,59,0.35)]"
                :href="waLink"
                target="_blank"
                rel="noreferrer"
              >
                Konsultasi Trip
              </a>
              <a class="inline-flex items-center justify-center rounded-full border border-navy/10 bg-white px-5 py-3 text-[14px] font-extrabold text-black/75 hover:bg-sand" href="#itinerary">
                Lihat Itinerary
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Itinerary (timeline) -->
    <section id="itinerary" class="bg-navy/5 py-14">
      <div class="mx-auto w-full max-w-6xl px-5">
        <div class="text-[12px] font-extrabold tracking-wide text-ocean">ITINERARY</div>
        <h2 class="mt-2 font-display text-[28px] font-extrabold">Contoh itinerary Open Trip Bunaken</h2>
        <p class="mt-2 max-w-2xl text-[14px] leading-6 text-black/65">Jadwal bisa berubah sesuai cuaca & kondisi lapangan.</p>

        <div class="mt-7 overflow-hidden rounded-3xl border border-navy/10 bg-white/85 p-4 shadow-soft" data-aos="fade-up">
          <div class="grid gap-2">
            <div
              v-for="(it, i) in itinerary"
              :key="i"
              class="grid grid-cols-[84px_1fr] items-center gap-3 rounded-2xl px-3 py-3"
              :class="i % 2 === 0 ? 'bg-ocean/5' : ''"
            >
              <div class="text-[12px] font-extrabold text-black/65">{{ it.time }}</div>
              <div class="text-[13px] font-extrabold text-black/80">{{ it.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery (Swiper like showcase) -->
    <section id="galeri" class="py-14">
      <div class="mx-auto w-full max-w-6xl px-5">
        <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div class="text-[12px] font-extrabold tracking-wide text-ocean">GALLERY</div>
            <h2 class="mt-2 font-display text-[28px] font-extrabold">Momen Trip</h2>
            <p class="mt-2 max-w-2xl text-[14px] leading-6 text-black/65">
              Foto drone, underwater, peserta trip, kapal, dan spot pasir putih. (Placeholder — bisa diganti aset asli.)
            </p>
          </div>
          <a class="inline-flex w-fit rounded-full border border-navy/10 bg-white px-4 py-2 text-[13px] font-extrabold text-black/70 hover:bg-sand" :href="igUrl" target="_blank" rel="noreferrer">
            Lihat Instagram
          </a>
        </div>

        <ClientOnly>
          <div class="mt-7" data-aos="fade-up">
            <Swiper
              :modules="[Autoplay, Pagination]"
              :slides-per-view="1"
              :space-between="16"
              :pagination="{ clickable: true }"
              :autoplay="{ delay: 2800, disableOnInteraction: false }"
              :breakpoints="{
                640: { slidesPerView: 2, spaceBetween: 16 },
                1024: { slidesPerView: 3, spaceBetween: 18 }
              }"
            >
              <SwiperSlide v-for="(g, i) in gallerySlides" :key="i">
                <div class="group overflow-hidden rounded-3xl border border-navy/10 bg-white/80 shadow-soft">
                  <div class="relative h-56 w-full overflow-hidden">
                    <img v-if="g.image" :src="g.image" :alt="g.title || 'Momen Trip'" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div v-else class="h-full w-full bg-[radial-gradient(260px_180px_at_40%_30%,rgba(0,174,239,0.45),transparent_62%),radial-gradient(260px_180px_at_70%_60%,rgba(255,212,59,0.22),transparent_62%),linear-gradient(140deg,rgba(6,40,61,0.05),rgba(0,174,239,0.10))]"></div>
                  </div>
                  <div class="p-4">
                    <div class="font-display text-[16px] font-extrabold">{{ g.title }}</div>
                    <p class="mt-1 text-[13px] leading-6 text-black/65">{{ g.desc }}</p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </ClientOnly>
      </div>
    </section>

    <!-- Testimonials (Swiper) -->
    <section class="bg-ocean/5 py-14">
      <div class="mx-auto w-full max-w-6xl px-5">
        <div class="text-[12px] font-extrabold tracking-wide text-ocean">TESTIMONIALS</div>
        <h2 class="mt-2 font-display text-[28px] font-extrabold">Apa kata pelanggan</h2>
        <p class="mt-2 max-w-2xl text-[14px] leading-6 text-black/65">Beberapa testimoni singkat (bisa diganti dari admin).</p>

        <ClientOnly>
          <div class="mt-7" data-aos="fade-up">
            <Swiper
              :modules="[Autoplay, Pagination]"
              :slides-per-view="1"
              :space-between="16"
              :pagination="{ clickable: true }"
              :autoplay="{ delay: 4200, disableOnInteraction: false }"
              :breakpoints="{
                768: { slidesPerView: 2, spaceBetween: 16 },
                1024: { slidesPerView: 3, spaceBetween: 18 }
              }"
            >
              <SwiperSlide v-for="(t, i) in testimonials" :key="i">
                <figure class="h-full rounded-3xl border border-navy/10 bg-white/85 p-5 shadow-soft">
                  <blockquote class="text-[14px] font-semibold leading-7 text-black/75">
                    “{{ t.quote }}”
                  </blockquote>
                  <figcaption class="mt-4 text-[12px] font-extrabold text-black/60">— {{ t.by }}</figcaption>
                </figure>
              </SwiperSlide>
            </Swiper>
          </div>
        </ClientOnly>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="py-14">
      <div class="mx-auto w-full max-w-6xl px-5">
        <div class="text-[12px] font-extrabold tracking-wide text-ocean">FAQ</div>
        <h2 class="mt-2 font-display text-[28px] font-extrabold">Pertanyaan yang sering diajukan</h2>
        <div class="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          <details
            v-for="(f, i) in content.faqs || []"
            :key="i"
            class="group rounded-3xl border border-navy/10 bg-white/80 p-4 shadow-soft"
            data-aos="fade-up"
          >
            <summary class="cursor-pointer list-none font-extrabold text-black/85">
              <div class="flex items-center justify-between gap-3">
                <span>{{ f.q }}</span>
                <span class="text-ocean transition group-open:rotate-45">+</span>
              </div>
            </summary>
            <p class="mt-3 text-[13px] leading-6 text-black/65">{{ f.a }}</p>
          </details>
        </div>
      </div>
    </section>

    <!-- Booking -->
    <section id="booking" class="bg-navy/5 py-14">
      <div class="mx-auto w-full max-w-6xl px-5">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div class="text-[12px] font-extrabold tracking-wide text-ocean">BOOKING</div>
            <h2 class="mt-2 font-display text-[28px] font-extrabold">Booking via WhatsApp</h2>
            <p class="mt-2 text-[14px] leading-6 text-black/65">
              Klik tombol booking untuk otomatis mengirim format pesan. Untuk form lengkap + payment gateway, bisa ditambah tahap berikutnya.
            </p>
            <div class="mt-5 rounded-3xl border border-navy/10 bg-white/80 p-4 shadow-soft">
              <div class="text-[12px] font-extrabold text-black/60">WhatsApp</div>
              <a class="mt-1 block font-extrabold text-black/80 underline decoration-ocean/20 underline-offset-4" :href="waBase" target="_blank" rel="noreferrer">
                {{ content.whatsappE164 || "6281245474575" }}
              </a>
              <div class="mt-4 text-[12px] font-extrabold text-black/60">Instagram</div>
              <a class="mt-1 block font-extrabold text-black/80 underline decoration-ocean/20 underline-offset-4" :href="igUrl" target="_blank" rel="noreferrer">
                @{{ igHandle }}
              </a>
              <div class="mt-4 text-[12px] font-extrabold text-black/60">Lokasi</div>
              <div class="mt-1 font-semibold text-black/70">{{ content.location }}</div>
            </div>
          </div>

          <div class="rounded-3xl border border-navy/10 bg-white/85 p-5 shadow-soft" data-aos="fade-left">
            <div class="font-display text-[18px] font-extrabold">Form Singkat</div>
            <p class="mt-1 text-[12px] font-semibold text-black/60">Isi untuk menghasilkan link WhatsApp.</p>
            <div class="mt-4 grid gap-3">
              <div class="grid gap-2">
                <label class="text-[12px] font-extrabold text-black/70">Paket</label>
                <select v-model="form.paket" class="rounded-2xl border border-navy/10 bg-white px-4 py-3 text-[14px] font-semibold outline-none focus:ring-4 focus:ring-ocean/15">
                  <option v-for="(p, i) in content.packages || []" :key="i" :value="p.name || ''">
                    {{ p.name }}
                  </option>
                </select>
              </div>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="grid gap-2">
                  <label class="text-[12px] font-extrabold text-black/70">Tanggal</label>
                  <input v-model="form.tanggal" type="date" class="rounded-2xl border border-navy/10 bg-white px-4 py-3 text-[14px] font-semibold outline-none focus:ring-4 focus:ring-ocean/15" />
                </div>
                <div class="grid gap-2">
                  <label class="text-[12px] font-extrabold text-black/70">Peserta</label>
                  <input v-model="form.jumlah" type="number" min="1" class="rounded-2xl border border-navy/10 bg-white px-4 py-3 text-[14px] font-semibold outline-none focus:ring-4 focus:ring-ocean/15" />
                </div>
              </div>
              <div class="grid gap-2">
                <label class="text-[12px] font-extrabold text-black/70">Catatan</label>
                <input v-model="form.catatan" class="rounded-2xl border border-navy/10 bg-white px-4 py-3 text-[14px] font-semibold outline-none focus:ring-4 focus:ring-ocean/15" placeholder="contoh: bawa anak, request dokumentasi" />
              </div>
              <a
                class="mt-1 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#FFE382] to-yellow px-5 py-3 text-[14px] font-extrabold text-navy shadow-[0_18px_45px_rgba(255,212,59,0.35)]"
                :href="waLink"
                target="_blank"
                rel="noreferrer"
              >
                Booking Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="border-t border-navy/10 py-10">
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 md:flex-row md:items-start md:justify-between">
        <div class="max-w-xl">
          <div class="font-display text-[18px] font-extrabold">{{ content.siteName || "Balincah Trip Manado" }}</div>
          <p class="mt-2 text-[13px] leading-6 text-black/65">
            {{ content.tagline || "Explore Bunaken, Feel the Ocean Experience" }} — Open trip, private trip, snorkeling, diving, dan boat charter.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <a class="rounded-full border border-navy/10 bg-white px-4 py-2 text-[13px] font-extrabold text-black/70 hover:bg-sand" href="#paket">Tours</a>
          <a class="rounded-full border border-navy/10 bg-white px-4 py-2 text-[13px] font-extrabold text-black/70 hover:bg-sand" href="#destinasi">Destinations</a>
          <a class="rounded-full border border-navy/10 bg-white px-4 py-2 text-[13px] font-extrabold text-black/70 hover:bg-sand" href="#booking">Booking</a>
          <a class="rounded-full border border-navy/10 bg-white px-4 py-2 text-[13px] font-extrabold text-black/70 hover:bg-sand" :href="igUrl" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </div>
      <div class="mx-auto mt-6 w-full max-w-6xl px-5 text-[12px] font-semibold text-black/55">© {{ new Date().getFullYear() }} Balincah Trip Manado</div>
    </footer>
  </div>
</template>
