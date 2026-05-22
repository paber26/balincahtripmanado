# Balincah Trip Manado (Prototype)

Prototype website single-page sesuai `Konsep.md` (modern tropical travel) dengan CTA WhatsApp dan form booking yang membuka WhatsApp dengan pesan terformat.

## Sumber konten

Landing page membaca konten dari `content/content.json`.

Mode preview (untuk lihat draft dari Admin):

- Buka `landingpage/index.html?preview=1`
- Dalam mode ini, landing akan mencoba membaca data dari localStorage admin (`balincah_admin_content_v1`)

## Cara menjalankan (lokal)

Opsi paling simpel:

```bash
python3 -m http.server 5173
```

Lalu buka `http://localhost:5173/` dan halaman utama akan memuat `index.html`.

## File utama

- `index.html` — struktur halaman (hero, paket, destinasi, galeri, itinerary, testimoni, FAQ, booking/kontak)
- `styles.css` — styling warna & komponen (ocean/white/yellow), animasi halus, rounded card, floating WhatsApp CTA
- `script.js` — generator link WhatsApp + form booking + modal galeri + menu mobile
