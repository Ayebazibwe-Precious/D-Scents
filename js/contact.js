/**
 * contact.js
 * ----------
 * Validates the contact form, then "submits" it by opening the user's
 * email client with a pre-filled message (since there's no backend to
 * receive form posts). Shows inline errors for invalid fields and a
 * success message once the mailto link is ready.
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      submitViaEmail(form);
    }
  });

  // Clear error state as the user fixes a field
  form.querySelectorAll(".form-control").forEach((field) => {
    field.addEventListener("input", () => {
      field.classList.remove("invalid");
    });
  });
});

function validateForm(form) {
  let isValid = true;

  const name = form.querySelector("#contact-name");
  const email = form.querySelector("#contact-email");
  const subject = form.querySelector("#contact-subject");
  const message = form.querySelector("#contact-message");

  if (!name.value.trim()) {
    markInvalid(name);
    isValid = false;
  }

  if (!email.value.trim() || !isValidEmail(email.value.trim())) {
    markInvalid(email);
    isValid = false;
  }

  if (!subject.value.trim()) {
    markInvalid(subject);
    isValid = false;
  }

  if (!message.value.trim()) {
    markInvalid(message);
    isValid = false;
  }

  return isValid;
}

function markInvalid(field) {
  field.classList.add("invalid");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function submitViaEmail(form) {
  const name = form.querySelector("#contact-name").value.trim();
  const email = form.querySelector("#contact-email").value.trim();
  const phone = form.querySelector("#contact-phone").value.trim();
  const subject = form.querySelector("#contact-subject").value.trim();
  const message = form.querySelector("#contact-message").value.trim();

  const bodyLines = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    "",
    message,
  ].filter((line) => line !== null);

  const mailtoUrl = buildEmailLink(
    `Website Inquiry: ${subject}`,
    bodyLines.join("\n"),
  );

  const successBox = document.getElementById("form-success");
  successBox.classList.add("visible");
  successBox.innerHTML = `Thanks, ${escapeHtmlLocal(
    name,
  )}! Click below to send your message through your email app.<br><br><a href="${mailtoUrl}" class="btn btn-email btn-sm">Open Email to Send</a>`;

  // Also attempt to open it automatically
  window.location.href = mailtoUrl;

  successBox.scrollIntoView({ behavior: "smooth", block: "center" });
}

function escapeHtmlLocal(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
