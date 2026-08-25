const body = document.body;
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const header = document.querySelector("[data-header]");
const currentPage = body.dataset.page;
const pageLinks = [...document.querySelectorAll(".nav-links a[href$='.html']")];
const placeholderProjectLinks = [...document.querySelectorAll(".project-link.is-placeholder")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Mark the current destination without relying on JavaScript for navigation.
if (currentPage) {
  pageLinks.forEach((link) => {
    const pageName = link.getAttribute("href").replace(".html", "").replace("index", "home");
    const isActive = pageName === currentPage;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
  });
}

function setMenuState(isOpen) {
  body.classList.toggle("nav-open", isOpen);
  navToggle?.setAttribute("aria-expanded", String(isOpen));
  navToggle?.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => setMenuState(!body.classList.contains("nav-open")));

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      setMenuState(false);
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && body.classList.contains("nav-open")) setMenuState(false);
  });
}

placeholderProjectLinks.forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});

// Reveal meaningful groups once; all content remains visible without JavaScript.
const revealItems = [
  ...document.querySelectorAll(
    ".route-card, .faq-card, .project-card, .role-card, .skill-card, .recognition-card, .operating-card, .capability-board article, .decision-loop article, .project-lens, .contact-intent, .contact-grid a, .resume-card, .media-card"
  )
];

if (revealItems.length && !reduceMotion.matches && "IntersectionObserver" in window) {
  revealItems.forEach((item) => item.classList.add("reveal-ready"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -7% 0px", threshold: 0.06 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

// Progressive enhancement for short same-site page transitions. Modified clicks,
// downloads, hashes, external URLs, mail links, and browser history remain native.
const wipe = document.createElement("div");
wipe.className = "page-wipe";
wipe.setAttribute("aria-hidden", "true");
body.append(wipe);

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link || event.defaultPrevented || reduceMotion.matches) return;
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (link.hasAttribute("download") || link.target === "_blank") return;

  const rawHref = link.getAttribute("href");
  if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) return;

  const destination = new URL(link.href, window.location.href);
  if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;

  event.preventDefault();
  body.classList.add("is-leaving");
  window.setTimeout(() => window.location.assign(destination.href), 220);
});

window.addEventListener("pageshow", () => body.classList.remove("is-leaving"));
