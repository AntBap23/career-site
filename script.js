const body = document.body;
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const header = document.querySelector("[data-header]");
const sectionLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
const currentPage = document.body.dataset.page;
const pageLinks = [...document.querySelectorAll(".nav-links a[href$='.html']")];
const placeholderProjectLinks = [...document.querySelectorAll(".project-link.is-placeholder")];
const revealItems = [
  ...document.querySelectorAll(
    ".route-card, .faq-card, .project-card, .role-card, .skill-card, .recognition-card, .operating-card, .capability-board article, .decision-loop article, .project-lens, .contact-intent"
  )
];

if (currentPage) {
  pageLinks.forEach((link) => {
    const pageName = link.getAttribute("href").replace(".html", "").replace("index", "home");
    link.classList.toggle("is-active", pageName === currentPage);
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

placeholderProjectLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
  });
});

if (sectionLinks.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      sectionLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    {
      rootMargin: "-18% 0px -65% 0px",
      threshold: [0.08, 0.25, 0.5]
    }
  );

  document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
}

if (revealItems.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealItems.forEach((item) => item.classList.add("reveal-ready"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

window.addEventListener("scroll", () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
});
