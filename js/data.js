/**
 * data.js
 * -------
 * Shared helpers for loading products.json and rendering product/category
 * cards. Used by index.html, shop.html, and product.html.
 */

let _productsCache = null;

/**
 * Fetches and caches the product catalog.
 * @returns {Promise<{categories: Array, products: Array}>}
 */
async function loadCatalog() {
  if (_productsCache) return _productsCache;
  const res = await fetch("data/products.json");
  if (!res.ok) throw new Error("Failed to load product catalog");
  _productsCache = await res.json();
  return _productsCache;
}

function formatPrice(price, currency = "UGX") {
  return `${currency} ${price.toLocaleString("en-US")}`;
}

function categoryName(categories, categoryId) {
  const cat = categories.find((c) => c.id === categoryId);
  return cat ? cat.name : categoryId;
}

function starString(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

/**
 * Builds the HTML for a single product card.
 */
function productCardHtml(product, categories) {
  const badge = product.bestSeller
    ? '<span class="product-badge">Best Seller</span>'
    : product.newArrival
      ? '<span class="product-badge">New</span>'
      : "";

  return `
    <article class="product-card reveal">
      <a href="product.html?slug=${encodeURIComponent(product.slug)}" aria-label="View details for ${escapeHtml(product.name)}">
        <div class="product-card-image">
          ${badge}
          <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" width="400" height="500">
        </div>
      </a>
      <div class="product-card-body">
        <span class="product-category-tag">${escapeHtml(categoryName(categories, product.category))}</span>
        <h3 class="product-card-name">
          <a href="product.html?slug=${encodeURIComponent(product.slug)}">${escapeHtml(product.name)}</a>
        </h3>
        <p class="product-card-desc">${escapeHtml(product.shortDescription)}</p>
        <div class="product-card-rating" aria-label="Rating: ${product.rating} out of 5">${starString(product.rating)} <span class="visually-hidden">${product.rating} out of 5</span></div>
        <div class="product-card-footer">
          <span class="product-price">${formatPrice(product.price, product.currency)}</span>
          <a href="product.html?slug=${encodeURIComponent(product.slug)}" class="btn btn-secondary btn-sm">View Details</a>
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Renders a list of products into a container element.
 */
function renderProductGrid(container, products, categories) {
  if (!products.length) {
    container.innerHTML = `<p class="text-center" style="grid-column: 1 / -1; color: var(--color-charcoal-soft); padding: 2rem 0;">No products found. Try a different search or filter.</p>`;
    return;
  }
  container.innerHTML = products
    .map((p) => productCardHtml(p, categories))
    .join("");
  observeReveal(container);
}
