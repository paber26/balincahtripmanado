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
      { title: "Drone View", desc: "Foto drone perjalanan ke Bunaken." },
      { title: "Underwater", desc: "Terumbu karang dan ikan warna-warni." },
      { title: "Peserta Trip", desc: "Momen seru bareng peserta trip." },
      { title: "Kapal", desc: "Kapal wisata siap berangkat." },
      { title: "Pulau & Pasir Putih", desc: "Spot foto pasir putih yang estetik." },
      { title: "Sunset Vibes", desc: "Golden hour di laut Manado." },
      { title: "Snorkeling Spot", desc: "Air jernih & view bawah laut." },
      { title: "Island Hopping", desc: "Trip 3 pulau: Bunaken–Nain–Siladen." },
      { title: "Resort Area", desc: "Area dermaga dan resort." },
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
  items.forEach((b) => b.classList.toggle("is-active", b.getAttribute("data-tab") === tabKey));

  const titles = {
    umum: ["Umum", "Pengaturan identitas dan copy utama."],
    paket: ["Paket", "Kelola paket wisata dan fasilitas."],
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
  if (tabTitle) tabTitle.textContent = t;
  if (tabDesc) tabDesc.textContent = d;

  const rawJson = $("rawJson");
  if (tabKey === "export" && rawJson) rawJson.value = JSON.stringify(state.content, null, 2);
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
      renderPackageEditor(state);
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
        renderDestinationsEditor(state);
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
    const del = iconButton("Hapus", "iconBtn--danger");
    del.addEventListener("click", () => {
      state.content.gallery.splice(idx, 1);
      markDirty(state);
      renderGalleryEditor(state);
    });
    actions.appendChild(del);

    const grid = document.createElement("div");
    grid.className = "grid2";
    grid.appendChild(
      fieldInput("Judul", g.title || "", (v) => {
        g.title = v;
        markDirty(state);
        renderGalleryEditor(state);
      }),
    );
    grid.appendChild(fieldTextarea("Deskripsi", g.desc || "", (v) => {
      g.desc = v;
      markDirty(state);
    }));
    wrap.appendChild(grid);
    return wrap;
  });
}

function renderItineraryEditor(state) {
  renderList(state, "itineraryList", state.content.itinerary, (it, idx) => {
    const { wrap, actions } = createItemShell(`${it.time || "--.--"} • ${it.text || `Baris #${idx + 1}`}`);
    const del = iconButton("Hapus", "iconBtn--danger");
    del.addEventListener("click", () => {
      state.content.itinerary.splice(idx, 1);
      markDirty(state);
      renderItineraryEditor(state);
    });
    actions.appendChild(del);

    const grid = document.createElement("div");
    grid.className = "grid2";
    grid.appendChild(
      fieldInput("Jam", it.time || "", (v) => {
        it.time = v;
        markDirty(state);
        renderItineraryEditor(state);
      }),
    );
    grid.appendChild(
      fieldInput("Aktivitas", it.text || "", (v) => {
        it.text = v;
        markDirty(state);
        renderItineraryEditor(state);
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
        renderTestimonialsEditor(state);
      }),
    );
    wrap.appendChild(grid);
    return wrap;
  });
}

function renderFaqEditor(state) {
  renderList(state, "faqList", state.content.faqs, (f, idx) => {
    const { wrap, actions } = createItemShell(f.q || `FAQ #${idx + 1}`);
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
      renderFaqEditor(state);
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
    state.content.packages.push({ name: "Paket Baru", desc: "", facilities: [""] });
    markDirty(state);
    renderPackageEditor(state);
  });
  $("addDestinationBtn")?.addEventListener("click", () => {
    state.content.destinations.push({ name: "Destinasi Baru", desc: "" });
    markDirty(state);
    renderDestinationsEditor(state);
  });
  $("addGalleryBtn")?.addEventListener("click", () => {
    state.content.gallery.push({ title: "Item Galeri", desc: "" });
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
    btn.addEventListener("click", () => setTab(state, btn.getAttribute("data-tab")));
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
  $("saveBtn")?.addEventListener("click", () => {
    saveContent(state.content);
    markClean(state);
    const rawJson = $("rawJson");
    if (rawJson) rawJson.value = JSON.stringify(state.content, null, 2);
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

  $("downloadBtn")?.addEventListener("click", () => {
    downloadJson("balincah-content.json", state.content);
  });

  $("importFile")?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      state.content = { ...defaultContent(), ...parsed };
      applyContentToForm(state);
      markDirty(state);
      alert("Import berhasil. Klik Simpan untuk menyimpan ke browser.");
    } catch {
      alert("JSON tidak valid.");
    }
    e.target.value = "";
  });

  $("applyRawBtn")?.addEventListener("click", () => {
    const raw = $("rawJson")?.value || "";
    try {
      const parsed = JSON.parse(raw);
      state.content = { ...defaultContent(), ...parsed };
      applyContentToForm(state);
      markDirty(state);
      alert("JSON diterapkan. Klik Simpan untuk menyimpan ke browser.");
    } catch {
      alert("JSON tidak valid.");
    }
  });

  $("resetBtn")?.addEventListener("click", () => {
    if (!confirm("Reset admin? Ini menghapus konten tersimpan di browser.")) return;
    localStorage.removeItem(STORAGE_KEY);
    state.content = defaultContent();
    applyContentToForm(state);
    markDirty(state);
  });
}

function init() {
  const state = {
    content: loadContent(),
    isDirty: false,
    activeTab: "umum",
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
  setTab(state, "umum");
  markClean(state);
}

document.addEventListener("DOMContentLoaded", init);
