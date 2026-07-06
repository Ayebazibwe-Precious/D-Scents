/**
 * main.js
 * -------
 * Site-wide behavior used on every page: mobile nav toggle,
 * footer year, scroll-reveal init for static content, and
 * wiring up any element with [data-whatsapp-link] / [data-email-link].
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initNavDropdown();
  initMobileSubmenu();
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

  // Close mobile menu when a link is tapped (but not the submenu toggle itself)
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/**
 * Desktop "Shop" dropdown: a chevron button right before the "Shop" link
 * toggles a small panel with category shortcuts (Perfumes, Body Care
 * Scents, Home Fragrances, Best Sellers). Tapping the chevron again, or
 * clicking anywhere outside, closes it. The "Shop" text itself stays a
 * normal link and is unaffected by the dropdown.
 */
function initNavDropdown() {
  const dropdownToggle = document.querySelector(".nav-dropdown-toggle");
  const dropdownPanel = document.querySelector(".nav-dropdown-panel");
  if (!dropdownToggle || !dropdownPanel) return;

  dropdownToggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = dropdownPanel.classList.toggle("open");
    dropdownToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (e) => {
    if (!dropdownPanel.contains(e.target) && e.target !== dropdownToggle) {
      dropdownPanel.classList.remove("open");
      dropdownToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdownPanel.classList.remove("open");
      dropdownToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/**
 * Mobile equivalent of the Shop dropdown: a chevron next to "Shop" inside
 * the mobile menu expands/collapses an indented list of category links.
 */
function initMobileSubmenu() {
  const submenuToggle = document.querySelector(".mobile-dropdown-toggle");
  const submenu = document.querySelector(".mobile-submenu");
  if (!submenuToggle || !submenu) return;

  submenuToggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = submenu.classList.toggle("open");
    submenuToggle.setAttribute("aria-expanded", String(isOpen));
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
