/* ============================================================
   js/main.js — Prestige Charter
   Preloader · Header · Scroll · Lang Toggle · Lightbox · Timeline
   ============================================================ */

'use strict';

/* ── Utilitaires ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. PRELOADER
   ============================================================ */
function initPreloader() {
  const preloader = $('#preloader');
  if (!preloader) return;

  const onLoad = () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 600);
  };

  document.body.style.overflow = 'hidden';

  if (document.readyState === 'complete') {
    onLoad();
  } else {
    window.addEventListener('load', onLoad);
    // Fallback max 3s
    setTimeout(onLoad, 3000);
  }
}

/* ============================================================
   2. SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ============================================================
   3. HEADER — Fixe opaque, hamburger mobile
   ============================================================ */
function initHeader() {
  const header = $('#header');
  const hamburger = $('#hamburger');
  const mobileOverlay = $('#mobile-overlay');
  const mobileClose = $('#mobile-close');
  const mobileLinks = $$('.mobile-nav-link');

  if (!header) return;

  // Hamburger toggle
  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      mobileOverlay.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeMenu = () => {
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileClose) mobileClose.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fermer overlay si clic sur fond
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) closeMenu();
    });
  }

  // ESC pour fermer menu mobile
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ============================================================
   4. LANGUE FR / EN
   ============================================================ */
function initLangToggle() {
  const toggles = $$('.lang-toggle');
  if (!toggles.length) return;

  let currentLang = localStorage.getItem('pc_lang') || 'fr';

  const applyLang = (lang) => {
    currentLang = lang;
    localStorage.setItem('pc_lang', lang);

    $$('[data-fr]').forEach(el => {
      if (lang === 'fr') {
        el.textContent = el.dataset.fr;
      } else {
        if (el.dataset.en) el.textContent = el.dataset.en;
      }
    });

    // Attributs placeholder
    $$('[data-fr-placeholder]').forEach(el => {
      if (lang === 'fr') {
        el.placeholder = el.dataset.frPlaceholder;
      } else {
        if (el.dataset.enPlaceholder) el.placeholder = el.dataset.enPlaceholder;
      }
    });

    toggles.forEach(btn => {
      $$('.lang-fr', btn.parentElement).forEach(el => {
        el.classList.toggle('lang-active', lang === 'fr');
      });
      $$('.lang-en', btn.parentElement).forEach(el => {
        el.classList.toggle('lang-active', lang === 'en');
      });
    });

    document.documentElement.lang = lang;
  };

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const newLang = currentLang === 'fr' ? 'en' : 'fr';
      applyLang(newLang);
    });
  });

  // Init au chargement
  applyLang(currentLang);
}

/* ============================================================
   5. SMOOTH SCROLL ANCRES
   ============================================================ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const headerH = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--header-h')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   6. SCROLL REVEAL — Intersection Observer
   ============================================================ */
function initScrollReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  items.forEach(item => observer.observe(item));
}

/* ============================================================
   7. TIMELINE REVEAL — Histoire
   ============================================================ */
function initTimelineReveal() {
  const items = $$('.timeline-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  });

  items.forEach(item => observer.observe(item));
}

/* ============================================================
   8. GALERIE LIGHTBOX — yacht.html
   ============================================================ */
function initLightbox() {
  const lightbox = $('#lightbox');
  if (!lightbox) return;

  const lightboxImg = $('#lightbox-img');
  const lightboxCaption = $('#lightbox-caption');
  const lightboxCounter = $('#lightbox-counter');
  const lightboxClose = $('#lightbox-close');
  const lightboxPrev = $('#lightbox-prev');
  const lightboxNext = $('#lightbox-next');

  const galleryItems = $$('.gallery-item');
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  const updateLightbox = () => {
    const item = galleryItems[currentIndex];
    if (!item) return;
    const img = item.querySelector('img');
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxCaption) lightboxCaption.textContent = img.alt;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
    }
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightbox();
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateLightbox();
  };

  // Clics sur galerie
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openLightbox(i);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);

  // Clic fond lightbox
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Clavier
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Swipe tactile
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showNext();
      else showPrev();
    }
  }, { passive: true });
}

/* ============================================================
   9. FORMULAIRE RÉSERVATION — Validation + WhatsApp
   ============================================================ */
function initReservationForm() {
  const form = $('#reservation-form');
  if (!form) return;

  const waBtn = $('#whatsapp-btn');
  const passengerInput = $('#passengers');

  // Limite passagers à 11
  if (passengerInput) {
    passengerInput.addEventListener('input', () => {
      let val = parseInt(passengerInput.value);
      if (val > 11) { passengerInput.value = 11; }
      if (val < 1) { passengerInput.value = 1; }
    });
  }

  // Mise à jour lien WhatsApp dynamique
  const updateWhatsApp = () => {
    if (!waBtn) return;
    const name = $('#resa-name') ? $('#resa-name').value : '';
    const date = $('#resa-date') ? $('#resa-date').value : '';
    const offer = $('#resa-offer') ? $('#resa-offer').options[$('#resa-offer').selectedIndex]?.text : '';
    const pax = passengerInput ? passengerInput.value : '';

    let msg = `Bonjour Prestige Charter, je souhaite réserver`;
    if (offer) msg += ` — ${offer}`;
    if (date) msg += ` le ${date}`;
    if (pax) msg += ` pour ${pax} personne(s)`;
    if (name) msg += `. Nom : ${name}`;
    msg += `. Merci.`;

    waBtn.href = `https://wa.me/33652192414?text=${encodeURIComponent(msg)}`;
  };

  $$('#resa-name, #resa-date, #resa-offer, #passengers').forEach(el => {
    if (el) el.addEventListener('input', updateWhatsApp);
    if (el) el.addEventListener('change', updateWhatsApp);
  });

  updateWhatsApp();

  // Date minimum = aujourd'hui
  const dateInput = $('#resa-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // Validation basique
  form.addEventListener('submit', (e) => {
    const required = $$('[required]', form);
    let valid = true;

    required.forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (!valid) {
      e.preventDefault();
      const firstError = $('.error', form);
      if (firstError) firstError.focus();

      // Message d'erreur
      let errMsg = form.querySelector('.form-error-msg');
      if (!errMsg) {
        errMsg = document.createElement('p');
        errMsg.className = 'form-error-msg';
        errMsg.style.cssText = 'color:#E8503A;font-size:.85rem;margin-top:12px;text-align:center;';
        form.appendChild(errMsg);
      }
      errMsg.textContent = 'Veuillez remplir tous les champs obligatoires.';
      setTimeout(() => errMsg.remove(), 4000);
    }
  });
}

/* ============================================================
   10. FORMULAIRE CONTACT — Validation
   ============================================================ */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const required = $$('[required]', form);
    let valid = true;

    required.forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (!valid) {
      e.preventDefault();
      const firstError = $('.error', form);
      if (firstError) firstError.focus();
    }
  });
}

/* ============================================================
   11. PARALLAX HERO LÉGER
   ============================================================ */
function initHeroParallax() {
  const heroImg = $('.hero-img-wrap img');
  if (!heroImg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const maxScroll = window.innerHeight;
        if (scrollY <= maxScroll) {
          heroImg.style.transform = `scale(1.08) translateY(${scrollY * 0.25}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   12. COMPTEUR ANIMÉ (index — stats)
   ============================================================ */
function initCounters() {
  const counters = $$('.counter-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target || el.textContent);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const step = 16;
      const increment = target / (duration / step);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ============================================================
   13. CARDS HOVER — Effet lumière
   ============================================================ */
function initCardShine() {
  $$('.card-shine').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
}

/* ============================================================
   14. SCROLL TO TOP
   ============================================================ */
function initScrollToTop() {
  const btn = $('#scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   15. HERO SCROLL INDICATOR
   ============================================================ */
function initHeroScroll() {
  const indicator = $('.hero-scroll');
  if (!indicator) return;

  window.addEventListener('scroll', () => {
    indicator.style.opacity = window.scrollY > 100 ? '0' : '1';
  }, { passive: true });
}

/* ============================================================
   16. ACTIVE NAV LINK
   ============================================================ */
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const navMap = {
    'index.html': '.nav-accueil',
    '': '.nav-accueil',
    'yacht.html': '.nav-yacht',
    'experiences.html': '.nav-exp',
    'histoire.html': '.nav-histoire',
    'yachtclub.html': '.nav-club',
    'tarifs.html': '.nav-tarifs',
    'reservation.html': '.nav-resa',
    'contact.html': '.nav-contact',
  };

  const activeClass = navMap[path];
  if (activeClass) {
    $$(`${activeClass}`).forEach(el => el.classList.add('nav-active'));
  }
}

/* ============================================================
   17. TÉLÉPHONE CLICK-TO-CALL TRACKING
   ============================================================ */
function initPhoneLinks() {
  $$('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      // Analytics hook — peut être étendu
      console.log('📞 Click-to-call:', link.href);
    });
  });
}

/* ============================================================
   18. ANIMATIONS OFFRES INDEX — stagger
   ============================================================ */
function initOffersStagger() {
  const cards = $$('.offer-card.reveal');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
  });

  const clubCards = $$('.club-level-card.reveal');
  clubCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.15}s`;
  });
}

/* ============================================================
   INIT GLOBAL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initScrollProgress();
  initHeader();
  initLangToggle();
  initSmoothScroll();
  initScrollReveal();
  initTimelineReveal();
  initLightbox();
  initReservationForm();
  initContactForm();
  initHeroParallax();
  initCounters();
  initCardShine();
  initScrollToTop();
  initHeroScroll();
  initActiveNav();
  initPhoneLinks();
  initOffersStagger();

  // Ajouter class reveal avec délais aux éléments staggerés
  $$('.stagger-children > *').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.1}s`;
  });
});

/* ============================================================
   SERVICE WORKER — Optionnel, cache statique
   ============================================================ */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silencieux si sw.js absent
    });
  });
}
