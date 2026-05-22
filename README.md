# Balincah Trip Manado

Repo ini berisi:

- **Nuxt 3 landing page** (root project) — UI bergaya travel theme (Gotur-like) menggunakan **Nuxt 3 + Tailwind + AOS + Swiper** dan data dari `public/content/content.json`.
- **Admin static** di `admin/` (legacy) — untuk edit konten + export JSON.
- **Landing static legacy** di `landingpage/` (legacy).

## Requirements

- Node.js **>= 20.19.0** (Nuxt/Nitro terbaru butuh Node 20+)

## Jalankan Nuxt (Landing baru)

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:3000`.

## Konten

- Source konten untuk Nuxt: `public/content/content.json`
- Admin static export JSON sebagai `content.json` → copy/replace ke `public/content/content.json`, lalu commit + push.

