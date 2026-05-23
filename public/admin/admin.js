const STORAGE_KEY = "balincah_admin_content_v1";
const PIN_HASH_KEY = "balincah_admin_pinhash_v1";
const SESSION_KEY = "balincah_admin_authed_v1";

function sha256Hex(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return crypto.subtle.digest("SHA-256", data).then((buf) => {
    const bytes = new Uint8Array(buf);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  });
}

function weakHash(str) {
  // Fallback for non-secure contexts where WebCrypto is unavailable.
  // This is NOT cryptographically secure; only used as a lightweight gate.
  let h = 5381;
  const s = String(str ?? "");
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return `weak:${(h >>> 0).toString(16)}`;
}

function resolveAssetPath(path) {
  if (!path) return "";
  if (path.startsWith("/")) {
    if (window.location.protocol === "file:") {
      return ".." + path;
    }
  }
  return path;
}

async function pinHash(pin) {
  if (globalThis.crypto?.subtle) {
    try {
      return await sha256Hex(pin);
    } catch {
      // continue to fallback
    }
  }
  return weakHash(pin);
}

function $(id) {
  return document.getElementById(id);
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function defaultContent() {
  return {
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
        facilities: ["Kapal wisata", "Guide lokal", "Dokumentasi", "Snorkeling", "Kunjungan pulau", "Life jacket"],
      },
      {
        name: "Private Trip Bunaken",
        desc: "Cocok untuk keluarga, kantor, komunitas, atau rombongan yang ingin perjalanan lebih fleksibel dan eksklusif.",
        facilities: ["Kapal private", "Jadwal fleksibel", "Guide lokal", "Spot foto terbaik", "Snorkeling", "Dokumentasi"],
      },
      {
        name: "Boat Charter Bunaken",
        desc: "Layanan sewa kapal untuk perjalanan wisata, rombongan, atau kebutuhan khusus.",
        facilities: ["Kapal sesuai kapasitas", "Rute sesuai kebutuhan", "Waktu fleksibel", "Cocok untuk rombongan"],
      },
      {
        name: "Snorkeling Trip",
        desc: "Pengalaman menikmati keindahan bawah laut Bunaken dengan ikan warna-warni dan terumbu karang.",
        facilities: ["Spot snorkeling pilihan", "Peralatan snorkeling (sesuai paket)", "Pendampingan guide"],
      },
      {
        name: "Diving Experience",
        desc: "Paket diving untuk menikmati pesona bawah laut Bunaken bersama instruktur profesional.",
        facilities: ["Briefing & safety", "Spot diving unggulan", "Cocok untuk pemula & berpengalaman"],
      },
      {
        name: "Trip 3 Pulau (Bunaken - Nain - Siladen)",
        desc: "Rute wisata ke Bunaken, Nain Island, dan Siladen Island.",
        facilities: ["Island hopping", "Spot pasir putih", "Dokumentasi momen"],
      },
    ],
    destinations: [
      { name: "Bunaken Island", desc: "Ikon wisata bahari Sulawesi Utara dengan pemandangan laut dan terumbu karang." },
      { name: "Nain Island", desc: "Pulau cantik untuk island hopping, spot foto, dan suasana tenang." },
      { name: "Siladen Island", desc: "Pasir putih dan air jernih — cocok untuk santai setelah snorkeling/dive." },
      { name: "Underwater Bunaken", desc: "Spot underwater yang kaya biota laut—pengalaman visual yang sulit dilupakan." },
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
      { title: "Resort Area", desc: "Area dermaga dan resort.", image: "/gotur/blog-5-343x241.jpg" },
    ],
    itinerary: [
      { time: "08.00", text: "Meeting point di Pelabuhan Manado" },
      { time: "08.30", text: "Berangkat menuju Bunaken" },
      { time: "09.30", text: "Tiba di Bunaken dan briefing singkat" },
      { time: "10.00", text: "Snorkeling / diving / foto-foto" },
      { time: "12.00", text: "Istirahat dan makan siang" },
      { time: "13.00", text: "Island hopping / kunjungan spot wisata" },
      { time: "15.00", text: "Perjalanan kembali ke Manado" },
      { time: "16.00", text: "Trip selesai" },
    ],
    reasons: [
      "Berpengalaman melayani wisata Bunaken",
      "Dokumentasi perjalanan menarik",
      "Cocok untuk open trip dan private trip",
      "Pelayanan ramah dan komunikatif",
      "Pilihan paket fleksibel",
      "Booking mudah via WhatsApp",
      "Cocok untuk wisatawan lokal, nasional, dan internasional",
    ],
    testimonials: [
      { quote: "Trip-nya seru, guide ramah, pemandangan Bunaken luar biasa. Sangat recommended!", by: "Customer Open Trip" },
      { quote: "Pelayanan bagus, dokumentasi keren, dan perjalanan sangat menyenangkan.", by: "Customer Private Trip" },
      { quote: "Cocok untuk liburan keluarga dan rombongan kantor.", by: "Customer Rombongan" },
    ],
    faqs: [
      { q: "Apakah bisa booking untuk rombongan?", a: "Bisa. Balincah Trip melayani private trip, rombongan kantor, komunitas, keluarga, dan grup wisata." },
      { q: "Apakah tersedia alat snorkeling?", a: "Ya, tersedia perlengkapan snorkeling sesuai paket yang dipilih." },
      { q: "Apakah bisa private trip?", a: "Bisa. Jadwal dan rute dapat disesuaikan dengan kebutuhan peserta." },
      { q: "Apakah trip aman untuk pemula?", a: "Ya. Peserta akan didampingi oleh guide lokal dan menggunakan perlengkapan keselamatan." },
      { q: "Bagaimana cara booking?", a: "Booking dapat dilakukan langsung melalui WhatsApp dengan mengisi nama, tanggal trip, jumlah peserta, dan jenis paket." },
    ],
  };
}

function loadContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContent();
    const parsed = JSON.parse(raw);
    return { ...defaultContent(), ...parsed };
  } catch {
    return defaultContent();
  }
}

function saveContent(content) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content, null, 2));
}

function encodeWhatsAppMessage(message) {
  return encodeURIComponent(String(message || "").trim());
}

function buildWhatsAppMessage({ nama, tanggal, jumlah, paket, catatan, nomorWa }) {
  const lines = [
    "Halo Balincah Trip Manado, saya ingin booking trip.",
    "",
    `Nama: ${nama || "-"}`,
    nomorWa ? `Nomor WhatsApp: ${nomorWa}` : null,
    `Tanggal Trip: ${tanggal || "-"}`,
    `Jumlah Peserta: ${jumlah || "-"}`,
    `Paket: ${paket || "-"}`,
    `Catatan: ${catatan || "-"}`,
    "",
    "Mohon info ketersediaan dan detail harganya. Terima kasih.",
  ].filter(Boolean);
  return lines.join("\n");
}

function waLinkWithMessage(numberE164, message) {
  return `https://wa.me/${String(numberE164 || "").replace(/[^\d]/g, "")}?text=${encodeWhatsAppMessage(message)}`;
}

function markDirty(state) {
  state.isDirty = true;
  const hint = $("saveHint");
  if (hint) hint.textContent = "Ada perubahan (belum disimpan).";
}

function markClean(state) {
  state.isDirty = false;
  const hint = $("saveHint");
  if (hint) hint.textContent = "Tersimpan di browser.";
}

function setTab(state, tabKey) {
  state.activeTab = tabKey;
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((t) => t.classList.add("is-hidden"));
  const active = $(`tab-${tabKey}`);
  if (active) active.classList.remove("is-hidden");

  const items = document.querySelectorAll(".nav__item");
  items.forEach((b) => {
    b.classList.toggle("is-active", b.getAttribute("data-tab") === tabKey);
  });

  // Handle Accordion expansion
  const accordion = document.getElementById("paketAccordion");
  const accordionMenu = accordion?.querySelector(".nav-accordion-menu");
  if (accordion && accordionMenu) {
    if (tabKey === "paket" || tabKey === "detail-paket") {
      accordionMenu.classList.remove("is-hidden");
      accordion.classList.remove("is-collapsed");
    }
  }

  const titles = {
    dashboard: ["Dashboard", "Ringkasan konten dan quick actions."],
    umum: ["Umum", "Pengaturan identitas dan copy utama."],
    paket: ["Semua Paket", "Daftar paket wisata dan fasilitas."],
    "detail-paket": ["Detail Paket", "Tampilan premium detail paket wisata."],
    destinasi: ["Destinasi", "Kelola destinasi unggulan."],
    galeri: ["Galeri", "Kelola item galeri."],
    itinerary: ["Itinerary", "Kelola jadwal perjalanan."],
    alasan: ["Alasan", "Kelola poin kenapa pilih Balincah."],
    testimoni: ["Testimoni", "Kelola testimonial pelanggan."],
    faq: ["FAQ", "Kelola pertanyaan yang sering diajukan."],
    export: ["Export/Import", "Backup dan pindahkan konten via JSON."],
  };
  const [t, d] = titles[tabKey] || ["Admin", ""];
  const tabTitle = $("tabTitle");
  const tabDesc = $("tabDesc");
  const breadcrumbActive = $("breadcrumbActive");
  if (tabTitle) tabTitle.textContent = t;
  if (tabDesc) tabDesc.textContent = d;
  if (breadcrumbActive) breadcrumbActive.textContent = t;

  const rawJson = $("rawJson");
  if (tabKey === "export" && rawJson) rawJson.value = JSON.stringify(state.content, null, 2);
  if (tabKey === "dashboard") renderDashboard(state);
  if (tabKey === "detail-paket") renderPackageDetailView(state);

  // Trigger rendering of Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function renderDashboard(state) {
  const kpis = $("kpis");
  const statusList = $("statusList");
  if (!kpis || !statusList) return;

  const waOk = /^\d{9,15}$/.test(String(state.content.whatsappE164 || ""));
  const igOk = /^[a-zA-Z0-9._]{2,}$/.test(String(state.content.instagramHandle || ""));

  const items = [
    { k: "Paket", v: state.content.packages?.length ?? 0, hint: "Total paket aktif" },
    { k: "Destinasi", v: state.content.destinations?.length ?? 0, hint: "Destinasi unggulan" },
    { k: "Galeri", v: state.content.gallery?.length ?? 0, hint: "Item galeri" },
    { k: "FAQ", v: state.content.faqs?.length ?? 0, hint: "Pertanyaan & jawaban" },
  ];

  kpis.innerHTML = "";
  items.forEach(({ k, v, hint }) => {
    const el = document.createElement("div");
    el.className = "kpi";
    el.innerHTML = `<div class="kpi__k">${escapeHtml(k)}</div><div class="kpi__v">${escapeHtml(String(v))}</div><div class="kpi__hint">${escapeHtml(hint)}</div>`;
    kpis.appendChild(el);
  });

  statusList.innerHTML = "";
  const statuses = [
    { k: "WhatsApp", v: waOk ? `OK (${state.content.whatsappE164})` : "Periksa format E.164 (contoh: 62812...)" },
    { k: "Instagram", v: igOk ? `OK (@${state.content.instagramHandle})` : "Periksa handle (tanpa @)" },
    { k: "Tagline", v: state.content.tagline ? "OK" : "Kosong" },
    { k: "Tentang Kami", v: (state.content.aboutText || "").trim().length > 30 ? "OK" : "Terlalu pendek/kosong" },
  ];
  statuses.forEach(({ k, v }) => {
    const el = document.createElement("div");
    el.className = "statusItem";
    el.innerHTML = `<div class="statusItem__k">${escapeHtml(k)}</div><div class="statusItem__v">${escapeHtml(v)}</div>`;
    statusList.appendChild(el);
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function bindTextInput(state, id, key) {
  const el = $(id);
  if (!el) return;
  el.value = state.content[key] || "";
  el.addEventListener("input", () => {
    state.content[key] = el.value;
    markDirty(state);
    refreshWaTestLink(state);
  });
}

function renderList(state, containerId, items, renderItem) {
  const container = $(containerId);
  if (!container) return;
  container.innerHTML = "";
  items.forEach((item, idx) => container.appendChild(renderItem(item, idx)));
}

function createItemShell(title) {
  const wrap = document.createElement("div");
  wrap.className = "item";

  const top = document.createElement("div");
  top.className = "item__top";

  const t = document.createElement("div");
  t.className = "item__title";
  t.textContent = title;

  const actions = document.createElement("div");
  actions.className = "item__actions";

  top.appendChild(t);
  top.appendChild(actions);
  wrap.appendChild(top);

  return { wrap, actions };
}

function iconButton(label, klass) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = `iconBtn ${klass || ""}`.trim();
  b.textContent = label;
  return b;
}

function renderPackageEditor(state) {
  renderList(state, "packagesList", state.content.packages, (pkg, idx) => {
    const { wrap, actions } = createItemShell(pkg.name || `Paket #${idx + 1}`);
    const titleEl = wrap.querySelector(".item__title");

    const viewDet = iconButton("Lihat Detail", "iconBtn--info");
    viewDet.addEventListener("click", () => {
      state.activePackageIdx = idx;
      setTab(state, "detail-paket");
    });
    actions.appendChild(viewDet);

    const del = iconButton("Hapus", "iconBtn--danger");
    del.addEventListener("click", () => {
      state.content.packages.splice(idx, 1);
      markDirty(state);
      renderPackageEditor(state);
    });
    actions.appendChild(del);

    const grid = document.createElement("div");
    grid.className = "grid2";

    const name = fieldInput("Nama paket", pkg.name || "", (v) => {
      pkg.name = v;
      markDirty(state);
      if (titleEl) titleEl.textContent = v || `Paket #${idx + 1}`;
    });
    const desc = fieldTextarea("Deskripsi", pkg.desc || "", (v) => {
      pkg.desc = v;
      markDirty(state);
    });

    grid.appendChild(name);
    grid.appendChild(desc);

    const facilities = fieldTextarea(
      "Fasilitas (1 baris = 1 item)",
      (pkg.facilities || []).join("\n"),
      (v) => {
        pkg.facilities = String(v || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        markDirty(state);
      },
    );

    wrap.appendChild(grid);
    wrap.appendChild(facilities);
    return wrap;
  });
}

function renderDestinationsEditor(state) {
  renderList(state, "destinationsList", state.content.destinations, (d, idx) => {
    const { wrap, actions } = createItemShell(d.name || `Destinasi #${idx + 1}`);
    const titleEl = wrap.querySelector(".item__title");
    const del = iconButton("Hapus", "iconBtn--danger");
    del.addEventListener("click", () => {
      state.content.destinations.splice(idx, 1);
      markDirty(state);
      renderDestinationsEditor(state);
    });
    actions.appendChild(del);

    const grid = document.createElement("div");
    grid.className = "grid2";
    grid.appendChild(
      fieldInput("Nama", d.name || "", (v) => {
        d.name = v;
        markDirty(state);
        if (titleEl) titleEl.textContent = v || `Destinasi #${idx + 1}`;
      }),
    );
    grid.appendChild(fieldTextarea("Deskripsi", d.desc || "", (v) => {
      d.desc = v;
      markDirty(state);
    }));
    wrap.appendChild(grid);
    return wrap;
  });
}

function renderGalleryEditor(state) {
  renderList(state, "galleryList", state.content.gallery, (g, idx) => {
    const { wrap, actions } = createItemShell(g.title || `Galeri #${idx + 1}`);
    const titleEl = wrap.querySelector(".item__title");
    const del = iconButton("Hapus", "iconBtn--danger");
    del.addEventListener("click", () => {
      state.content.gallery.splice(idx, 1);
      markDirty(state);
      renderGalleryEditor(state);
    });
    actions.appendChild(del);

    const layout = document.createElement("div");
    layout.className = "grid2";
    layout.style.alignItems = "start";
    layout.style.marginTop = "12px";

    // Left Column: Image upload & preview wrapper
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "gallery-item-image-wrapper";

    const updatePreview = () => {
      imgWrapper.innerHTML = "";
      if (g.image) {
        const img = document.createElement("img");
        img.className = "gallery-item-image-preview";
        img.src = resolveAssetPath(g.image);
        imgWrapper.appendChild(img);
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = "gallery-item-image-placeholder";
        placeholder.innerHTML = `<i data-lucide="image"></i><span>Belum ada foto</span>`;
        imgWrapper.appendChild(placeholder);
      }

      const btnContainer = document.createElement("div");
      btnContainer.className = "gallery-upload-btn-container";

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.className = "is-hidden";

      const uploadBtn = document.createElement("button");
      uploadBtn.type = "button";
      uploadBtn.className = "btn btn--ghost btn--full";
      uploadBtn.innerHTML = `<i data-lucide="upload"></i> ${g.image ? 'Ganti Foto' : 'Upload Foto'}`;
      uploadBtn.addEventListener("click", () => fileInput.click());

      const statusText = document.createElement("div");
      statusText.className = "upload-status is-hidden";

      fileInput.addEventListener("change", async () => {
        if (!fileInput.files || fileInput.files.length === 0) return;
        const fileObj = fileInput.files[0];

        const formData = new FormData();
        formData.append("file", fileObj);

        statusText.className = "upload-status upload-status--loading";
        statusText.textContent = "Mengunggah...";
        statusText.classList.remove("is-hidden");

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const result = await response.json();
          if (result.success && result.url) {
            g.image = result.url;
            markDirty(state);
            statusText.className = "upload-status upload-status--success";
            statusText.textContent = "Berhasil!";
            setTimeout(() => {
              statusText.classList.add("is-hidden");
            }, 1500);
            updatePreview();
          } else {
            statusText.className = "upload-status upload-status--error";
            statusText.textContent = "Gagal unggah.";
          }
        } catch (err) {
          console.error(err);
          statusText.className = "upload-status upload-status--error";
          statusText.textContent = "Terjadi kesalahan.";
        }
      });

      btnContainer.appendChild(uploadBtn);
      btnContainer.appendChild(fileInput);
      imgWrapper.appendChild(btnContainer);
      imgWrapper.appendChild(statusText);

      if (typeof lucide !== "undefined") {
        lucide.createIcons({
          nameAttr: "data-lucide",
          attrs: { class: "icon" },
          nodeList: imgWrapper.querySelectorAll("[data-lucide]")
        });
      }
    };

    updatePreview();
    layout.appendChild(imgWrapper);

    // Right Column: Input fields
    const fieldsContainer = document.createElement("div");
    fieldsContainer.className = "field";
    fieldsContainer.style.gap = "12px";

    fieldsContainer.appendChild(
      fieldInput("Judul", g.title || "", (v) => {
        g.title = v;
        markDirty(state);
        if (titleEl) titleEl.textContent = v || `Galeri #${idx + 1}`;
      })
    );

    fieldsContainer.appendChild(
      fieldTextarea("Deskripsi", g.desc || "", (v) => {
        g.desc = v;
        markDirty(state);
      })
    );

    layout.appendChild(fieldsContainer);
    wrap.appendChild(layout);

    return wrap;
  });
}

function renderItineraryEditor(state) {
  renderList(state, "itineraryList", state.content.itinerary, (it, idx) => {
    const { wrap, actions } = createItemShell(`${it.time || "--.--"} • ${it.text || `Baris #${idx + 1}`}`);
    const titleEl = wrap.querySelector(".item__title");
    const del = iconButton("Hapus", "iconBtn--danger");
    del.addEventListener("click", () => {
      state.content.itinerary.splice(idx, 1);
      markDirty(state);
      renderItineraryEditor(state);
    });
    actions.appendChild(del);

    const updateTitle = () => {
      if (titleEl) {
        titleEl.textContent = `${it.time || "--.--"} • ${it.text || `Baris #${idx + 1}`}`;
      }
    };

    const grid = document.createElement("div");
    grid.className = "grid2";
    grid.appendChild(
      fieldInput("Jam", it.time || "", (v) => {
        it.time = v;
        markDirty(state);
        updateTitle();
      }),
    );
    grid.appendChild(
      fieldInput("Aktivitas", it.text || "", (v) => {
        it.text = v;
        markDirty(state);
        updateTitle();
      }),
    );
    wrap.appendChild(grid);
    return wrap;
  });
}

function renderReasonsEditor(state) {
  renderList(state, "reasonsList", state.content.reasons, (r, idx) => {
    const { wrap, actions } = createItemShell(`Poin #${idx + 1}`);
    const del = iconButton("Hapus", "iconBtn--danger");
    del.addEventListener("click", () => {
      state.content.reasons.splice(idx, 1);
      markDirty(state);
      renderReasonsEditor(state);
    });
    actions.appendChild(del);

    wrap.appendChild(
      fieldInput("Teks", r || "", (v) => {
        state.content.reasons[idx] = v;
        markDirty(state);
      }),
    );
    return wrap;
  });
}

function renderTestimonialsEditor(state) {
  renderList(state, "testimonialsList", state.content.testimonials, (t, idx) => {
    const { wrap, actions } = createItemShell(t.by || `Testimoni #${idx + 1}`);
    const titleEl = wrap.querySelector(".item__title");
    const del = iconButton("Hapus", "iconBtn--danger");
    del.addEventListener("click", () => {
      state.content.testimonials.splice(idx, 1);
      markDirty(state);
      renderTestimonialsEditor(state);
    });
    actions.appendChild(del);

    const grid = document.createElement("div");
    grid.className = "grid2";
    grid.appendChild(fieldTextarea("Quote", t.quote || "", (v) => {
      t.quote = v;
      markDirty(state);
    }));
    grid.appendChild(
      fieldInput("Sumber (by)", t.by || "", (v) => {
        t.by = v;
        markDirty(state);
        if (titleEl) titleEl.textContent = v || `Testimoni #${idx + 1}`;
      }),
    );
    wrap.appendChild(grid);
    return wrap;
  });
}

function renderFaqEditor(state) {
  renderList(state, "faqList", state.content.faqs, (f, idx) => {
    const { wrap, actions } = createItemShell(f.q || `FAQ #${idx + 1}`);
    const titleEl = wrap.querySelector(".item__title");
    const del = iconButton("Hapus", "iconBtn--danger");
    del.addEventListener("click", () => {
      state.content.faqs.splice(idx, 1);
      markDirty(state);
      renderFaqEditor(state);
    });
    actions.appendChild(del);

    const q = fieldInput("Pertanyaan", f.q || "", (v) => {
      f.q = v;
      markDirty(state);
      if (titleEl) titleEl.textContent = v || `FAQ #${idx + 1}`;
    });
    const a = fieldTextarea("Jawaban", f.a || "", (v) => {
      f.a = v;
      markDirty(state);
    });
    wrap.appendChild(q);
    wrap.appendChild(a);
    return wrap;
  });
}

function fieldInput(label, value, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "field";
  const l = document.createElement("label");
  l.textContent = label;
  const input = document.createElement("input");
  input.value = value;
  input.addEventListener("input", () => onChange(input.value));
  wrap.appendChild(l);
  wrap.appendChild(input);
  return wrap;
}

function fieldTextarea(label, value, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "field";
  const l = document.createElement("label");
  l.textContent = label;
  const ta = document.createElement("textarea");
  ta.rows = 4;
  ta.value = value;
  ta.addEventListener("input", () => onChange(ta.value));
  wrap.appendChild(l);
  wrap.appendChild(ta);
  return wrap;
}

function refreshWaTestLink(state) {
  const link = $("waTestLink");
  if (!link) return;
  const msg = buildWhatsAppMessage({
    nama: "Contoh Nama",
    tanggal: new Date().toLocaleDateString("id-ID", { dateStyle: "long" }),
    jumlah: "2",
    paket: state.content.packages?.[0]?.name || "Open Trip Bunaken",
    catatan: "Contoh catatan",
    nomorWa: "628xxxxxxxxxx",
  });
  link.href = waLinkWithMessage(state.content.whatsappE164, msg);
}

function showWaPreview(state) {
  const modal = $("waModal");
  const preview = $("waPreview");
  const openBtn = $("openWaBtn");
  if (!modal || !preview || !openBtn) return;

  const msg = buildWhatsAppMessage({
    nama: "Nama",
    tanggal: "Tanggal Trip",
    jumlah: "Jumlah Peserta",
    paket: "Paket",
    catatan: "Catatan",
    nomorWa: "Nomor WhatsApp",
  });

  preview.value = msg;
  openBtn.href = waLinkWithMessage(state.content.whatsappE164, msg);
  modal.showModal();
}

function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function applyContentToForm(state) {
  bindTextInput(state, "siteName", "siteName");
  bindTextInput(state, "tagline", "tagline");
  bindTextInput(state, "waNumber", "whatsappE164");
  bindTextInput(state, "igHandle", "instagramHandle");
  bindTextInput(state, "location", "location");
  bindTextInput(state, "heroTitle", "heroTitle");

  const heroSubtitle = $("heroSubtitle");
  if (heroSubtitle) {
    heroSubtitle.value = state.content.heroSubtitle || "";
    heroSubtitle.addEventListener("input", () => {
      state.content.heroSubtitle = heroSubtitle.value;
      markDirty(state);
      refreshWaTestLink(state);
    });
  }

  const aboutText = $("aboutText");
  if (aboutText) {
    aboutText.value = state.content.aboutText || "";
    aboutText.addEventListener("input", () => {
      state.content.aboutText = aboutText.value;
      markDirty(state);
    });
  }

  renderPackageEditor(state);
  renderDestinationsEditor(state);
  renderGalleryEditor(state);
  renderItineraryEditor(state);
  renderReasonsEditor(state);
  renderTestimonialsEditor(state);
  renderFaqEditor(state);
  refreshWaTestLink(state);
}

function hookAddButtons(state) {
  $("addPackageBtn")?.addEventListener("click", () => {
    openEditPackageModal(state, -1);
  });
  $("addDestinationBtn")?.addEventListener("click", () => {
    state.content.destinations.push({ name: "Destinasi Baru", desc: "" });
    markDirty(state);
    renderDestinationsEditor(state);
  });
  $("addGalleryBtn")?.addEventListener("click", () => {
    state.content.gallery.push({ title: "Item Galeri", desc: "", image: "" });
    markDirty(state);
    renderGalleryEditor(state);
  });
  $("addItineraryBtn")?.addEventListener("click", () => {
    state.content.itinerary.push({ time: "00.00", text: "Aktivitas" });
    markDirty(state);
    renderItineraryEditor(state);
  });
  $("addReasonBtn")?.addEventListener("click", () => {
    state.content.reasons.push("Poin baru");
    markDirty(state);
    renderReasonsEditor(state);
  });
  $("addTestimonialBtn")?.addEventListener("click", () => {
    state.content.testimonials.push({ quote: "Quote...", by: "Customer" });
    markDirty(state);
    renderTestimonialsEditor(state);
  });
  $("addFaqBtn")?.addEventListener("click", () => {
    state.content.faqs.push({ q: "Pertanyaan...", a: "Jawaban..." });
    markDirty(state);
    renderFaqEditor(state);
  });
}

function hookNav(state) {
  document.querySelectorAll(".nav__item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      if (tab) {
        setTab(state, tab);
        if (window.innerWidth <= 991) {
          document.body.classList.remove("sidebar-open");
        }
      }
    });
  });

  const sidebarToggle = $("sidebarToggle");
  sidebarToggle?.addEventListener("click", () => {
    if (window.innerWidth > 991) {
      document.body.classList.toggle("sidebar-collapsed");
    } else {
      document.body.classList.toggle("sidebar-open");
    }
  });
}

async function ensurePin(pin) {
  const stored = localStorage.getItem(PIN_HASH_KEY);
  const hash = await pinHash(pin);
  if (!stored) {
    localStorage.setItem(PIN_HASH_KEY, hash);
    return true;
  }
  return stored === hash;
}

function setSessionAuthed(yes) {
  localStorage.setItem(SESSION_KEY, yes ? "1" : "0");
}

function isSessionAuthed() {
  return localStorage.getItem(SESSION_KEY) === "1";
}

function showAuthedUI(authed) {
  $("auth")?.classList.toggle("is-hidden", authed);
  $("app")?.classList.toggle("is-hidden", !authed);
  const logoutBtn = $("logoutBtn");
  if (logoutBtn) logoutBtn.disabled = !authed;
}

function hookAuth(state) {
  const form = $("authForm");
  const pinInput = $("pin");
  const changePinBtn = $("changePinBtn");
  const logoutBtn = $("logoutBtn");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pin = pinInput?.value || "";
    if (pin.length < 4) return;
    const ok = await ensurePin(pin);
    if (!ok) {
      alert("PIN salah.");
      return;
    }
    setSessionAuthed(true);
    showAuthedUI(true);
    pinInput.value = "";
  });

  logoutBtn?.addEventListener("click", () => {
    setSessionAuthed(false);
    showAuthedUI(false);
  });

  changePinBtn?.addEventListener("click", async () => {
    const newPin = prompt("Masukkan PIN baru (min 4 digit):");
    if (!newPin || newPin.length < 4) return;
    const hash = await pinHash(newPin);
    localStorage.setItem(PIN_HASH_KEY, hash);
    alert("PIN diganti.");
  });

  if (isSessionAuthed()) showAuthedUI(true);
}

function hookActions(state) {
  $("saveBtn")?.addEventListener("click", async () => {
    saveContent(state.content);
    markClean(state);
    const rawJson = $("rawJson");
    if (rawJson) rawJson.value = JSON.stringify(state.content, null, 2);

    const saveHint = $("saveHint");
    if (saveHint) saveHint.textContent = "Menyimpan ke server...";

    try {
      const response = await fetch("/api/save-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(state.content)
      });
      const result = await response.json();
      if (result.success) {
        if (saveHint) saveHint.textContent = "Tersimpan di server & browser.";
      } else {
        if (saveHint) saveHint.textContent = "Gagal simpan ke server (tersimpan di browser).";
      }
    } catch (err) {
      console.error(err);
      if (saveHint) saveHint.textContent = "Koneksi gagal (tersimpan di browser).";
    }
  });

  $("copyJsonBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(state.content, null, 2));
      alert("JSON disalin.");
    } catch {
      alert("Gagal menyalin (izin clipboard diblok).");
    }
  });

  $("previewMsgBtn")?.addEventListener("click", () => showWaPreview(state));
  $("waModalClose")?.addEventListener("click", () => $("waModal")?.close());
  $("copyWaBtn")?.addEventListener("click", async () => {
    const text = $("waPreview")?.value || "";
    try {
      await navigator.clipboard.writeText(text);
      alert("Pesan disalin.");
    } catch {
      alert("Gagal menyalin (izin clipboard diblok).");
    }
  });

  $("downloadBtn2")?.addEventListener("click", () => {
    downloadJson("content.json", state.content);
  });
  $("openPackagesTabBtn")?.addEventListener("click", () => setTab(state, "paket"));

  $("previewLandingBtn")?.addEventListener("click", () => {
    // Preview mode uses localStorage data on landing (implemented on landing side).
    const url = "../landingpage/index.html?preview=1";
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

function init() {
  const state = {
    content: loadContent(),
    isDirty: false,
    activeTab: "dashboard",
    activePackageIdx: 0,
  };

  const authHelp = $("authHelp");
  if (authHelp) {
    if (!globalThis.isSecureContext && !globalThis.crypto?.subtle) {
      authHelp.textContent =
        "WebCrypto tidak tersedia di origin ini. PIN tetap bisa dipakai, tapi hanya gate ringan. Disarankan buka via http://localhost/ untuk hasil terbaik.";
      authHelp.classList.remove("is-hidden");
    } else if (!globalThis.isSecureContext) {
      authHelp.textContent = "Origin ini bukan secure context. Jika ada kendala, buka admin via http://localhost/ atau HTTPS.";
      authHelp.classList.remove("is-hidden");
    }
  }

  hookAuth(state);
  showAuthedUI(isSessionAuthed());

  applyContentToForm(state);
  hookAddButtons(state);
  hookNav(state);
  hookActions(state);
  hookDetailPaket(state);
  
  renderDashboard(state);

  // If localStorage is empty, try to fetch real content.json from the public directory
  const hasLocal = localStorage.getItem(STORAGE_KEY);
  if (!hasLocal) {
    fetch("../api/content")
      .then((res) => {
        if (!res.ok) throw new Error("Status " + res.status);
        return res.json();
      })
      .then((data) => {
        state.content = { ...defaultContent(), ...data };
        applyContentToForm(state);
        renderDashboard(state);
        if (state.activeTab === "detail-paket") {
          renderPackageDetailView(state);
        }
      })
      .catch((err) => {
        console.warn("Could not auto-fetch ../api/content (expected if running via file:// protocol):", err);
      });
  }
  
  // Cosmetical toggles
  $("themeToggle")?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = $("themeToggle")?.querySelector("i");
    if (icon) {
      const isDark = document.body.classList.contains("dark-mode");
      icon.setAttribute("data-lucide", isDark ? "sun" : "moon");
      if (typeof lucide !== "undefined") lucide.createIcons();
    }
  });

  $("fullscreenToggle")?.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  });

  // Global search filtering
  $("globalSearch")?.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase().trim();
    const activeTab = state.activeTab;
    if (activeTab === "paket") {
      const items = document.querySelectorAll("#packagesList .item");
      items.forEach((item) => {
        const title = item.querySelector(".item__title")?.textContent.toLowerCase() || "";
        item.classList.toggle("is-hidden", !title.includes(val));
      });
    } else if (activeTab === "destinasi") {
      const items = document.querySelectorAll("#destinationsList .item");
      items.forEach((item) => {
        const title = item.querySelector(".item__title")?.textContent.toLowerCase() || "";
        item.classList.toggle("is-hidden", !title.includes(val));
      });
    } else if (activeTab === "galeri") {
      const items = document.querySelectorAll("#galleryList .item");
      items.forEach((item) => {
        const title = item.querySelector(".item__title")?.textContent.toLowerCase() || "";
        item.classList.toggle("is-hidden", !title.includes(val));
      });
    } else if (activeTab === "faq") {
      const items = document.querySelectorAll("#faqList .item");
      items.forEach((item) => {
        const title = item.querySelector(".item__title")?.textContent.toLowerCase() || "";
        item.classList.toggle("is-hidden", !title.includes(val));
      });
    }
  });

  setTab(state, "dashboard");
  markClean(state);
  
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// Package Detail View Helpers
const standardExclusions = [
  "Pengeluaran pribadi selama trip",
  "Penerbangan / Transportasi ke meeting point Manado",
  "Tips untuk tour guide / crew boat (sukarela)",
  "Asuransi perjalanan (opsional)",
  "Peralatan diving tambahan di luar paket snorkeling"
];

function renderPackageDetailView(state) {
  const pkgs = state.content.packages || [];
  
  // Populate Dropdown Select
  const detailSelect = $("packageDetailSelect");
  if (detailSelect) {
    detailSelect.innerHTML = "";
    pkgs.forEach((p, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = p.name || `Paket #${idx + 1}`;
      detailSelect.appendChild(opt);
    });
    
    if (state.activePackageIdx === undefined || state.activePackageIdx >= pkgs.length) {
      state.activePackageIdx = 0;
    }
    detailSelect.value = state.activePackageIdx;
  }

  // If no packages
  const card = $("packageDetailCard");
  if (pkgs.length === 0) {
    if (card) {
      card.innerHTML = `<div class="p-8 text-center text-muted">Belum ada paket wisata. Klik "Tambah Paket" untuk membuat baru.</div>`;
    }
    return;
  }

  const pkg = pkgs[state.activePackageIdx] || pkgs[0];
  state.activePackageIdx = pkgs.indexOf(pkg);

  // Update text
  const nameEl = $("detailPackageName");
  if (nameEl) nameEl.textContent = pkg.name || "Package's Details";
  
  const descEl = $("detailPackageDesc");
  if (descEl) descEl.textContent = pkg.desc || "Belum ada deskripsi.";

  // Update Inclusions (facilities)
  const incList = $("detailPackageInclusions");
  if (incList) {
    incList.innerHTML = "";
    const facilities = pkg.facilities || [];
    if (facilities.length === 0) {
      incList.innerHTML = `<li style="list-style:none;">(Tidak ada fasilitas tertulis)</li>`;
    } else {
      facilities.forEach((fac) => {
        const li = document.createElement("li");
        li.textContent = fac;
        incList.appendChild(li);
      });
    }
  }

  // Update Exclusions
  const excList = $("detailPackageExclusions");
  if (excList) {
    excList.innerHTML = "";
    standardExclusions.forEach((exc) => {
      const li = document.createElement("li");
      li.textContent = exc;
      excList.appendChild(li);
    });
  }

  // Update Cover Image banner
  const bannerImg = $("detailPackageBanner");
  if (bannerImg) {
    const banners = [
      "/gotur/hero-1-1-image.jpg",
      "/gotur/hero-1-2-image.jpg",
      "/gotur/hero-1-3-image.jpg",
    ];
    bannerImg.src = resolveAssetPath(banners[state.activePackageIdx % banners.length]);
  }

  // Update Itinerary
  const itinTimeline = $("detailPackageItinerary");
  if (itinTimeline) {
    itinTimeline.innerHTML = "";
    const items = state.content.itinerary || [];
    items.forEach((it) => {
      const row = document.createElement("div");
      row.className = "itinerary-row";
      row.innerHTML = `<span class="itinerary-row__time">${escapeHtml(it.time)}</span><span class="itinerary-row__act">${escapeHtml(it.text)}</span>`;
      itinTimeline.appendChild(row);
    });
  }

  // Update Gallery Mock
  const galGrid = $("detailPackageGallery");
  if (galGrid) {
    galGrid.innerHTML = "";
    const items = state.content.gallery || [];
    const images = [
      "/gotur/about-2-1.jpg",
      "/gotur/about-s-2-1.jpg",
      "/gotur/destination-slider-1-2-268x391.jpg",
      "/gotur/destination-slider-1-3-268x391.jpg",
      "/gotur/hero-1-1-image.jpg",
      "/gotur/hero-1-2-image.jpg",
      "/gotur/hero-1-3-image.jpg",
    ];
    items.slice(0, 4).forEach((g, i) => {
      const item = document.createElement("div");
      item.className = "gallery-grid-item";
      const src = resolveAssetPath(g.image || images[i % images.length]);
      item.innerHTML = `<img src="${src}" alt="${escapeHtml(g.title)}" /><div class="gallery-grid-item__overlay">${escapeHtml(g.title)}</div>`;
      galGrid.appendChild(item);
    });
  }

  // Update Reviews Mock
  const reviewsList = $("detailPackageReviews");
  if (reviewsList) {
    reviewsList.innerHTML = "";
    const items = state.content.testimonials || [];
    items.forEach((t) => {
      const div = document.createElement("div");
      div.className = "review-item";
      div.innerHTML = `<blockquote>“${escapeHtml(t.quote)}”</blockquote><cite>— ${escapeHtml(t.by)}</cite>`;
      reviewsList.appendChild(div);
    });
  }
  
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function openEditPackageModal(state, idx) {
  const modal = $("editPackageModal");
  if (!modal) return;
  
  const title = $("editPackageModalTitle");
  const idxInput = $("editPackageIdx");
  const nameInput = $("editPackageName");
  const descInput = $("editPackageDesc");
  const facInput = $("editPackageFacilities");

  if (idx === -1) {
    if (title) title.textContent = "Tambah Paket Wisata Baru";
    if (idxInput) idxInput.value = "-1";
    if (nameInput) nameInput.value = "";
    if (descInput) descInput.value = "";
    if (facInput) facInput.value = "";
  } else {
    const pkg = state.content.packages[idx];
    if (!pkg) return;
    if (title) title.textContent = "Edit Paket Wisata";
    if (idxInput) idxInput.value = String(idx);
    if (nameInput) nameInput.value = pkg.name || "";
    if (descInput) descInput.value = pkg.desc || "";
    if (facInput) facInput.value = (pkg.facilities || []).join("\n");
  }
  
  modal.showModal();
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function saveEditPackageModal(state) {
  const idxVal = $("editPackageIdx")?.value;
  const nameVal = $("editPackageName")?.value || "";
  const descVal = $("editPackageDesc")?.value || "";
  const facVal = $("editPackageFacilities")?.value || "";

  const facilities = facVal
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const idx = parseInt(idxVal, 10);
  if (idx === -1) {
    state.content.packages.push({
      name: nameVal,
      desc: descVal,
      facilities: facilities
    });
    state.activePackageIdx = state.content.packages.length - 1;
  } else {
    const pkg = state.content.packages[idx];
    if (pkg) {
      pkg.name = nameVal;
      pkg.desc = descVal;
      pkg.facilities = facilities;
    }
  }

  markDirty(state);
  renderPackageEditor(state);
  renderPackageDetailView(state);
  
  const detailSelect = $("packageDetailSelect");
  if (detailSelect) detailSelect.value = state.activePackageIdx;
  
  $("editPackageModal")?.close();
  
  if (idx === -1) {
    setTab(state, "detail-paket");
  }
}

function deletePackageAt(state, idx) {
  const pkg = state.content.packages[idx];
  if (!pkg) return;
  
  if (!confirm(`Hapus paket "${pkg.name}"?`)) return;
  
  state.content.packages.splice(idx, 1);
  markDirty(state);
  
  renderPackageEditor(state);
  state.activePackageIdx = Math.max(0, idx - 1);
  renderPackageDetailView(state);
  setTab(state, "paket");
}

function hookDetailPaket(state) {
  // Accordion Toggle
  const accordion = document.getElementById("paketAccordion");
  const accordionToggle = accordion?.querySelector(".nav-accordion-toggle");
  const accordionMenu = accordion?.querySelector(".nav-accordion-menu");
  
  if (accordionToggle && accordionMenu) {
    accordionToggle.addEventListener("click", () => {
      const isHidden = accordionMenu.classList.contains("is-hidden");
      if (isHidden) {
        accordionMenu.classList.remove("is-hidden");
        accordion.classList.remove("is-collapsed");
      } else {
        accordionMenu.classList.add("is-hidden");
        accordion.classList.add("is-collapsed");
      }
    });
  }

  // Detail Sub-tabs selection
  const detailTabs = document.querySelectorAll(".detail-tabs__item");
  detailTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      detailTabs.forEach((t) => t.classList.remove("is-active"));
      btn.classList.add("is-active");
      
      const subtab = btn.getAttribute("data-subtab");
      const contents = document.querySelectorAll(".detail-tab-content");
      contents.forEach((c) => c.classList.add("is-hidden"));
      $(`detail-subtab-${subtab}`)?.classList.remove("is-hidden");
    });
  });

  // Package Detail select change
  const detailSelect = $("packageDetailSelect");
  detailSelect?.addEventListener("change", () => {
    state.activePackageIdx = parseInt(detailSelect.value, 10);
    renderPackageDetailView(state);
  });

  // Action buttons
  $("detailEditBtn")?.addEventListener("click", () => {
    openEditPackageModal(state, state.activePackageIdx);
  });

  $("detailDeleteBtn")?.addEventListener("click", () => {
    deletePackageAt(state, state.activePackageIdx);
  });

  // Sidebar Add Button
  $("sidebarAddPackageBtn")?.addEventListener("click", () => {
    openEditPackageModal(state, -1);
  });

  // Form Submit
  $("editPackageForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    saveEditPackageModal(state);
  });

  // Modal Cancel/Close buttons
  $("editPackageModalClose")?.addEventListener("click", () => {
    $("editPackageModal")?.close();
  });

  $("editPackageCancelBtn")?.addEventListener("click", () => {
    $("editPackageModal")?.close();
  });
}

document.addEventListener("DOMContentLoaded", init);
