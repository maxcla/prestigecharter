/* ═══════════════════════════════════════════════
   PRESTIGE CHARTER — Main JavaScript
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── PRELOADER ─────────────────────────────── */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 600);
    });
    // Fallback si load prend trop longtemps
    setTimeout(() => {
      if (preloader && !preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 600);
      }
    }, 4000);
  }


  /* ─── HEADER SCROLL BEHAVIOR ────────────────── */
  const header = document.querySelector('.header');
  const scrollProgress = document.getElementById('scroll-progress');
  let lastScroll = 0;
  let ticking = false;

  function onHeaderScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Header opaque après 80px
    if (header) {
      if (scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      // Masquer au scroll down, réapparaître au scroll up
      if (scrollY > lastScroll && scrollY > 300) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
    }

    // Barre de progression
    if (scrollProgress && docHeight > 0) {
      const progress = (scrollY / docHeight) * 100;
      scrollProgress.style.width = progress + '%';
    }

    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onHeaderScroll);
      ticking = true;
    }
  }, { passive: true });


  /* ─── MOBILE NAVIGATION ─────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-mobile a');

  function openNav() {
    hamburger?.classList.add('active');
    navMobile?.classList.add('open');
    navOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    hamburger?.classList.remove('active');
    navMobile?.classList.remove('open');
    navOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = navMobile?.classList.contains('open');
    isOpen ? closeNav() : openNav();
  });

  navOverlay?.addEventListener('click', closeNav);
  navLinks.forEach(link => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });


  /* ─── SMOOTH SCROLL (ancres) ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = header ? header.offsetHeight : 70;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─── REVEAL ON SCROLL (Intersection Observer) ─ */
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger'
  );

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback : tout afficher
    revealElements.forEach(el => el.classList.add('visible'));
  }


  /* ─── PARALLAX HERO ─────────────────────────── */
  const heroImage = document.querySelector('.hero-bg');
  if (heroImage) {
    let rafParallax;
    window.addEventListener('scroll', () => {
      if (rafParallax) cancelAnimationFrame(rafParallax);
      rafParallax = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
          heroImage.style.transform = `translateY(${scrollY * 0.35}px) scale(1.08)`;
        }
      });
    }, { passive: true });
  }


  /* ─── COUNTER ANIMATION ─────────────────────── */
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(ease * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }


  /* ─── LIGHTBOX (yacht gallery) ──────────────── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const galleryItems = document.querySelectorAll('[data-lightbox]');

  let currentLightboxIndex = 0;
  const lightboxSources = [];

  galleryItems.forEach((item, i) => {
    lightboxSources.push(item.getAttribute('data-lightbox') || item.src || item.querySelector('img')?.src);
    item.addEventListener('click', () => {
      currentLightboxIndex = i;
      openLightbox();
    });
    item.style.cursor = 'pointer';
  });

  function openLightbox() {
    if (!lightbox || lightboxSources.length === 0) return;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateLightbox();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    if (!lightboxImg) return;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = lightboxSources[currentLightboxIndex];
      lightboxImg.style.opacity = '1';
    }, 200);
    if (lightboxCounter) {
      lightboxCounter.textContent = (currentLightboxIndex + 1) + ' / ' + lightboxSources.length;
    }
  }

  function nextSlide() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxSources.length;
    updateLightbox();
  }

  function prevSlide() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxSources.length) % lightboxSources.length;
    updateLightbox();
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxNext?.addEventListener('click', nextSlide);
  lightboxPrev?.addEventListener('click', prevSlide);

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // Swipe support pour lightbox mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 60) {
      diff > 0 ? nextSlide() : prevSlide();
    }
  }, { passive: true });


  /* ─── LANGUAGE TOGGLE (FR / EN) ─────────────── */
  const langToggle = document.getElementById('lang-toggle');
  const langToggleMobile = document.getElementById('lang-toggle-mobile');
  let currentLang = localStorage.getItem('pc-lang') || 'fr';

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('pc-lang', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-fr]').forEach(el => {
      el.textContent = lang === 'fr'
        ? el.getAttribute('data-fr')
        : el.getAttribute('data-en');
    });

    // Update placeholder pour inputs
    document.querySelectorAll('[data-fr-placeholder]').forEach(el => {
      el.placeholder = lang === 'fr'
        ? el.getAttribute('data-fr-placeholder')
        : el.getAttribute('data-en-placeholder');
    });

    // Update le bouton
    [langToggle, langToggleMobile].forEach(btn => {
      if (btn) btn.textContent = lang === 'fr' ? 'EN' : 'FR';
    });
  }

  [langToggle, langToggleMobile].forEach(btn => {
    btn?.addEventListener('click', () => {
      setLanguage(currentLang === 'fr' ? 'en' : 'fr');
    });
  });

  // Init
  setLanguage(currentLang);


  /* ─── FORM VALIDATION ───────────────────────── */
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      let valid = true;

      // Clear previous errors
      form.querySelectorAll('.field-error').forEach(err => err.remove());
      form.querySelectorAll('.input-error').forEach(inp => inp.classList.remove('input-error'));

      // Required fields
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          showFieldError(field, currentLang === 'fr' ? 'Champ requis' : 'Required field');
        }
      });

      // Email
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          valid = false;
          showFieldError(emailField, currentLang === 'fr' ? 'Email invalide' : 'Invalid email');
        }
      }

      // Phone
      const phoneField = form.querySelector('input[type="tel"]');
      if (phoneField && phoneField.value) {
        const phoneClean = phoneField.value.replace(/[\s\-().+]/g, '');
        if (phoneClean.length < 8 || phoneClean.length > 15) {
          valid = false;
          showFieldError(phoneField, currentLang === 'fr' ? 'Numéro invalide' : 'Invalid number');
        }
      }

      // Passengers max 11
      const paxField = form.querySelector('[name="passengers"]');
      if (paxField && parseInt(paxField.value) > 11) {
        valid = false;
        showFieldError(paxField, currentLang === 'fr' ? 'Maximum 11 passagers' : 'Maximum 11 passengers');
      }

      if (!valid) {
        e.preventDefault();
        // Scroll to first error
        const firstError = form.querySelector('.input-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });

  function showFieldError(field, message) {
    field.classList.add('input-error');
    const errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.style.cssText = 'display:block;font-size:.72rem;color:#e74c3c;margin-top:4px;';
    field.parentNode.appendChild(errorEl);
  }


  /* ─── WHATSAPP PRE-FILLED LINK ──────────────── */
  const waButtons = document.querySelectorAll('[data-wa]');
  waButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const offer = document.querySelector('[name="offer"]')?.value || '';
      const date = document.querySelector('[name="date"]')?.value || '';
      const pax = document.querySelector('[name="passengers"]')?.value || '';

      let message = currentLang === 'fr'
        ? 'Bonjour, je souhaite réserver '
        : 'Hello, I would like to book ';

      if (offer) message += offer + ' ';
      if (date) message += (currentLang === 'fr' ? 'le ' : 'on ') + date + ' ';
      if (pax) message += (currentLang === 'fr' ? 'pour ' : 'for ') + pax + (currentLang === 'fr' ? ' personnes' : ' people');

      message += currentLang === 'fr'
        ? '. Merci de me recontacter.'
        : '. Please get back to me.';

      const url = 'https://wa.me/33652192414?text=' + encodeURIComponent(message);
      window.open(url, '_blank');
    });
  });


  /* ─── MARQUEE DUPLICATION ───────────────────── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    // Clone le contenu pour boucle infinie
    const clone = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML = clone + clone;
  }


  /* ─── YACHT CLUB BADGES — SVG glow on hover ── */
  const clubCards = document.querySelectorAll('.club-tier');
  clubCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const badge = card.querySelector('.club-badge');
      if (badge) badge.style.filter = 'drop-shadow(0 0 15px rgba(201,168,76,.5))';
    });
    card.addEventListener('mouseleave', () => {
      const badge = card.querySelector('.club-badge');
      if (badge) badge.style.filter = '';
    });
  });


  /* ─── ACTIVE NAV LINK ───────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });


  /* ─── OFFER SELECT → AUTO-FILL FROM URL ────── */
  const urlParams = new URLSearchParams(window.location.search);
  const offerParam = urlParams.get('offer');
  if (offerParam) {
    const offerSelect = document.querySelector('[name="offer"]');
    if (offerSelect) {
      offerSelect.value = offerParam;
    }
  }


  /* ─── TESTIMONIALS ROTATION ─────────────────── */
  const testimonials = document.querySelectorAll('.testimonial-item');
  if (testimonials.length > 1) {
    let currentTestimonial = 0;

    // Afficher le premier
    testimonials[0]?.classList.add('active');

    setInterval(() => {
      testimonials[currentTestimonial]?.classList.remove('active');
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      testimonials[currentTestimonial]?.classList.add('active');
    }, 5000);
  }


  /* ─── MAP LAZY LOAD ─────────────────────────── */
  const mapContainer = document.getElementById('map-container');
  if (mapContainer && 'IntersectionObserver' in window) {
    const mapObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const iframe = document.createElement('iframe');
        iframe.src = mapContainer.getAttribute('data-map-src');
        iframe.width = '100%';
        iframe.height = '400';
        iframe.style.border = '0';
        iframe.style.borderRadius = '16px';
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        mapContainer.innerHTML = '';
        mapContainer.appendChild(iframe);
        mapObserver.unobserve(mapContainer);
      }
    }, { rootMargin: '200px' });

    mapObserver.observe(mapContainer);
  }


})();
