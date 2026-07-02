/**
 * shop.js
 * -------
 * Powers the shop page: category checkboxes, quick filters (all/bestsellers/new),
 * search, sorting, and "Load More" pagination. Reads initial state from the URL
 * (?category=, ?group=, ?filter=) so links from the homepage/footer pre-filter
 * the page correctly.
 */

const PAGE_SIZE = 9;

const state = {
  categories: [],
  products: [],
  selectedCategories: new Set(),
  quickFilter: "all", // all | bestsellers | new
  searchTerm: "",
  sortBy: "featured",
  visibleCount: PAGE_SIZE,
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const catalog = await loadCatalog();
    state.categories = catalog.categories;
    state.products = catalog.products;

    applyUrlParams();
    renderCategoryFilters();
    wireControls();
    renderResults();
  } catch (err) {
    console.error(err);
    const grid = document.getElementById("product-grid");
    if (grid) {
      grid.innerHTML = `<p class="text-center" style="grid-column:1/-1;">We couldn't load the catalog right now. Please refresh the page.</p>`;
    }
  }
});

function applyUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const group = params.get("group");
  const filter = params.get("filter");

  if (category) {
    state.selectedCategories.add(category);
  }
  if (group) {
    state.categories
      .filter((c) => c.group === group)
      .forEach((c) => state.selectedCategories.add(c.id));
  }
  if (filter === "bestsellers") {
    state.quickFilter = "bestsellers";
  } else if (filter === "new") {
    state.quickFilter = "new";
  }
}

function renderCategoryFilters() {
  const personalContainer = document.getElementById("personal-categories");
  const homeContainer = document.getElementById("home-categories");

  const personal = state.categories.filter((c) => c.group === "personal");
  const home = state.categories.filter((c) => c.group === "home");

  personalContainer.innerHTML = personal
    .map((c) => categoryCheckboxHtml(c))
    .join("");
  homeContainer.innerHTML = home.map((c) => categoryCheckboxHtml(c)).join("");

  document.querySelectorAll(".category-checkbox").forEach((box) => {
    box.addEventListener("change", (e) => {
      const id = e.target.value;
      if (e.target.checked) {
        state.selectedCategories.add(id);
      } else {
        state.selectedCategories.delete(id);
      }
      state.visibleCount = PAGE_SIZE;
      renderResults();
    });
  });
}

function categoryCheckboxHtml(cat) {
  const checked = state.selectedCategories.has(cat.id) ? "checked" : "";
  return `
    <label class="filter-option">
      <input type="checkbox" class="category-checkbox" value="${cat.id}" ${checked}>
      ${escapeHtml(cat.name)}
    </label>
  `;
}

function wireControls() {
  // Quick filter radios
  document.querySelectorAll('input[name="quickFilter"]').forEach((radio) => {
    if (radio.value === state.quickFilter) radio.checked = true;
    radio.addEventListener("change", (e) => {
      state.quickFilter = e.target.value;
      state.visibleCount = PAGE_SIZE;
      renderResults();
    });
  });

  // Search
  const searchInput = document.getElementById("search-input");
  let debounceTimer;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.searchTerm = e.target.value.trim().toLowerCase();
      state.visibleCount = PAGE_SIZE;
      renderResults();
    }, 200);
  });

  // Sort
  const sortSelect = document.getElementById("sort-select");
  sortSelect.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderResults();
  });

  // Clear filters
  document.getElementById("clear-filters").addEventListener("click", () => {
    state.selectedCategories.clear();
    state.quickFilter = "all";
    state.searchTerm = "";
    state.sortBy = "featured";
    state.visibleCount = PAGE_SIZE;
    searchInput.value = "";
    sortSelect.value = "featured";
    document
      .querySelectorAll('input[name="quickFilter"]')
      .forEach((r) => (r.checked = r.value === "all"));
    renderCategoryFilters();
    renderResults();
  });

  // Load more
  document.getElementById("load-more-btn").addEventListener("click", () => {
    state.visibleCount += PAGE_SIZE;
    renderResults(true);
  });

  // Mobile filter toggle
  const mobileToggle = document.getElementById("mobile-filter-toggle");
  const filterPanel = document.getElementById("filter-panel");
  mobileToggle.addEventListener("click", () => {
    const isOpen = filterPanel.classList.toggle("open");
    mobileToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function getFilteredProducts() {
  let results = state.products.slice();

  if (state.quickFilter === "bestsellers") {
    results = results.filter((p) => p.bestSeller);
  } else if (state.quickFilter === "new") {
    results = results.filter((p) => p.newArrival);
  }

  if (state.selectedCategories.size > 0) {
    results = results.filter((p) => state.selectedCategories.has(p.category));
  }

  if (state.searchTerm) {
    results = results.filter((p) => {
      const haystack =
        `${p.name} ${p.shortDescription} ${p.fragranceFamily}`.toLowerCase();
      return haystack.includes(state.searchTerm);
    });
  }

  switch (state.sortBy) {
    case "price-asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "rating-desc":
      results.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // "featured": best sellers first, then new arrivals, then the rest
      results.sort((a, b) => {
        const score = (p) => (p.bestSeller ? 2 : 0) + (p.newArrival ? 1 : 0);
        return score(b) - score(a);
      });
  }

  return results;
}

function renderResults(isLoadMore = false) {
  const filtered = getFilteredProducts();
  const visible = filtered.slice(0, state.visibleCount);
  const grid = document.getElementById("product-grid");
  const loadMoreBtn = document.getElementById("load-more-btn");
  const resultsCount = document.getElementById("results-count");

  renderProductGrid(grid, visible, state.categories);

  resultsCount.textContent = filtered.length
    ? `Showing ${visible.length} of ${filtered.length} product${filtered.length === 1 ? "" : "s"}`
    : "";

  loadMoreBtn.style.display =
    visible.length < filtered.length ? "inline-flex" : "none";

  renderActiveFilterChips();

  if (!isLoadMore) {
    window.scrollTo({ top: grid.offsetTop - 120, behavior: "smooth" });
  }
}

function renderActiveFilterChips() {
  const container = document.getElementById("active-filters");
  const chips = [];

  if (state.quickFilter !== "all") {
    const label =
      state.quickFilter === "bestsellers" ? "Best Sellers" : "New Arrivals";
    chips.push({
      label,
      onRemove: () => {
        state.quickFilter = "all";
        syncQuickFilterRadios();
      },
    });
  }

  state.selectedCategories.forEach((catId) => {
    const cat = state.categories.find((c) => c.id === catId);
    if (cat) {
      chips.push({
        label: cat.name,
        onRemove: () => {
          state.selectedCategories.delete(catId);
          renderCategoryFilters();
        },
      });
    }
  });

  if (state.searchTerm) {
    chips.push({
      label: `"${state.searchTerm}"`,
      onRemove: () => {
        state.searchTerm = "";
        document.getElementById("search-input").value = "";
      },
    });
  }

  if (!chips.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = chips
    .map(
      (chip, i) => `
      <span class="filter-chip">
        ${escapeHtml(chip.label)}
        <button type="button" data-chip-index="${i}" aria-label="Remove filter: ${escapeHtml(chip.label)}">&times;</button>
      </span>`,
    )
    .join("");

  container.querySelectorAll("button[data-chip-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.chipIndex);
      chips[index].onRemove();
      state.visibleCount = PAGE_SIZE;
      renderResults();
    });
  });
}

function syncQuickFilterRadios() {
  document.querySelectorAll('input[name="quickFilter"]').forEach((r) => {
    r.checked = r.value === state.quickFilter;
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
