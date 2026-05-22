<script setup lang="ts">
import type { SiteContent } from "~/composables/useContent";

const { data } = await useContent();
const content = computed<SiteContent>(() => data.value || {});

const waNumber = computed(() => String(content.value.whatsappE164 || "6281245474575").replace(/[^\d]/g, ""));
const igHandle = computed(() => String(content.value.instagramHandle || "balincahtripmanado").replace(/^@/, ""));
const waBase = computed(() => `https://wa.me/${waNumber.value}`);
const igUrl = computed(() => `https://www.instagram.com/${igHandle.value}/`);

const waLink = computed(() => {
  const msg = encodeURIComponent(
    [
      "Halo Balincah Trip Manado, saya ingin booking trip.",
      "",
      "Nama: -",
      "Tanggal Trip: -",
      "Jumlah Peserta: -",
      "Paket: -",
      "Catatan: -",
      "",
      "Mohon info ketersediaan dan detail harganya. Terima kasih.",
    ].join("\n"),
  );
  return `${waBase.value}?text=${msg}`;
});
</script>

<template>
  <!-- Top bar -->
  <div class="bg-navy/90 text-white/90">
    <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-2 text-[12px] font-semibold">
      <div class="flex flex-wrap items-center gap-3">
        <a class="hover:text-white underline-offset-4 hover:underline" :href="waBase" target="_blank" rel="noreferrer">
          WA: {{ content.whatsappE164 || "6281245474575" }}
        </a>
        <span class="text-white/50">•</span>
        <a class="hover:text-white underline-offset-4 hover:underline" :href="igUrl" target="_blank" rel="noreferrer">
          IG: @{{ igHandle }}
        </a>
        <span class="text-white/50">•</span>
        <span class="text-white/80">{{ content.location || "Pantai Liang, Bunaken" }}</span>
      </div>
      <div class="rounded-full border border-yellow/25 bg-yellow/10 px-3 py-1 font-extrabold">
        Open Trip • Private Trip • Charter
      </div>
    </div>
  </div>

  <!-- Header -->
  <header class="sticky top-0 z-40 border-b border-navy/10 bg-white/75 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-3">
      <NuxtLink to="/#top" class="flex items-center gap-3">
        <img src="/logo.png" alt="Balincah Trip Manado" class="h-10 w-10 rounded-2xl object-cover shadow-soft" />
        <div class="leading-tight">
          <div class="font-display text-[14px] font-extrabold">{{ content.siteName || "Balincah Trip Manado" }}</div>
          <div class="text-[12px] font-semibold text-black/60">{{ content.tagline || "Explore Bunaken, Feel the Ocean Experience" }}</div>
        </div>
      </NuxtLink>

      <nav class="ml-auto hidden items-center gap-1 rounded-full border border-navy/10 bg-white/60 px-2 py-2 md:flex">
        <NuxtLink class="rounded-full px-3 py-2 text-[13px] font-semibold text-black/75 hover:bg-ocean/10" to="/tours">Tours</NuxtLink>
        <NuxtLink class="rounded-full px-3 py-2 text-[13px] font-semibold text-black/75 hover:bg-ocean/10" to="/media">Media</NuxtLink>
        <NuxtLink class="rounded-full px-3 py-2 text-[13px] font-semibold text-black/75 hover:bg-ocean/10" to="/#destinasi">Destinations</NuxtLink>
        <NuxtLink class="rounded-full px-3 py-2 text-[13px] font-semibold text-black/75 hover:bg-ocean/10" to="/#faq">FAQ</NuxtLink>
      </nav>

      <a
        class="ml-auto inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#FFE382] to-yellow px-4 py-2 text-[13px] font-extrabold text-navy shadow-[0_18px_45px_rgba(255,212,59,0.35)] md:ml-3"
        :href="waLink"
        target="_blank"
        rel="noreferrer"
      >
        Booking WhatsApp
      </a>
    </div>
  </header>
</template>

