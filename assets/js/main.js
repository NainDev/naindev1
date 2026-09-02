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

// ---------------- Marquee bahasa & tools (auto-scroll, pakai logo asli) ----------------
// Logo diambil dari Simple Icons (https://simpleicons.org) via CDN publik cdn.simpleicons.org
const MARQUEE_ROW_1 = [
  { name: "HTML5", slug: "html5", color: "E34F26" },
  { name: "CSS3", slug: "css3", color: "1572B6" },
  { name: "JavaScript", slug: "javascript", color: "F7DF1E" },
  { name: "Firebase", slug: "firebase", color: "FFCA28" },
  { name: "Git", slug: "git", color: "F05032" },
  { name: "GitHub", slug: "github", color: "181717" },
];
const MARQUEE_ROW_2 = [
  { name: "JSON", slug: "json", color: "000000" },
  { name: "Node.js", slug: "nodedotjs", color: "339933" },
  { name: "Python", slug: "python", color: "3776AB" },
  { name: "React", slug: "react", color: "61DAFB" },
  { name: "Chart.js", slug: "chartdotjs", color: "FF6384" },
];

function buildMarqueePill(item) {
  return `
    <div class="marquee-pill">
      <span class="mp-icon"><img src="https://cdn.simpleicons.org/${item.slug}/${item.color}" alt="${item.name}" loading="lazy" /></span>
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
