/**
 * generate-extra-placeholders.js
 * -------------------------------
 * Generates category-card placeholders (images/categories/<id>.svg)
 * and the homepage hero background (images/hero/hero-fragrance.svg).
 * Run with: node admin/generate-extra-placeholders.js
 */

const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "products.json");
const catDir = path.join(__dirname, "..", "images", "categories");
const heroDir = path.join(__dirname, "..", "images", "hero");

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

function categorySvg(name) {
  return `<svg width="400" height="500" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(name)} category">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2b2b2b"/>
      <stop offset="100%" stop-color="#4a4a4a"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d9c28a"/>
      <stop offset="100%" stop-color="#b8924f"/>
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="url(#g)"/>
  <circle cx="200" cy="210" r="100" fill="url(#gold)" opacity="0.18"/>
  <rect x="178" y="190" width="44" height="90" rx="8" fill="url(#gold)" opacity="0.9"/>
  <rect x="188" y="160" width="24" height="34" rx="3" fill="url(#gold)"/>
  <rect x="192" y="142" width="16" height="20" rx="2" fill="#1a1a1a"/>
</svg>`;
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const featured = data.categories.filter((c) =>
  ["perfume-sprays", "scented-candles", "reed-diffusers", "gift-sets"].includes(c.id)
);

featured.forEach((cat) => {
  const svg = categorySvg(cat.name);
  fs.writeFileSync(path.join(catDir, `${cat.id}.svg`), svg, "utf8");
});

// Hero background — a wide, moody, elegant gradient scene
const heroSvg = `<svg width="1600" height="900" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Luxury fragrance bottles on a dark elegant background">
  <defs>
    <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a1a1a"/>
      <stop offset="55%" stop-color="#2b2b2b"/>
      <stop offset="100%" stop-color="#3a3024"/>
    </linearGradient>
    <linearGradient id="goldGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d9c28a" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#8f7038" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#heroBg)"/>
  <circle cx="1250" cy="350" r="420" fill="#d9c28a" opacity="0.08"/>
  <circle cx="300" cy="700" r="320" fill="#d9c28a" opacity="0.06"/>

  <!-- Trio of bottle silhouettes -->
  <g opacity="0.85">
    <rect x="1080" y="430" width="70" height="160" rx="10" fill="url(#goldGlow)"/>
    <rect x="1097" y="380" width="36" height="55" rx="4" fill="url(#goldGlow)"/>
    <rect x="1104" y="350" width="22" height="34" rx="3" fill="#1a1a1a"/>
  </g>
  <g opacity="0.65">
    <rect x="1200" y="470" width="56" height="120" rx="8" fill="url(#goldGlow)"/>
    <rect x="1214" y="430" width="28" height="44" rx="3" fill="url(#goldGlow)"/>
  </g>
  <g opacity="0.5">
    <rect x="980" y="490" width="48" height="100" rx="6" fill="url(#goldGlow)"/>
    <rect x="992" y="455" width="24" height="38" rx="3" fill="url(#goldGlow)"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(heroDir, "hero-fragrance.svg"), heroSvg, "utf8");

console.log(`Generated ${featured.length} category placeholders and 1 hero background.`);
