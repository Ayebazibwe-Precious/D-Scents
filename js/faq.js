/**
 * faq.js
 * ------
 * Powers the FAQ accordion (expand/collapse, one or many open) and the
 * live search box that filters questions/answers as the user types.
 */

document.addEventListener("DOMContentLoaded", () => {
  wireAccordion();
  wireFaqSearch();
});

function wireAccordion() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector(".faq-question");
    button.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", String(!isOpen));
      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

function wireFaqSearch() {
  const input = document.getElementById("faq-search-input");
  const emptyState = document.getElementById("faq-empty");
  if (!input) return;

  let debounceTimer;
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const term = input.value.trim().toLowerCase();
      filterFaqs(term, emptyState);
    }, 150);
  });
}

function filterFaqs(term, emptyState) {
  const items = document.querySelectorAll(".faq-item");
  const titles = document.querySelectorAll(".faq-category-title");
  let anyVisible = false;
  const visibleGroups = new Set();

  items.forEach((item) => {
    const questionText = item
      .querySelector(".faq-question span")
      .textContent.toLowerCase();
    const answerText = item
      .querySelector(".faq-answer p")
      .textContent.toLowerCase();
    const matches =
      !term || questionText.includes(term) || answerText.includes(term);

    item.style.display = matches ? "" : "none";
    if (matches) {
      anyVisible = true;
      visibleGroups.add(item.dataset.faqGroup);
      // Auto-expand matches when actively searching so the match is visible
      if (term) {
        item.setAttribute("data-open", "true");
        item
          .querySelector(".faq-question")
          .setAttribute("aria-expanded", "true");
      } else {
        item.setAttribute("data-open", "false");
        item
          .querySelector(".faq-question")
          .setAttribute("aria-expanded", "false");
      }
    }
  });

  titles.forEach((title) => {
    title.style.display = visibleGroups.has(title.dataset.faqGroup)
      ? ""
      : "none";
  });

  emptyState.style.display = anyVisible ? "none" : "block";
}
