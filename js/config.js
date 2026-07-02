/**
 * D-Scents and Fragrances — Site Configuration
 * ----------------------------------------------
 * This is the ONE place to update business info. Every page pulls from here.
 * Change the phone number, email, or brand name once — it updates everywhere.
 */

const SITE_CONFIG = {
  brandName: "D-Scents and Fragrances",
  tagline: "Luxury Scents, Thoughtfully Crafted",

  // Phone number in international format (no spaces, no leading 0, no +)
  // Used to build wa.me links. Uganda country code is 256.
  whatsappNumber: "256751397754",

  // Display format for showing the number on the Contact page etc.
  whatsappDisplay: "+256 751 397 754",

  email: "ayebazibwemaryprecious@gmail.com",

  // Business hours shown on Contact page / footer
  businessHours: "Mon - Sat: 9:00 AM - 7:00 PM",

  // Social links — replace "#" with real URLs when ready
  social: {
    instagram: "#",
    facebook: "#",
    tiktok: "#"
  },

  // Physical address / area shown on Contact page (placeholder until provided)
  addressLine: "Kampala, Uganda"
};

/**
 * Builds a WhatsApp click-to-chat link with a pre-filled message.
 * @param {string} message - The message to pre-fill.
 * @returns {string} A wa.me URL.
 */
function buildWhatsAppLink(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encoded}`;
}

/**
 * Builds a mailto: link with a pre-filled subject and body.
 * @param {string} subject
 * @param {string} body
 * @returns {string} A mailto URL.
 */
function buildEmailLink(subject, body) {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${SITE_CONFIG.email}?${params.toString()}`;
}

/**
 * Standard WhatsApp order message for a given product name.
 */
function whatsappOrderLink(productName) {
  return buildWhatsAppLink(
    `Hello, I would like to order: ${productName}. Please provide availability and delivery details.`
  );
}

/**
 * Standard email order link for a given product name.
 */
function emailOrderLink(productName) {
  return buildEmailLink(
    `Order Inquiry: ${productName}`,
    `Hello,\n\nI would like to order the following product:\n\n${productName}\n\nPlease let me know availability and delivery details.\n\nThank you.`
  );
}

/**
 * General "contact us" WhatsApp link (no specific product).
 */
function whatsappGeneralLink() {
  return buildWhatsAppLink(`Hello, I'd like to know more about your fragrances.`);
}
