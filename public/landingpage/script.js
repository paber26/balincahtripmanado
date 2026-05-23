const DEFAULT_WHATSAPP_NUMBER_E164 = "6281245474575";
const DEFAULT_INSTAGRAM_HANDLE = "balincahtripmanado";
const ADMIN_STORAGE_KEY = "balincah_admin_content_v1";
const CONTENT_URL = "../api/content";

function encodeWhatsAppMessage(message) {
  return encodeURIComponent(message.trim());
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

function waLinkWithMessage(message) {
  return `https://wa.me/${DEFAULT_WHATSAPP_NUMBER_E164}?text=${encodeWhatsAppMessage(message)}`;
}

function waLinkWithMessageFor(numberE164, message) {
  const num = String(numberE164 || DEFAULT_WHATSAPP_NUMBER_E164).replace(/[^\d]/g, "");
  return `https://wa.me/${num}?text=${encodeWhatsAppMessage(message)}`;
}

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

async function loadContent() {
  const preview = getQueryParam("preview") === "1";
  if (preview) {
    try {
      const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
  }

  try {
    const res = await fetch(CONTENT_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("content fetch failed");
    return await res.json();
  } catch {
    return null;
  }
}

function setTextIf(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
}

function setHtmlIf(id, html) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = html;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatIndoPhoneFromE164(e164) {
  const num = String(e164 || "").replace(/[^\d]/g, "");
  if (!num) return "";
  if (num.startsWith("62")) return "0" + num.slice(2);
  return num;
}

function renderLandingContent(content) {
  if (!content) return;

  // Brand
  const siteName = String(content.siteName || "Balincah Trip Manado");
  const [brandName, brandTag] = siteName.includes(" ") ? ["Balincah Trip", siteName.replace("Balincah Trip", "").trim() || "Manado"] : ["Balincah Trip", "Manado"];
  setTextIf("brandName", brandName);
  setTextIf("brandTag", brandTag || "Manado");
  setTextIf("footerBrandName", brandName);
  setTextIf("footerBrandTag", brandTag || "Manado");

  // Hero
  if (content.tagline) setTextIf("heroTagline", content.tagline);
  if (content.heroTitle) setTextIf("heroTitle", content.heroTitle);
  if (content.heroSubtitle) setTextIf("heroSubtitle", content.heroSubtitle);

  // About
  if (content.aboutText) setTextIf("aboutText", content.aboutText);

  // Reasons (section)
  if (Array.isArray(content.reasons)) {
    // About (list)
    const aboutList = document.getElementById("aboutReasons");
    if (aboutList) {
      aboutList.innerHTML = content.reasons
        .slice(0, 5)
        .map((r) => `<li>${escapeHtml(r)}</li>`)
        .join("");
    }

    const reasons = content.reasons
      .slice(0, 12)
      .map((r) => `<div class="reason">${escapeHtml(r)}</div>`)
      .join("");
    setHtmlIf("reasons", reasons);
  }

  // Packages
  if (Array.isArray(content.packages)) {
    const cards = content.packages
      .map((p) => {
        const name = escapeHtml(p.name || "Paket");
        const desc = escapeHtml(p.desc || "");
        const facilities = Array.isArray(p.facilities) ? p.facilities.map((f) => `<li>${escapeHtml(f)}</li>`).join("") : "";
        const chips = [
          `<span class="chip">Bunaken</span>`,
          name.toLowerCase().includes("3 pulau") ? `<span class="chip">Island Hopping</span>` : `<span class="chip">One Day Trip</span>`,
        ].join("");
        return `
          <article class="pkg">
            <div class="tourThumb" aria-hidden="true"></div>
            <div class="pkg__top">
              <h3>${name}</h3>
              <p class="muted">${desc}</p>
            </div>
            <div class="tourMeta">${chips}</div>
            <ul class="list list--compact">${facilities}</ul>
            <div class="pkg__actions">
              <button class="btn btn--primary js-book" type="button" data-paket="${name}">Booking</button>
              <button class="btn btn--ghost js-scroll" type="button" data-target="#booking">Isi Form</button>
            </div>
          </article>
        `;
      })
      .join("");
    setHtmlIf("packages", cards);

    // Booking select options
    const select = document.getElementById("paketSelect");
    if (select) {
      select.innerHTML = content.packages.map((p) => `<option>${escapeHtml(p.name || "Paket")}</option>`).join("");
    }

    // Hero select options
    const heroSelect = document.getElementById("heroPaket");
    if (heroSelect) {
      heroSelect.innerHTML = content.packages.map((p) => `<option>${escapeHtml(p.name || "Paket")}</option>`).join("");
    }
  }

  // Destinations
  if (Array.isArray(content.destinations)) {
    const items = content.destinations
      .map((d, idx) => {
        const name = escapeHtml(d.name || "Destinasi");
        const desc = escapeHtml(d.desc || "");
        const klass = idx === 0 ? "dest__ph--bunaken" : idx === 1 ? "dest__ph--nain" : idx === 2 ? "dest__ph--siladen" : "dest__ph--uw";
        return `
          <div class="dest__item">
            <div class="dest__ph ${klass}" aria-hidden="true"></div>
            <h3>${name}</h3>
            <p class="muted">${desc}</p>
          </div>
        `;
      })
      .join("");
    setHtmlIf("destinations", items);
  }

  // Gallery (9 items max to match layout classes g--1..g--9)
  if (Array.isArray(content.gallery)) {
    const classes = ["g--1", "g--2", "g--3", "g--4", "g--5", "g--6", "g--7", "g--8", "g--9"];
    const buttons = content.gallery.slice(0, 9).map((g, i) => {
      const title = escapeHtml(g.title || `Galeri ${i + 1}`);
      const desc = escapeHtml(g.desc || "");
      const style = g.image ? `style="background: url('${g.image}') no-repeat center/cover;"` : "";
      return `<button class="g ${classes[i] || ""}" ${style} type="button" data-title="${title}" data-desc="${desc}" aria-label="Buka detail galeri ${i + 1}"></button>`;
    });
    setHtmlIf("gallery", buttons.join(""));
  }

  // Itinerary
  if (Array.isArray(content.itinerary)) {
    const rows = content.itinerary
      .map((it) => `<div class="t"><span class="t__time">${escapeHtml(it.time || "--.--")}</span><span class="t__text">${escapeHtml(it.text || "")}</span></div>`)
      .join("");
    setHtmlIf("timeline", rows);
  }

  // Testimonials
  if (Array.isArray(content.testimonials)) {
    const quotes = content.testimonials
      .slice(0, 8)
      .map((t) => {
        const q = escapeHtml(t.quote || "");
        const by = escapeHtml(t.by || "");
        return `<figure class="quote"><blockquote>“${q}”</blockquote><figcaption>— ${by}</figcaption></figure>`;
      })
      .join("");
    setHtmlIf("testimonials", quotes);
  }

  // FAQ
  if (Array.isArray(content.faqs)) {
    const faqs = content.faqs
      .slice(0, 12)
      .map((f) => {
        const q = escapeHtml(f.q || "");
        const a = escapeHtml(f.a || "");
        return `<details><summary>${q}</summary><p>${a}</p></details>`;
      })
      .join("");
    setHtmlIf("faqList", faqs);
  }

  // Contact
  if (content.location) setTextIf("locationText", content.location);
  if (content.location) setTextIf("locationTopText", content.location);

  const msg = buildWhatsAppMessage({
    nama: "",
    tanggal: "",
    jumlah: "",
    paket: "",
    catatan: "",
    nomorWa: "",
  });
  const wa = waLinkWithMessageFor(content.whatsappE164, msg);
  ["waHeaderBtn", "waHeroBtn", "waAboutBtn", "waFooterBtn", "waFloat", "waTextLink", "waTopLink"].forEach((id) => setHref(id, wa));

  const igHandle = String(content.instagramHandle || DEFAULT_INSTAGRAM_HANDLE).replace(/^@/, "");
  const igUrl = `https://www.instagram.com/${igHandle}/`;
  ["igBtn", "igFooterBtn", "igTextLink", "igTopLink"].forEach((id) => setHref(id, igUrl));
  const waText = document.getElementById("waTextLink");
  if (waText) waText.textContent = formatIndoPhoneFromE164(content.whatsappE164 || DEFAULT_WHATSAPP_NUMBER_E164);
  const waTop = document.getElementById("waTopLink");
  if (waTop) waTop.textContent = `WA: ${formatIndoPhoneFromE164(content.whatsappE164 || DEFAULT_WHATSAPP_NUMBER_E164)}`;
  const igText = document.getElementById("igTextLink");
  if (igText) igText.textContent = `@${igHandle}`;
  const igTop = document.getElementById("igTopLink");
  if (igTop) igTop.textContent = `IG: @${igHandle}`;

  if (content.tagline) setTextIf("footerTagline", `${content.tagline} — Open trip, private trip, snorkeling, diving, dan boat charter.`);
}

function setHref(id, href) {
  const el = document.getElementById(id);
  if (!el) return;
  el.href = href;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
}

function scrollToTarget(selector) {
  const target = document.querySelector(selector);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function normalizeIndoPhone(input) {
  if (!input) return "";
  let cleaned = String(input).trim().replace(/[^\d+]/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("0")) cleaned = "62" + cleaned.slice(1);
  if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);
  return cleaned;
}

function init() {
  setText("year", String(new Date().getFullYear()));

  const defaultMessage = buildWhatsAppMessage({
    nama: "",
    tanggal: "",
    jumlah: "",
    paket: "",
    catatan: "",
    nomorWa: "",
  });
  const defaultWa = waLinkWithMessage(defaultMessage);

  ["waHeaderBtn", "waHeroBtn", "waAboutBtn", "waFooterBtn", "waFloat", "waTextLink"].forEach((id) =>
    setHref(id, defaultWa),
  );

  const igUrl = `https://www.instagram.com/${DEFAULT_INSTAGRAM_HANDLE}/`;
  ["igBtn", "igFooterBtn", "igTextLink"].forEach((id) => setHref(id, igUrl));

  // Mobile nav
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navMenu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  }

  // Smooth scroll buttons
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-scroll");
    if (!btn) return;
    const target = btn.getAttribute("data-target");
    if (!target) return;
    scrollToTarget(target);
  });

  // Booking button per paket
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-book");
    if (!btn) return;
    const paket = btn.getAttribute("data-paket") || "Paket Trip";
    const paketSelect = document.getElementById("paketSelect");
    if (paketSelect) paketSelect.value = paket;
    scrollToTarget("#booking");
  });

  // Gallery modal
  const modal = document.getElementById("galleryModal");
  const closeModal = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalPh = document.getElementById("modalPh");
  const gallery = document.getElementById("gallery");
  if (modal && gallery && modalTitle && modalDesc && modalPh) {
    gallery.addEventListener("click", (e) => {
      const card = e.target.closest(".g");
      if (!card) return;
      const title = card.getAttribute("data-title") || "Galeri";
      const desc = card.getAttribute("data-desc") || "Detail galeri.";
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modalPh.style.background = getComputedStyle(card).background;
      modal.showModal();
    });
    if (closeModal) closeModal.addEventListener("click", () => modal.close());
    modal.addEventListener("click", (e) => {
      const rect = modal.getBoundingClientRect();
      const inDialog =
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height && rect.left <= e.clientX && e.clientX <= rect.left + rect.width;
      if (!inDialog) modal.close();
    });
  }

  // Booking form -> WhatsApp
  const form = document.getElementById("bookingForm");
  const copyBtn = document.getElementById("copyMsgBtn");
  if (form) {
    const getFormValues = () => {
      const nama = form.querySelector("#nama")?.value || "";
      const nomorWaRaw = form.querySelector("#wa")?.value || "";
      const tanggalRaw = form.querySelector("#tanggal")?.value || "";
      const jumlah = form.querySelector("#jumlah")?.value || "";
      const paket = form.querySelector("#paketSelect")?.value || "";
      const catatan = form.querySelector("#catatan")?.value || "";

      const tanggal = tanggalRaw ? new Date(tanggalRaw + "T00:00:00").toLocaleDateString("id-ID", { dateStyle: "long" }) : "";
      const nomorWa = normalizeIndoPhone(nomorWaRaw);

      return { nama, nomorWa, tanggal, jumlah, paket, catatan };
    };

    const makeMessage = () => buildWhatsAppMessage(getFormValues());

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const link = waLinkWithMessage(makeMessage());
      window.open(link, "_blank", "noopener,noreferrer");
    });

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(makeMessage());
          copyBtn.textContent = "Tersalin";
          setTimeout(() => (copyBtn.textContent = "Salin Pesan"), 1200);
        } catch {
          // Fallback: do nothing (clipboard may be blocked)
          copyBtn.textContent = "Gagal menyalin";
          setTimeout(() => (copyBtn.textContent = "Salin Pesan"), 1200);
        }
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  init();
  const content = await loadContent();
  renderLandingContent(content);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const iso = `${yyyy}-${mm}-${dd}`;
  const heroDate = document.getElementById("heroDate");
  if (heroDate && !heroDate.value) {
    heroDate.min = iso;
    heroDate.value = iso;
  }

  // Hero search form -> prefill booking form and scroll
  const heroForm = document.getElementById("heroSearchForm");
  if (heroForm) {
    heroForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const paket = document.getElementById("heroPaket")?.value || "";
      const tanggal = document.getElementById("heroDate")?.value || "";
      const jumlah = document.getElementById("heroGuests")?.value || "1";
      const catatan = document.getElementById("heroNote")?.value || "";

      const paketSelect = document.getElementById("paketSelect");
      if (paketSelect && paket) paketSelect.value = paket;
      const tanggalEl = document.getElementById("tanggal");
      if (tanggalEl && tanggal) tanggalEl.value = tanggal;
      const jumlahEl = document.getElementById("jumlah");
      if (jumlahEl && jumlah) jumlahEl.value = jumlah;
      const catatanEl = document.getElementById("catatan");
      if (catatanEl && catatan) catatanEl.value = catatan;

      scrollToTarget("#booking");
    });
  }
});
