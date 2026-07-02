/**
 * generate-placeholders.js
 * ------------------------
 * Generates one elegant SVG placeholder per product in data/products.json.
 * Run with: node admin/generate-placeholders.js
 *
 * These placeholders are meant to be swapped out later with real product
 * photos. Just replace the file at the same path (images/products/<id>.svg
 * becomes images/products/<id>.jpg, and update the "image" field in
 * products.json), or use the admin tool once it's wired up.
 */

const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "products.json");
const outDir = path.join(__dirname, "..", "images", "products");

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// Pick a silhouette shape based on category so the placeholder at least
// hints at what kind of product it is.
function shapeFor(category) {
  if (["scented-candles"].includes(category)) return "candle";
  if (["reed-diffusers"].includes(category)) return "diffuser";
  if (["essential-oils", "aroma-oils"].includes(category)) return "oil-dropper";
  if (["wax-melts"].includes(category)) return "wax-melt";
  if (["gift-sets"].includes(category)) return "gift-box";
  if (["roll-on-perfumes"].includes(category)) return "roll-on";
  if (["car-fresheners", "wardrobe-fresheners"].includes(category)) return "hanging";
  if (["body-oil-perfumes"].includes(category)) return "oil-bottle";
  return "spray-bottle"; // default for sprays, mists, splashes, EDP/EDT, hair perfume, etc.
}

// Soft, premium gradient pairs (cream/gold/charcoal family)
const palettes = [
  ["#F8F3EC", "#E8D9BE"],
  ["#FBF7F0", "#D9C28A"],
  ["#F5EFE4", "#C7A45D"],
  ["#FAF6EF", "#E2C792"],
  ["#F6F1E8", "#CDB07A"]
];

function paletteFor(index) {
  return palettes[index % palettes.length];
}

function wrapText(text, maxCharsPerLine = 18) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxCharsPerLine) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) lines.push(current);
  return lines;
}

function silhouette(shape, accent) {
  switch (shape) {
    case "candle":
      return `
        <rect x="160" y="190" width="80" height="110" rx="6" fill="${accent}" opacity="0.85"/>
        <rect x="160" y="190" width="80" height="14" rx="4" fill="${accent}"/>
        <line x1="200" y1="190" x2="200" y2="168" stroke="#3A3A3A" stroke-width="2"/>
        <ellipse cx="200" cy="160" rx="5" ry="9" fill="#3A3A3A"/>
      `;
    case "diffuser":
      return `
        <path d="M170 260 L170 220 Q170 200 200 200 Q230 200 230 220 L230 260 Z" fill="${accent}" opacity="0.85"/>
        <line x1="185" y1="200" x2="175" y2="120" stroke="#9C8657" stroke-width="3"/>
        <line x1="200" y1="200" x2="200" y2="110" stroke="#9C8657" stroke-width="3"/>
        <line x1="215" y1="200" x2="225" y2="120" stroke="#9C8657" stroke-width="3"/>
      `;
    case "oil-dropper":
      return `
        <rect x="180" y="200" width="40" height="80" rx="8" fill="${accent}" opacity="0.85"/>
        <rect x="188" y="160" width="24" height="44" rx="4" fill="${accent}"/>
        <rect x="192" y="130" width="16" height="34" rx="3" fill="#3A3A3A"/>
      `;
    case "wax-melt":
      return `
        <rect x="160" y="220" width="32" height="32" rx="4" fill="${accent}" opacity="0.85"/>
        <rect x="200" y="220" width="32" height="32" rx="4" fill="${accent}" opacity="0.7"/>
        <rect x="180" y="190" width="32" height="32" rx="4" fill="${accent}"/>
      `;
    case "gift-box":
      return `
        <rect x="155" y="200" width="90" height="70" rx="4" fill="${accent}" opacity="0.85"/>
        <rect x="155" y="200" width="90" height="14" fill="${accent}"/>
        <rect x="194" y="190" width="12" height="80" fill="#3A3A3A" opacity="0.5"/>
        <rect x="155" y="232" width="90" height="12" fill="#3A3A3A" opacity="0.5"/>
      `;
    case "roll-on":
      return `
        <rect x="185" y="210" width="30" height="70" rx="6" fill="${accent}" opacity="0.85"/>
        <ellipse cx="200" cy="208" rx="15" ry="6" fill="#3A3A3A" opacity="0.6"/>
      `;
    case "hanging":
      return `
        <line x1="200" y1="120" x2="200" y2="150" stroke="#9C8657" stroke-width="2"/>
        <path d="M170 150 Q200 130 230 150 L222 220 Q200 235 178 220 Z" fill="${accent}" opacity="0.85"/>
      `;
    case "oil-bottle":
      return `
        <path d="M182 220 L182 270 Q182 280 192 280 L208 280 Q218 280 218 270 L218 220 Z" fill="${accent}" opacity="0.85"/>
        <rect x="190" y="180" width="20" height="42" rx="3" fill="${accent}"/>
        <rect x="192" y="165" width="16" height="18" rx="2" fill="#3A3A3A"/>
      `;
    default: // spray-bottle
      return `
        <rect x="178" y="210" width="44" height="80" rx="8" fill="${accent}" opacity="0.85"/>
        <rect x="188" y="180" width="24" height="34" rx="3" fill="${accent}"/>
        <rect x="192" y="160" width="16" height="22" rx="2" fill="#3A3A3A"/>
        <rect x="178" y="158" width="44" height="8" rx="3" fill="#3A3A3A" opacity="0.7"/>
      `;
  }
}

let count = 0;
data.products.forEach((product, index) => {
  const [light, gold] = paletteFor(index);
  const shape = shapeFor(product.category);
  const lines = wrapText(product.name);
  const lineHeight = 22;
  const startY = 340;

  const textLines = lines
    .map(
      (line, i) =>
        `<text x="200" y="${startY + i * lineHeight}" text-anchor="middle" font-family="Poppins, sans-serif" font-size="17" fill="#3A3A3A" font-weight="500">${escapeXml(
          line
        )}</text>`
    )
    .join("\n");

  const svg = `<svg width="400" height="500" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(
    product.name
  )} placeholder image">
  <defs>
    <linearGradient id="bg-${product.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${light}"/>
      <stop offset="100%" stop-color="#FFFFFF"/>
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="url(#bg-${product.id})"/>
  <circle cx="200" cy="230" r="120" fill="${gold}" opacity="0.18"/>
  ${silhouette(shape, gold)}
  ${textLines}
  <text x="200" y="${startY + lines.length * lineHeight + 18}" text-anchor="middle" font-family="Poppins, sans-serif" font-size="11" fill="#9C8657" letter-spacing="2">D-SCENTS &amp; FRAGRANCES</text>
</svg>`;

  const outPath = path.join(outDir, `${product.id}.svg`);
  fs.writeFileSync(outPath, svg, "utf8");
  count++;
});

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

console.log(`Generated ${count} placeholder images in ${outDir}`);
