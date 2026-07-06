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
      const cardRatio = rect.width / rect.height;
      let targetHeight = Math.min(window.innerHeight * 0.85, 640);
      let targetWidth = targetHeight * cardRatio;
      const maxWidth = window.innerWidth * 0.9;
      if (targetWidth > maxWidth) {
        targetWidth = maxWidth;
        targetHeight = targetWidth / cardRatio;
      }
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

  /* ---------- Client project video tabs (multi-video case study pages) ---------- */
  const videoTabsContainer = document.querySelector("[data-video-tabs]");
  const videoTabPlayer = document.querySelector("[data-video-tab-player]");
  const videoTabCaption = document.querySelector("[data-video-tab-caption]");

  if (videoTabsContainer && videoTabPlayer) {
    const videoTabs = videoTabsContainer.querySelectorAll(".video-tab");
    const videoSource = videoTabPlayer.querySelector("source");
    const textGroups = document.querySelectorAll("[data-text-group]");

    videoTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab.classList.contains("active")) return;

        videoTabs.forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        videoSource.src = tab.dataset.videoSrc;
        videoTabPlayer.setAttribute("poster", tab.dataset.videoPoster);
        videoTabPlayer.load();
        videoTabPlayer.play().catch(() => {});

        if (videoTabCaption) videoTabCaption.textContent = tab.dataset.videoCaption;

        if (tab.dataset.textGroup && textGroups.length) {
          textGroups.forEach((g) => g.classList.toggle("active", g.dataset.textGroup === tab.dataset.textGroup));
        }
      });
    });
  }

  /* ---------- Client project video category tabs (nested: category > individual video) ---------- */
  const videoCategoryTabsContainer = document.querySelector("[data-video-category-tabs]");

  if (videoCategoryTabsContainer && videoTabPlayer) {
    const categoryTabs = videoCategoryTabsContainer.querySelectorAll(".video-tab");
    const subGroups = document.querySelectorAll("[data-video-sub-group]");
    const gridGroups = document.querySelectorAll("[data-video-grid-group]");
    const photoGroups = document.querySelectorAll("[data-photo-grid-group]");
    const singlePlayerGroup = videoTabPlayer.closest(".video-tab-player-wrap");
    const videoSource = videoTabPlayer.querySelector("source");

    const loadVideo = (src, poster, caption) => {
      videoSource.src = src;
      videoTabPlayer.setAttribute("poster", poster);
      videoTabPlayer.load();
      videoTabPlayer.play().catch(() => {});
      if (videoTabCaption) videoTabCaption.textContent = caption;
    };

    const activateSubTab = (subTab) => {
      const group = subTab.closest("[data-video-sub-group]");
      group.querySelectorAll(".video-sub-tab").forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      subTab.classList.add("active");
      subTab.setAttribute("aria-selected", "true");
      loadVideo(subTab.dataset.videoSrc, subTab.dataset.videoPoster, subTab.dataset.videoCaption);
    };

    const activateCategory = (tab) => {
      categoryTabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const categoryKey = tab.dataset.categoryTab;
      const gridGroup = document.querySelector(`[data-video-grid-group="${categoryKey}"]`);
      const photoGroup = document.querySelector(`[data-photo-grid-group="${categoryKey}"]`);

      subGroups.forEach((g) => g.classList.toggle("active", g.dataset.videoSubGroup === categoryKey));

      gridGroups.forEach((g) => {
        const isActive = g === gridGroup;
        g.classList.toggle("active", isActive);
        if (!isActive) g.querySelectorAll("video").forEach((v) => v.pause());
      });

      photoGroups.forEach((g) => g.classList.toggle("active", g === photoGroup));

      if (gridGroup) {
        // Grid category (e.g. Media Day): hide the single shared player, videos autoplay on their own.
        if (singlePlayerGroup) singlePlayerGroup.classList.add("is-hidden");
        if (videoTabCaption) videoTabCaption.classList.add("is-hidden");
        videoTabPlayer.pause();
        gridGroup.querySelectorAll("video").forEach((v) => v.play().catch(() => {}));
        return;
      }

      if (photoGroup) {
        // Photo category (e.g. Summer Grant): hide the single shared player, show the photo grid.
        if (singlePlayerGroup) singlePlayerGroup.classList.add("is-hidden");
        if (videoTabCaption) videoTabCaption.classList.add("is-hidden");
        videoTabPlayer.pause();
        return;
      }

      if (singlePlayerGroup) singlePlayerGroup.classList.remove("is-hidden");
      if (videoTabCaption) videoTabCaption.classList.remove("is-hidden");

      if (tab.dataset.videoSrc) {
        // Single-video category: the video data lives directly on the category tab.
        loadVideo(tab.dataset.videoSrc, tab.dataset.videoPoster, tab.dataset.videoCaption);
      } else {
        // Multi-video category: reveal its sub-tabs and load the first one by default.
        const group = document.querySelector(`[data-video-sub-group="${categoryKey}"]`);
        const firstSubTab = group ? group.querySelector(".video-sub-tab") : null;
        if (firstSubTab) activateSubTab(firstSubTab);
      }
    };

    categoryTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab.classList.contains("active")) return;
        activateCategory(tab);
      });
    });

    subGroups.forEach((group) => {
      group.querySelectorAll(".video-sub-tab").forEach((subTab) => {
        subTab.addEventListener("click", () => {
          if (subTab.classList.contains("active")) return;
          activateSubTab(subTab);
        });
      });
    });
  }

  /* ---------- Autoplay-on-view videos with click-to-unmute ---------- */
  const autoplayWraps = document.querySelectorAll(".video-autoplay-wrap");

  if (autoplayWraps.length && "IntersectionObserver" in window) {
    const autoplayObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector("video");
          if (!video) return;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.4 }
    );

    autoplayWraps.forEach((wrap) => {
      const video = wrap.querySelector("video");
      if (!video) return;

      autoplayObserver.observe(wrap);

      const muteBtn = wrap.querySelector("[data-video-mute-toggle]");
      if (muteBtn) {
        muteBtn.addEventListener("click", () => {
          video.muted = !video.muted;
          muteBtn.classList.toggle("is-unmuted", !video.muted);
          muteBtn.setAttribute("aria-pressed", String(!video.muted));
          muteBtn.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
        });
      }
    });
  }

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
