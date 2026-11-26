const body = document.body;
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const header = document.querySelector("[data-header]");
const currentPage = body.dataset.page;
const pageLinks = [...document.querySelectorAll(".nav-links a[href$='.html']")];

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

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
