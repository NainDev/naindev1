/**
 * assets/js/main.js
 * ---------------------------------------------------------------
 * Interaksi umum halaman portofolio:
 * - Navbar berubah jadi blur solid saat discroll
 * - Menu mobile (hamburger)
 * - Animasi fade-up saat elemen masuk viewport
 * - Toggle kartu ikon interaktif (Keahlian & Tools)
 * - Smooth scroll + highlight link navbar aktif
 * ---------------------------------------------------------------
 */

// ---------------- Navbar blur on scroll ----------------
const navbar = document.getElementById("navbar");
function handleNavbarScroll() {
  if (window.scrollY > 24) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
}
window.addEventListener("scroll", handleNavbarScroll, { passive: true });
handleNavbarScroll();

// ---------------- Menu mobile ----------------
const burgerBtn = document.getElementById("nav-burger");
const mobileMenu = document.getElementById("mobile-menu");
function closeMobileMenu() { mobileMenu.classList.remove("active"); }
burgerBtn?.addEventListener("click", () => mobileMenu.classList.add("active"));
mobileMenu?.addEventListener("click", (e) => { if (e.target === mobileMenu) closeMobileMenu(); });
mobileMenu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobileMenu));

// ---------------- Fade-up saat scroll ----------------
const fadeEls = document.querySelectorAll(".fade-up");
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);
fadeEls.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  fadeObserver.observe(el);
});

// ---------------- Kartu ikon interaktif (Keahlian & Tools) ----------------
document.querySelectorAll(".skill-icon-card").forEach((card) => {
  card.addEventListener("click", () => {
    const sedangTerbuka = card.classList.contains("open");

    // Tutup kartu lain agar animasi buka tetap fokus satu per satu
    document.querySelectorAll(".skill-icon-card.open").forEach((other) => {
      if (other !== card) other.classList.remove("open");
    });

    card.classList.toggle("open", !sedangTerbuka);
    if (!sedangTerbuka) {
      card.classList.remove("just-opened");
      // Trigger reflow supaya animasi ripple bisa diputar ulang
      void card.offsetWidth;
      card.classList.add("just-opened");
    }
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.click(); }
  });
});

// ---------------- Smooth scroll untuk anchor link ----------------
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (targetId.length <= 1) return;
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;
    e.preventDefault();
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ---------------- Highlight link navbar sesuai section aktif ----------------
const sections = document.querySelectorAll("section[id]");
const navLinkEls = document.querySelectorAll(".n-links a[href^='#']");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinkEls.forEach((link) => {
          link.classList.toggle("active-link", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((sec) => sectionObserver.observe(sec));

// ---------------- Kebab menu (titik tiga) ----------------
const kebabBtn = document.getElementById("nav-kebab");
const kebabDropdown = document.getElementById("kebab-dropdown");

function closeKebabDropdown() {
  kebabDropdown?.classList.remove("active");
  kebabBtn?.classList.remove("active");
  kebabBtn?.setAttribute("aria-expanded", "false");
}
kebabBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  const willOpen = !kebabDropdown.classList.contains("active");
  kebabDropdown.classList.toggle("active", willOpen);
  kebabBtn.classList.toggle("active", willOpen);
  kebabBtn.setAttribute("aria-expanded", String(willOpen));
});
document.addEventListener("click", (e) => {
  if (kebabDropdown && !kebabDropdown.contains(e.target) && e.target !== kebabBtn) closeKebabDropdown();
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeKebabDropdown(); });

// Aksi "Salin Email" di dropdown kebab
document.querySelectorAll(".kebab-item[href^='mailto:']").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const email = item.getAttribute("href").replace("mailto:", "");
    navigator.clipboard?.writeText(email).then(() => {
      const label = item.querySelector("svg").nextSibling;
      if (label) label.textContent = " Email disalin!";
      setTimeout(() => { if (label) label.textContent = " Salin Email"; }, 1800);
    });
    closeKebabDropdown();
  });
});

// ---------------- Marquee bahasa & tools (auto-scroll) ----------------
const MARQUEE_ICONS = {
  html: '<path d="m3 2 1.6 18L12 22l7.4-2L21 2H3Z"/><path d="M7 6h10l-.4 5H8.4l.3 3.5 3.3 1 3.3-1 .3-3"/>',
  css: '<path d="m3 2 1.6 18L12 22l7.4-2L21 2H3Z"/><path d="M7 6h10l-.4 4.5H9l.2 2.5h7.4l-.5 5-3.6 1.1-3.6-1.1-.2-2.5"/>',
  javascript: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 15c0 1.5 1 2.2 2 2.2s1.8-.7 1.8-2.2V9M16.5 12c-1.3-1-3-.7-3 .5s1.5 1.2 3 1.7 2 1.5.3 2.5-3.3.2-3.3.2"/>',
  python: '<path d="M12 2a4 4 0 0 0-4 4v2h8V7a4 4 0 0 0-4-5Z"/><path d="M8 8H5a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h3"/><path d="M12 22a4 4 0 0 0 4-4v-2H8v1a4 4 0 0 0 4 5Z"/><path d="M16 16h3a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3h-3"/>',
  react: '<circle cx="12" cy="12" r="1.8"/><ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/>',
  nodejs: '<path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"/><path d="M9 12h6M9 15h4"/>',
  git: '<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="17" cy="12" r="2.2"/><path d="M6 8.2V15.8M8 6h4a5 5 0 0 1 5 5v-.2"/>',
  firebase: '<path d="M4 20 6.5 3l4 8.5L13 8l7 12-8 3-8-3Z"/>',
  json: '<path d="M6 3a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2M18 3a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2"/>',
  github: '<path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.54 2.87 8.38 6.84 9.74.5.1.68-.22.68-.5 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .28.18.61.69.5A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/>',
  chartjs: '<path d="M12 20V10M18 20V4M6 20v-6"/>',
};

const MARQUEE_ROW_1 = [
  { name: "HTML", icon: "html" },
  { name: "CSS", icon: "css" },
  { name: "JavaScript", icon: "javascript" },
  { name: "Firebase", icon: "firebase" },
  { name: "Git", icon: "git" },
  { name: "GitHub API", icon: "github" },
];
const MARQUEE_ROW_2 = [
  { name: "JSON", icon: "json" },
  { name: "Node.js", icon: "nodejs" },
  { name: "Python", icon: "python" },
  { name: "React", icon: "react" },
  { name: "Chart.js", icon: "chartjs" },
];

function buildMarqueePill(item) {
  return `
    <div class="marquee-pill">
      <span class="mp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${MARQUEE_ICONS[item.icon]}</svg></span>
      ${item.name}
    </div>
  `;
}

function fillMarqueeRow(elId, items) {
  const el = document.getElementById(elId);
  if (!el) return;
  // Konten digandakan 2x agar animasi translateX(-50%) terlihat menyambung tanpa jeda (infinite loop)
  const html = items.map(buildMarqueePill).join("") + items.map(buildMarqueePill).join("");
  el.innerHTML = html;
}
fillMarqueeRow("marquee-row-1", MARQUEE_ROW_1);
fillMarqueeRow("marquee-row-2", MARQUEE_ROW_2);

// ---------------- Tahun footer otomatis ----------------
const yearEl = document.getElementById("current-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
