/* ================================================
   script.js — Mangalam HDPE Pipes Product Page
   Features:
     1. Sticky navbar shadow on scroll
     2. Mobile hamburger menu toggle
     3. Image carousel (prev / next + drag)
     4. Thumbnail click sync
     5. Auto-play carousel
================================================ */

(function () {
  'use strict';

  /* ── 1. STICKY NAVBAR ──────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load


  /* ── 2. HAMBURGER MENU ─────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    this.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });


  /* ── 3. IMAGE CAROUSEL ─────────────────────── */
  const track      = document.getElementById('carouselTrack');
  const slides     = track.querySelectorAll('.carousel__slide');
  const prevBtn    = document.getElementById('prevBtn');
  const nextBtn    = document.getElementById('nextBtn');
  const thumbItems = document.querySelectorAll('.thumb');

  let current    = 0;
  const total    = slides.length;
  let autoTimer  = null;

  /**
   * Move carousel to a specific slide index.
   * @param {number} index
   */
  function goTo(index) {
    // Wrap around
    current = (index + total) % total;

    // Slide the track
    track.style.transform = `translateX(-${current * 100}%)`;

    // Update active thumbnail
    thumbItems.forEach(function (t, i) {
      t.classList.toggle('active', i === current);
    });
  }

  // Arrow buttons
  prevBtn.addEventListener('click', function () {
    goTo(current - 1);
    resetAutoPlay();
  });

  nextBtn.addEventListener('click', function () {
    goTo(current + 1);
    resetAutoPlay();
  });


  /* ── 4. THUMBNAIL CLICKS ───────────────────── */
  thumbItems.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      const idx = parseInt(this.dataset.index, 10);
      goTo(idx);
      resetAutoPlay();
    });
  });


  /* ── 5. AUTO-PLAY (4 s interval) ──────────── */
  function startAutoPlay() {
    autoTimer = setInterval(function () {
      goTo(current + 1);
    }, 4000);
  }

  function resetAutoPlay() {
    clearInterval(autoTimer);
    startAutoPlay();
  }

  startAutoPlay();


  /* ── 6. SWIPE / DRAG SUPPORT ───────────────── */
  const carouselEl = track.closest('.carousel');
  let touchStartX  = 0;
  let isDragging   = false;

  carouselEl.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    isDragging = true;
  }, { passive: true });

  carouselEl.addEventListener('touchend', function (e) {
    if (!isDragging) return;
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAutoPlay();
    }
    isDragging = false;
  });

  // Mouse drag
  let mouseStartX = 0;
  let isMouseDown = false;

  carouselEl.addEventListener('mousedown', function (e) {
    mouseStartX = e.clientX;
    isMouseDown = true;
    e.preventDefault();
  });

  carouselEl.addEventListener('mouseup', function (e) {
    if (!isMouseDown) return;
    const diff = mouseStartX - e.clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAutoPlay();
    }
    isMouseDown = false;
  });

  carouselEl.addEventListener('mouseleave', function () {
    isMouseDown = false;
  });


  /* ── 7. KEYBOARD NAVIGATION ────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAutoPlay(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAutoPlay(); }
  });


  /* ── Initial state ─────────────────────────── */
  goTo(0);

})();