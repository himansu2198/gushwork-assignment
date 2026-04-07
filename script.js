/**
 * script.js — Mangalam HDPE Pipes Product Page
 * ──────────────────────────────────────────────
 * Features:
 *   1. Sticky Navbar — adds .is-scrolled class on scroll
 *   2. Image Carousel — prev/next arrows + thumbnail click
 *   3. Mobile Hamburger Menu — toggle open/close drawer
 *   4. Keyboard accessibility — arrow-key support on carousel
 */

(function () {
  "use strict";

  /* ─────────────────────────────────────────────
     1. STICKY NAVBAR
     Adds a shadow when the user scrolls past the
     top of the page.
  ───────────────────────────────────────────── */
  const navbar = document.getElementById("navbar");

  function handleScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  }

  // Passive listener for better scroll performance
  window.addEventListener("scroll", handleScroll, { passive: true });
  // Run once on load in case page is already scrolled
  handleScroll();


  /* ─────────────────────────────────────────────
     2. IMAGE CAROUSEL
     Slides on prev/next button click.
     Thumbnail buttons sync the active slide.
     Supports keyboard arrow keys.
     Auto-advances every 5 seconds (pauses on hover).
  ───────────────────────────────────────────── */
  const track     = document.getElementById("carouselTrack");
  const slides    = track ? track.querySelectorAll(".carousel__slide") : [];
  const prevBtn   = document.getElementById("prevBtn");
  const nextBtn   = document.getElementById("nextBtn");
  const thumbBtns = document.querySelectorAll(".thumb");

  let currentIndex = 0;
  let autoPlayTimer = null;
  const TOTAL = slides.length;

  /**
   * Move carousel to a given slide index.
   * @param {number} index - Target slide index (0-based)
   */
  function goToSlide(index) {
    // Clamp / wrap index
    if (index < 0)      index = TOTAL - 1;
    if (index >= TOTAL) index = 0;

    currentIndex = index;

    // Translate the track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update thumbnail active states
    thumbBtns.forEach((btn, i) => {
      const isActive = i === currentIndex;
      btn.classList.toggle("thumb--active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    // Update aria-label on carousel region for screen readers
    const carousel = document.getElementById("carousel");
    if (carousel) {
      carousel.setAttribute(
        "aria-label",
        `Product image ${currentIndex + 1} of ${TOTAL}`
      );
    }
  }

  // Previous button
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goToSlide(currentIndex - 1);
      resetAutoPlay();
    });
  }

  // Next button
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goToSlide(currentIndex + 1);
      resetAutoPlay();
    });
  }

  // Thumbnail clicks
  thumbBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index, 10);
      goToSlide(idx);
      resetAutoPlay();
    });
  });

  // Keyboard arrow-key navigation on the carousel
  const carouselEl = document.getElementById("carousel");
  if (carouselEl) {
    carouselEl.setAttribute("tabindex", "0");
    carouselEl.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        goToSlide(currentIndex - 1);
        resetAutoPlay();
      } else if (e.key === "ArrowRight") {
        goToSlide(currentIndex + 1);
        resetAutoPlay();
      }
    });
  }

  /* Auto-play every 5 seconds */
  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayTimer);
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Pause auto-play when user hovers over carousel
  if (carouselEl) {
    carouselEl.addEventListener("mouseenter", stopAutoPlay);
    carouselEl.addEventListener("mouseleave", startAutoPlay);
    carouselEl.addEventListener("focusin",    stopAutoPlay);
    carouselEl.addEventListener("focusout",   startAutoPlay);
  }

  // Swipe / touch support for mobile
  if (track) {
    let touchStartX = 0;
    let touchEndX   = 0;

    track.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const delta = touchStartX - touchEndX;

      if (Math.abs(delta) > 50) {
        // Swipe left → next; swipe right → prev
        goToSlide(currentIndex + (delta > 0 ? 1 : -1));
        resetAutoPlay();
      }
    }, { passive: true });
  }

  // Initialise carousel and auto-play
  if (TOTAL > 0) {
    goToSlide(0);
    startAutoPlay();
  }


  /* ─────────────────────────────────────────────
     3. MOBILE HAMBURGER MENU
     Toggles the mobile drawer open/closed.
  ───────────────────────────────────────────── */
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("is-open");
      hamburger.classList.toggle("is-active", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      mobileMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
    });

    // Close mobile menu when a link inside it is clicked
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        hamburger.classList.remove("is-active");
        hamburger.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target)) {
        mobileMenu.classList.remove("is-open");
        hamburger.classList.remove("is-active");
        hamburger.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
      }
    });
  }


  /* ─────────────────────────────────────────────
     4. SMOOTH SCROLL POLYFILL HELPER
     For any anchor links with #hash targets.
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });


  /* ─────────────────────────────────────────────
     5. FAQ ACCORDION
     - Click trigger to open/close answer panel
     - One item open at a time
     - Smooth max-height animation via CSS
  ───────────────────────────────────────────── */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-item__trigger");
    const body    = item.querySelector(".faq-item__body");

    if (!trigger || !body) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("faq-item--open");

      // Close ALL items first (one-open-at-a-time)
      faqItems.forEach((other) => {
        const otherBody    = other.querySelector(".faq-item__body");
        const otherTrigger = other.querySelector(".faq-item__trigger");

        other.classList.remove("faq-item--open");
        otherTrigger.setAttribute("aria-expanded", "false");

        if (otherBody) {
          otherBody.hidden = true;
        }
      });

      // If this item was closed, open it now
      if (!isOpen) {
        item.classList.add("faq-item--open");
        trigger.setAttribute("aria-expanded", "true");
        body.hidden = false;

        // Scroll item into view if needed (helpful on mobile)
        setTimeout(() => {
          const rect = item.getBoundingClientRect();
          if (rect.top < 80) {
            item.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }, 50);
      }
    });
  });


  /* ─────────────────────────────────────────────
     6. APPLICATIONS CARD SLIDER
     Arrow buttons translate the track by one card.
     Also supports click-drag (mouse) and touch swipe.
  ───────────────────────────────────────────── */
  const appTrack   = document.getElementById("appTrack");
  const appPrevBtn = document.getElementById("appPrev");
  const appNextBtn = document.getElementById("appNext");

  if (appTrack && appPrevBtn && appNextBtn) {
    const CARD_GAP = 20;
    let currentPos = 0;

    function getCardWidth() {
      const card = appTrack.querySelector(".app-card");
      return card ? card.offsetWidth + CARD_GAP : 320;
    }

    function getMaxPos() {
      const wrap    = appTrack.parentElement;
      const total   = appTrack.scrollWidth;
      const visible = wrap.offsetWidth;
      return Math.max(0, total - visible);
    }

    function slideTo(pos) {
      currentPos = Math.max(0, Math.min(pos, getMaxPos()));
      appTrack.style.transform = `translateX(-${currentPos}px)`;
      appPrevBtn.disabled = currentPos <= 0;
      appNextBtn.disabled = currentPos >= getMaxPos();
    }

    appPrevBtn.addEventListener("click", () => slideTo(currentPos - getCardWidth()));
    appNextBtn.addEventListener("click", () => slideTo(currentPos + getCardWidth()));

    // Init
    slideTo(0);

    // Recalculate on resize
    window.addEventListener("resize", () => slideTo(currentPos), { passive: true });

    // Drag to scroll — mouse
    let isDragging = false, dragStartX = 0, dragStartPos = 0;

    appTrack.addEventListener("mousedown", (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartPos = currentPos;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      slideTo(dragStartPos + (dragStartX - e.clientX));
    });

    window.addEventListener("mouseup", () => { isDragging = false; });

    // Swipe — touch
    let touchStartX = 0, touchStartPos = 0;

    appTrack.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartPos = currentPos;
    }, { passive: true });

    appTrack.addEventListener("touchend", (e) => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 40) slideTo(touchStartPos + delta);
    }, { passive: true });
  }


  /* ─────────────────────────────────────────────
     7. MANUFACTURING PROCESS TAB SWITCHER
     Clicking a tab shows its panel, hides others.
     Active tab gets .mfg-tab--active class.
     Panels animate in with CSS keyframe.
  ───────────────────────────────────────────── */
  const mfgTabs   = document.querySelectorAll(".mfg-tab");
  const mfgPanels = document.querySelectorAll(".mfg-panel");

  mfgTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetIndex = tab.dataset.tab;

      // Update tabs — active state
      mfgTabs.forEach((t) => {
        t.classList.remove("mfg-tab--active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("mfg-tab--active");
      tab.setAttribute("aria-selected", "true");

      // Update panels — show matching, hide others
      mfgPanels.forEach((panel) => {
        const isTarget = panel.id === `mfg-panel-${targetIndex}`;
        panel.classList.toggle("mfg-panel--hidden", !isTarget);

        // Re-trigger fade-in animation by removing and re-adding
        if (isTarget) {
          panel.style.animation = "none";
          panel.offsetHeight;   // reflow trigger
          panel.style.animation = "";
        }
      });

      // On mobile, scroll tabs so active is visible
      tab.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
    });
  });

})();