/**
 * main.js
 * -------
 * Site-wide behavior used on every page: mobile nav toggle,
 * footer year, scroll-reveal init for static content, and
 * wiring up any element with [data-whatsapp-link] / [data-email-link].
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  setFooterYear();
  wireGeneralContactLinks();
  observeReveal(document);
});

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".mobile-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close mobile menu when a link is tapped
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setFooterYear() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
}

/**
 * IntersectionObserver-based scroll reveal for elements with .reveal class.
 * Lives here (rather than data.js) because every page uses .reveal elements,
 * not just pages that load the product catalog.
 */
function observeReveal(scope = document) {
  const elements = scope.querySelectorAll(".reveal:not(.visible)");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  elements.forEach((el) => observer.observe(el));
}

/**
 * Wires up any element marked [data-whatsapp-general] or
 * [data-email-general] to the brand's general contact links,
 * using the helpers defined in config.js.
 */
function wireGeneralContactLinks() {
  document.querySelectorAll("[data-whatsapp-general]").forEach((el) => {
    el.href = whatsappGeneralLink();
  });
  document.querySelectorAll("[data-email-general]").forEach((el) => {
    el.href = `mailto:${SITE_CONFIG.email}`;
  });
  document.querySelectorAll("[data-phone-display]").forEach((el) => {
    el.textContent = SITE_CONFIG.whatsappDisplay;
  });
  document.querySelectorAll("[data-email-display]").forEach((el) => {
    el.textContent = SITE_CONFIG.email;
  });
  document.querySelectorAll("[data-brand-name]").forEach((el) => {
    el.textContent = SITE_CONFIG.brandName;
  });
}
