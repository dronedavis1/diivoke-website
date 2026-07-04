// ===================================
// DIIVOKE CREATIVE — SHARED SCRIPT
// ===================================

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Mobile / full menu toggle ---------- */
  const menuBtn = document.querySelector("[data-menu-open]");
  const menuClose = document.querySelector("[data-menu-close]");
  const menuOverlay = document.querySelector(".menu-overlay");

  if (menuBtn && menuOverlay) {
    menuBtn.addEventListener("click", () => menuOverlay.classList.add("open"));
  }
  if (menuClose && menuOverlay) {
    menuClose.addEventListener("click", () => menuOverlay.classList.remove("open"));
  }

  /* ---------- Live clock in nav (Florida, USA - H:MM AM/PM) ---------- */
  const clockEl = document.querySelector("[data-clock]");
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/New_York"
    });
    clockEl.textContent = `Florida, USA - ${timeStr}`;
  }
  updateClock();
  setInterval(updateClock, 30000);

  /* ---------- Generic accordion (service list + FAQ) ---------- */
  document.querySelectorAll("[data-accordion]").forEach((group) => {
    const items = group.querySelectorAll("[data-accordion-item]");
    items.forEach((item) => {
      const trigger = item.querySelector("[data-accordion-trigger]");
      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        // Optional: close siblings for single-open behavior
        if (group.hasAttribute("data-accordion-single")) {
          items.forEach((i) => i.classList.remove("open"));
        }
        item.classList.toggle("open", !isOpen);
      });
    });
  });

  /* ---------- Reviews carousel ---------- */
  const reviewData = window.REVIEWS || [];
  const reviewPhoto = document.querySelector("[data-review-photo]");
  const reviewQuote = document.querySelector("[data-review-quote]");
  const reviewName = document.querySelector("[data-review-name]");
  const reviewRole = document.querySelector("[data-review-role]");
  const prevBtn = document.querySelector("[data-review-prev]");
  const nextBtn = document.querySelector("[data-review-next]");
  let reviewIndex = 0;

  function renderReview() {
    if (!reviewData.length || !reviewQuote) return;
    const r = reviewData[reviewIndex];
    reviewPhoto.src = r.photo;
    reviewPhoto.alt = r.name;
    reviewQuote.textContent = `"${r.quote}"`;
    reviewName.textContent = r.name;
    reviewRole.textContent = r.role;
  }

  if (reviewData.length) {
    renderReview();
    nextBtn?.addEventListener("click", () => {
      reviewIndex = (reviewIndex + 1) % reviewData.length;
      renderReview();
    });
    prevBtn?.addEventListener("click", () => {
      reviewIndex = (reviewIndex - 1 + reviewData.length) % reviewData.length;
      renderReview();
    });
  }

  /* ---------- Contact form (no backend — mailto fallback) ---------- */
  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = contactForm.querySelector("[name=name]").value;
      const email = contactForm.querySelector("[name=email]").value;
      const message = contactForm.querySelector("[name=message]").value;

      const subject = encodeURIComponent(`New project inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

      // TODO: Replace with your real inbox, or swap this for a form service (Formspree, etc.)
      window.location.href = `mailto:hello@diivoke.com?subject=${subject}&body=${body}`;
    });
  }
});
