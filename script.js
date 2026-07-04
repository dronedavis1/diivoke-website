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

  /* ---------- Video production category cards: zoom + flip ---------- */
  const categoryOverlay = document.querySelector("[data-category-overlay]");

  function expandCategoryCard(card) {
    if (card.classList.contains("expanded") || card.classList.contains("animating")) return;

    const rect = card.getBoundingClientRect();
    const placeholder = document.createElement("div");
    placeholder.className = "category-card-placeholder";
    placeholder.style.width = `${rect.width}px`;
    placeholder.style.height = `${rect.height}px`;
    card.parentNode.insertBefore(placeholder, card);
    card._placeholder = placeholder;

    document.body.appendChild(card);
    card.style.position = "fixed";
    card.style.top = `${rect.top}px`;
    card.style.left = `${rect.left}px`;
    card.style.width = `${rect.width}px`;
    card.style.height = `${rect.height}px`;
    card.style.margin = "0";

    card.classList.add("expanded");
    card.setAttribute("aria-expanded", "true");

    // Force a reflow so the browser registers the starting position
    // before we enable the transition and animate to the target size.
    void card.offsetWidth;

    card.classList.add("animating");
    requestAnimationFrame(() => {
      const targetWidth = Math.min(window.innerWidth * 0.9, 720);
      const targetHeight = Math.min(window.innerHeight * 0.85, 640);
      card.style.top = `${(window.innerHeight - targetHeight) / 2}px`;
      card.style.left = `${(window.innerWidth - targetWidth) / 2}px`;
      card.style.width = `${targetWidth}px`;
      card.style.height = `${targetHeight}px`;
      card.classList.add("flipped");
    });

    categoryOverlay?.classList.add("visible");
    card.querySelector(".category-card-close")?.focus();
  }

  function collapseCategoryCard(card) {
    if (!card.classList.contains("expanded") || !card._placeholder) return;

    const rect = card._placeholder.getBoundingClientRect();
    card.classList.remove("flipped");
    card.style.top = `${rect.top}px`;
    card.style.left = `${rect.left}px`;
    card.style.width = `${rect.width}px`;
    card.style.height = `${rect.height}px`;
    card.setAttribute("aria-expanded", "false");

    categoryOverlay?.classList.remove("visible");

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      card.removeEventListener("transitionend", onTransitionEnd);
      clearTimeout(fallbackTimer);
      card.classList.remove("expanded", "animating");
      card.style.position = "";
      card.style.top = "";
      card.style.left = "";
      card.style.width = "";
      card.style.height = "";
      card.style.margin = "";
      if (card._placeholder) {
        card._placeholder.parentNode.insertBefore(card, card._placeholder);
        card._placeholder.remove();
        card._placeholder = null;
      }
      card.focus();
    };
    const onTransitionEnd = (e) => {
      if (e.target === card && e.propertyName === "width") cleanup();
    };
    // Fallback in case transitionend doesn't fire (e.g. a backgrounded tab
    // throttling the animation) so the card can never get stuck mid-collapse.
    const fallbackTimer = setTimeout(cleanup, 600);
    card.addEventListener("transitionend", onTransitionEnd);
  }

  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".category-card-close")) return;
      expandCategoryCard(card);
    });
    card.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && !card.classList.contains("expanded")) {
        e.preventDefault();
        expandCategoryCard(card);
      }
    });
    card.querySelector(".category-card-close")?.addEventListener("click", (e) => {
      e.stopPropagation();
      collapseCategoryCard(card);
    });
  });

  categoryOverlay?.addEventListener("click", () => {
    const openCard = document.querySelector(".category-card.expanded");
    if (openCard) collapseCategoryCard(openCard);
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

      // TODO: swap this for a form service (Formspree, etc.) if a JS-free fallback isn't needed
      window.location.href = `mailto:diivokecreative@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
