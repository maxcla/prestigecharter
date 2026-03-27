/* =========================================================
   PRESTIGE CHARTER — Main JavaScript
   © 2025 Prestige Charter AT
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     0. PRELOADER
     --------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        preloader.classList.add('is-hidden');
        document.body.classList.add('is-loaded');
      }, 600);
    });
    // Fallback — force hide after 4s
    setTimeout(function () {
      if (preloader && !preloader.classList.contains('is-hidden')) {
        preloader.classList.add('is-hidden');
        document.body.classList.add('is-loaded');
      }
    }, 4000);
  }

  /* ---------------------------------------------------------
     1. HEADER — Opaque on scroll
     --------------------------------------------------------- */
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    if (!header) return;
    const y = window.scrollY;
    if (y > 60) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    lastScroll = y;
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ---------------------------------------------------------
     2. MOBILE MENU
     --------------------------------------------------------- */
  const burger = document.getElementById('nav-burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-menu-close');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function openMobile() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    burger && burger.setAttribute('aria-expanded', 'true');
  }
  function closeMobile() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
    burger && burger.setAttribute('aria-expanded', 'false');
  }

  burger && burger.addEventListener('click', function () {
    mobileMenu.classList.contains('is-open') ? closeMobile() : openMobile();
  });
  mobileClose && mobileClose.addEventListener('click', closeMobile);
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobile);
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobile();
      closeLightbox();
    }
  });

  /* ---------------------------------------------------------
     3. SMOOTH SCROLL
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = header ? header.offsetHeight + 10 : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------------------------------------------------------
     4. SCROLL REVEAL (Intersection Observer)
     --------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all
    revealEls.forEach(function (el) {
      el.classList.add('is-revealed');
    });
  }

  /* ---------------------------------------------------------
     5. LIGHTBOX GALLERY
     --------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');
  var lightboxCounter = document.getElementById('lightbox-counter');
  var galleryItems = document.querySelectorAll('[data-lightbox]');
  var currentLightboxIndex = 0;
  var lightboxImages = [];

  // Build array
  galleryItems.forEach(function (item, i) {
    lightboxImages.push({
      src: item.getAttribute('data-lightbox'),
      caption: item.getAttribute('data-caption') || ''
    });
    item.addEventListener('click', function (e) {
      e.preventDefault();
      openLightbox(i);
    });
  });

  function openLightbox(index) {
    if (!lightbox || !lightboxImages.length) return;
    currentLightboxIndex = index;
    updateLightbox();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    if (!lightboxImg) return;
    var item = lightboxImages[currentLightboxIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption;
    if (lightboxCaption) lightboxCaption.textContent = item.caption;
    if (lightboxCounter) {
      lightboxCounter.textContent = (currentLightboxIndex + 1) + ' / ' + lightboxImages.length;
    }
  }

  function nextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
    updateLightbox();
  }

  function prevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightbox();
  }

  lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext && lightboxNext.addEventListener('click', nextLightbox);
  lightboxPrev && lightboxPrev.addEventListener('click', prevLightbox);

  // Click backdrop to close
  lightbox && lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
      closeLightbox();
    }
  });

  // Keyboard nav
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
    if (e.key === 'Escape') closeLightbox();
  });

  // Swipe support for lightbox
  (function () {
    if (!lightbox) return;
    var touchStartX = 0;
    var touchEndX = 0;
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextLightbox() : prevLightbox();
      }
    }, { passive: true });
  })();

  /* ---------------------------------------------------------
     6. HERO PARALLAX
     --------------------------------------------------------- */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = 'scale(1.06) translateY(' + (y * 0.25) + 'px)';
      }
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     7. LANGUAGE TOGGLE (FR / EN)
     --------------------------------------------------------- */
  var langToggle = document.getElementById('lang-toggle');
  var langToggleMobile = document.getElementById('lang-toggle-mobile');
  var currentLang = localStorage.getItem('pc-lang') || 'fr';

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('pc-lang', lang);
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-fr]').forEach(function (el) {
      el.textContent = lang === 'fr' ? el.getAttribute('data-fr') : el.getAttribute('data-en');
    });

    // Update toggle buttons
    [langToggle, langToggleMobile].forEach(function (btn) {
      if (!btn) return;
      btn.textContent = lang === 'fr' ? 'EN' : 'FR';
      btn.setAttribute('aria-label', lang === 'fr' ? 'Switch to English' : 'Passer en français');
    });
  }

  function toggleLang() {
    setLang(currentLang === 'fr' ? 'en' : 'fr');
  }

  langToggle && langToggle.addEventListener('click', toggleLang);
  langToggleMobile && langToggleMobile.addEventListener('click', toggleLang);

  // Init lang
  setLang(currentLang);

  /* ---------------------------------------------------------
     8. ACTIVE NAV LINK
     --------------------------------------------------------- */
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  /* ---------------------------------------------------------
     9. FORM VALIDATION & SUBMISSION
     --------------------------------------------------------- */
  var forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var valid = true;
      var requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(function (field) {
        removeFieldError(field);
        if (!field.value.trim()) {
          valid = false;
          showFieldError(field, currentLang === 'fr' ? 'Ce champ est requis' : 'This field is required');
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
          valid = false;
          showFieldError(field, currentLang === 'fr' ? 'Email invalide' : 'Invalid email');
        } else if (field.type === 'tel' && !isValidPhone(field.value)) {
          valid = false;
          showFieldError(field, currentLang === 'fr' ? 'Numéro invalide' : 'Invalid phone number');
        }
      });

      // Passengers max check
      var paxField = form.querySelector('[name="passengers"]');
      if (paxField && parseInt(paxField.value) > 11) {
        valid = false;
        showFieldError(paxField, currentLang === 'fr' ? '11 passagers maximum' : '11 passengers maximum');
      }

      if (!valid) {
        e.preventDefault();
        // Scroll to first error
        var firstError = form.querySelector('.field-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });

  function showFieldError(field, message) {
    field.classList.add('field-error');
    var errorEl = document.createElement('span');
    errorEl.className = 'field-error-msg';
    errorEl.textContent = message;
    errorEl.style.cssText = 'color:#e74c3c;font-size:12px;margin-top:4px;display:block';
    field.parentNode.appendChild(errorEl);
  }

  function removeFieldError(field) {
    field.classList.remove('field-error');
    var existing = field.parentNode.querySelector('.field-error-msg');
    if (existing) existing.remove();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^[\d\s\+\-\(\)]{7,}$/.test(phone);
  }

  /* ---------------------------------------------------------
     10. WHATSAPP PRE-FILLED
     --------------------------------------------------------- */
  var waButtons = document.querySelectorAll('[data-whatsapp]');
  waButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var form = document.querySelector('form[data-validate]');
      var msg = 'Bonjour Prestige Charter,\n';

      if (form) {
        var name = form.querySelector('[name="name"]');
        var offer = form.querySelector('[name="offer"]');
        var date = form.querySelector('[name="date"]');
        var pax = form.querySelector('[name="passengers"]');

        if (name && name.value) msg += 'Nom : ' + name.value + '\n';
        if (offer && offer.value) msg += 'Offre : ' + offer.value + '\n';
        if (date && date.value) msg += 'Date : ' + date.value + '\n';
        if (pax && pax.value) msg += 'Passagers : ' + pax.value + '\n';
      }

      msg += '\nJe souhaite obtenir plus d\'informations.';
      var url = 'https://wa.me/33652192414?text=' + encodeURIComponent(msg);
      window.open(url, '_blank');
    });
  });

  /* ---------------------------------------------------------
     11. COUNTER ANIMATION
     --------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-counter'));
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1800;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          // Ease out quad
          var ease = 1 - Math.pow(1 - progress, 3);
          var current = Math.floor(ease * target);
          el.textContent = current + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target + suffix;
          }
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.3 });

    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  /* ---------------------------------------------------------
     12. CURRENT YEAR (Footer)
     --------------------------------------------------------- */
  var yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     13. FORM DATE — Min today
     --------------------------------------------------------- */
  var dateInputs = document.querySelectorAll('input[type="date"]');
  if (dateInputs.length) {
    var today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(function (input) {
      input.setAttribute('min', today);
    });
  }

  /* ---------------------------------------------------------
     14. SCROLL TO TOP (if button exists)
     --------------------------------------------------------- */
  var scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
