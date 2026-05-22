const WHATSAPP_NUMBER_E164 = "6281245474575";
const INSTAGRAM_HANDLE = "balincahtripmanado";

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
  return `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeWhatsAppMessage(message)}`;
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

  const igUrl = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;
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

document.addEventListener("DOMContentLoaded", init);

