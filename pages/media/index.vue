<script setup lang="ts">
import type { SiteContent } from "~/composables/useContent";

const { data } = await useContent();
const content = computed<SiteContent>(() => data.value || {});

const igHandle = computed(() => String(content.value.instagramHandle || "balincahtripmanado").replace(/^@/, ""));
const igUrl = computed(() => `https://www.instagram.com/${igHandle.value}/`);

const tab = ref<"photos" | "videos">("photos");

const photos = computed(() => content.value.instagram?.photos || []);
const videos = computed(() => content.value.instagram?.videos || []);

const modalOpen = ref(false);
const modalPhoto = ref<{ image: string; postUrl?: string; caption?: string } | null>(null);

function openPhoto(p: { image: string; postUrl?: string; caption?: string }) {
  modalPhoto.value = p;
  modalOpen.value = true;
}
function closeModal() {
  modalOpen.value = false;
  modalPhoto.value = null;
}

useHead(() => ({
  title: `Media | ${content.value.siteName || "Balincah Trip Manado"}`,
  meta: [
    {
      name: "description",
      content: "Foto dan video (reels) untuk menampilkan momen trip agar lebih menarik perhatian.",
    },
  ],
}));
</script>

<template>
  <div>
    <section class="relative overflow-hidden border-b border-navy/10 bg-navy/5 py-14">
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(800px_520px_at_20%_20%,rgba(0,174,239,0.25),transparent_60%),radial-gradient(700px_460px_at_70%_10%,rgba(255,212,59,0.18),transparent_60%)]"></div>
      <div class="mx-auto w-full max-w-6xl px-5">
        <div class="text-[12px] font-extrabold tracking-wide text-ocean" data-aos="fade-up">SOCIAL PROOF</div>
        <h1 class="mt-2 font-display text-[34px] font-extrabold tracking-[-0.02em] md:text-[44px]" data-aos="fade-up" data-aos-delay="80">
          Foto & Video Instagram
        </h1>
        <p class="mt-3 max-w-2xl text-[14px] font-semibold leading-7 text-black/65" data-aos="fade-up" data-aos-delay="140">
          Halaman ini dibuat untuk menarik perhatian pengunjung lewat momen nyata: drone, underwater, peserta trip, dan reels perjalanan.
        </p>
        <div class="mt-5 flex flex-wrap gap-3" data-aos="fade-up" data-aos-delay="200">
          <button
            class="rounded-full px-4 py-2 text-[13px] font-extrabold"
            :class="tab === 'photos' ? 'bg-yellow text-navy' : 'border border-navy/10 bg-white text-black/70 hover:bg-sand'"
            type="button"
            @click="tab = 'photos'"
          >
            Foto
          </button>
          <button
            class="rounded-full px-4 py-2 text-[13px] font-extrabold"
            :class="tab === 'videos' ? 'bg-yellow text-navy' : 'border border-navy/10 bg-white text-black/70 hover:bg-sand'"
            type="button"
            @click="tab = 'videos'"
          >
            Video / Reels
          </button>
          <a class="ml-auto inline-flex rounded-full border border-navy/10 bg-white px-4 py-2 text-[13px] font-extrabold text-black/70 hover:bg-sand" :href="igUrl" target="_blank" rel="noreferrer">
            Buka @{{ igHandle }}
          </a>
        </div>
      </div>
    </section>

    <section class="py-14">
      <div class="mx-auto w-full max-w-6xl px-5">
        <!-- Photos -->
        <div v-if="tab === 'photos'">
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <button
              v-for="(p, i) in photos"
              :key="i"
              class="group relative overflow-hidden rounded-3xl border border-navy/10 bg-white/80 shadow-soft"
              type="button"
              data-aos="fade-up"
              :data-aos-delay="(i % 8) * 40"
              @click="openPhoto(p)"
            >
              <img :src="p.image" :alt="p.caption || 'Instagram photo'" class="h-44 w-full object-cover sm:h-52" />
              <div class="absolute inset-0 bg-gradient-to-t from-navy/50 via-navy/10 to-transparent opacity-0 transition group-hover:opacity-100"></div>
              <div class="absolute bottom-3 left-3 right-3 text-left text-[12px] font-extrabold text-white/95 opacity-0 transition group-hover:opacity-100">
                {{ p.caption || "Lihat detail" }}
              </div>
            </button>
          </div>

          <div v-if="photos.length === 0" class="rounded-3xl border border-navy/10 bg-white/80 p-6 text-center shadow-soft">
            <div class="font-display text-[18px] font-extrabold">Belum ada data foto</div>
            <p class="mt-2 text-[13px] font-semibold text-black/60">
              Tambahkan URL gambar ke `public/content/content.json` → `instagram.photos`.
            </p>
          </div>
        </div>

        <!-- Videos -->
        <div v-else>
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div
              v-for="(v, i) in videos"
              :key="i"
              class="overflow-hidden rounded-3xl border border-navy/10 bg-white/85 shadow-soft"
              data-aos="fade-up"
              :data-aos-delay="(i % 6) * 60"
            >
              <div class="aspect-video w-full bg-black/5">
                <iframe
                  class="h-full w-full"
                  :src="v.embedUrl"
                  title="Instagram video"
                  loading="lazy"
                  allow="autoplay; encrypted-media; picture-in-picture"
                />
              </div>
              <div class="p-4">
                <div class="font-display text-[16px] font-extrabold">{{ v.title || "Reels" }}</div>
                <div class="mt-2 flex gap-2">
                  <a
                    v-if="v.postUrl"
                    class="inline-flex rounded-full border border-navy/10 bg-white px-4 py-2 text-[12px] font-extrabold text-black/70 hover:bg-sand"
                    :href="v.postUrl"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buka Post
                  </a>
                  <a
                    class="inline-flex rounded-full bg-yellow px-4 py-2 text-[12px] font-extrabold text-navy"
                    :href="igUrl"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Follow IG
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div v-if="videos.length === 0" class="rounded-3xl border border-navy/10 bg-white/80 p-6 text-center shadow-soft">
            <div class="font-display text-[18px] font-extrabold">Belum ada data video</div>
            <p class="mt-2 text-[13px] font-semibold text-black/60">
              Tambahkan URL embed ke `public/content/content.json` → `instagram.videos` (pakai format `https://www.instagram.com/reel/.../embed`).
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Simple modal -->
    <Teleport to="body">
      <div v-if="modalOpen" class="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" @click.self="closeModal">
        <div class="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-white/95 shadow-soft">
          <div class="flex items-center justify-between gap-3 border-b border-navy/10 p-4">
            <div class="font-display text-[16px] font-extrabold">Foto</div>
            <button class="rounded-full border border-navy/10 bg-white px-4 py-2 text-[12px] font-extrabold text-black/70 hover:bg-sand" type="button" @click="closeModal">
              Tutup
            </button>
          </div>
          <div v-if="modalPhoto" class="p-4">
            <img :src="modalPhoto.image" :alt="modalPhoto.caption || 'Photo'" class="max-h-[70vh] w-full rounded-3xl object-contain" />
            <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div class="text-[13px] font-semibold text-black/65">
                {{ modalPhoto.caption || "" }}
              </div>
              <a
                v-if="modalPhoto.postUrl"
                class="inline-flex rounded-full bg-yellow px-4 py-2 text-[12px] font-extrabold text-navy"
                :href="modalPhoto.postUrl"
                target="_blank"
                rel="noreferrer"
              >
                Buka di Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

