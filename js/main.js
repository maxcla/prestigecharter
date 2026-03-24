/* ============================================
   PRESTIGE CHARTER — main.js
   Vanilla JS pur — Un seul fichier pour tout le site
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. PRELOADER
     ========================================== */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const hidePreloader = () => {
      preloader.classList.add('hidden');
      setTimeout(() => { preloader.style.display = 'none'; }, 600);
    };
    const start = Date.now();
    // Fallback: always clear after 3s max regardless of load event
    const hardTimeout = setTimeout(hidePreloader, 3000);
    window.addEventListener('load', () => {
      clearTimeout(hardTimeout);
      const elapsed = Date.now() - start;
      const delay = Math.max(0, 800 - elapsed);
      setTimeout(hidePreloader, delay);
    });
  }

  /* ==========================================
     2. SCROLL PROGRESS BAR
     ========================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    let rafPending = false;
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = pct + '%';
      rafPending = false;
    };
    window.addEventListener('scroll', () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateProgress);
      }
    }, { passive: true });
  }

  /* ==========================================
     3. HEADER — TOUJOURS OPAQUE, RIEN AU SCROLL
     ========================================== */
  // Le header est toujours fixe et opaque. Aucune modification au scroll.

  /* ==========================================
     4. HAMBURGER MENU MOBILE
     ========================================== */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ==========================================
     5. SCROLL REVEAL (Intersection Observer)
     ========================================== */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ==========================================
     6. SMOOTH SCROLL avec offset header
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ==========================================
     7. LIGHTBOX GALERIE
     ========================================== */
  const galleryGrid = document.querySelector('.gallery-grid');
  const lightbox = document.querySelector('.lightbox');

  if (galleryGrid && lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img') || lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    const images = Array.from(galleryGrid.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt || ''
    }));

    let currentIndex = 0;

    const openLightbox = (index) => {
      currentIndex = index;
      if (lightboxImg) {
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
      }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    const showPrev = () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      if (lightboxImg) {
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
      }
    };

    const showNext = () => {
      currentIndex = (currentIndex + 1) % images.length;
      if (lightboxImg) {
        lightboxImg.src = images[currentIndex].src;
        lightboxImg.alt = images[currentIndex].alt;
      }
    };

    galleryGrid.querySelectorAll('img').forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openLightbox(index));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }

  /* ==========================================
     8. TOGGLE LANGUE FR / EN
     ========================================== */
  const langToggles = document.querySelectorAll('.lang-toggle');
  if (langToggles.length > 0) {
    let currentLang = localStorage.getItem('lang') || 'fr';

    const applyLang = (lang) => {
      document.querySelectorAll('[data-fr][data-en]').forEach(el => {
        el.textContent = lang === 'fr' ? el.getAttribute('data-fr') : el.getAttribute('data-en');
      });
      langToggles.forEach(btn => {
        btn.textContent = lang === 'fr' ? 'EN' : 'FR';
      });
      currentLang = lang;
      localStorage.setItem('lang', lang);
    };

    applyLang(currentLang);

    langToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        applyLang(currentLang === 'fr' ? 'en' : 'fr');
      });
    });
  }

  /* ==========================================
     9. FORMULAIRE RÉSERVATION
     ========================================== */
  const reservationForm = document.getElementById('reservation-form');
  if (reservationForm) {
    const showError = (msg) => {
      let errEl = reservationForm.querySelector('.form-error');
      if (!errEl) {
        errEl = document.createElement('p');
        errEl.className = 'form-error';
        errEl.style.cssText = 'color:#e8624c;background:rgba(232,98,76,.1);border-left:3px solid #e8624c;padding:1rem 1.5rem;margin:1rem 0;font-size:.9rem;';
        reservationForm.prepend(errEl);
      }
      errEl.textContent = msg;
      errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const clearError = () => {
      const errEl = reservationForm.querySelector('.form-error');
      if (errEl) errEl.remove();
    };

    reservationForm.addEventListener('submit', (e) => {
      clearError();
      const required = reservationForm.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e8624c';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) {
        e.preventDefault();
        showError('Veuillez remplir tous les champs obligatoires.');
        return;
      }

      const passengersField = reservationForm.querySelector('[name="passagers"], #passagers, [name="passengers"]');
      if (passengersField) {
        const nb = parseInt(passengersField.value, 10);
        if (isNaN(nb) || nb < 1 || nb > 11) {
          e.preventDefault();
          showError('Le nombre de passagers doit être compris entre 1 et 11.');
          return;
        }
      }
    });
  }

  /* ==========================================
     10. BOUTON WHATSAPP PRÉ-REMPLI
     ========================================== */
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn && reservationForm) {
    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const nom = (reservationForm.querySelector('[name="nom"], #nom')?.value || '').trim();
      const date = (reservationForm.querySelector('[name="date"], #date')?.value || '').trim();
      const offre = (reservationForm.querySelector('[name="offre"], #offre')?.value || '').trim();
      const passagers = (reservationForm.querySelector('[name="passagers"], #passagers')?.value || '').trim();
      const msg = `Bonjour, je souhaite réserver ${offre || 'une sortie'} le ${date || '…'} pour ${passagers || '…'} passagers. ${nom}`;
      window.open(`https://wa.me/33652192414?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  /* ==========================================
     11. SCROLL TO TOP
     ========================================== */
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.pointerEvents = 'none';
    scrollTopBtn.style.transition = 'opacity .3s';

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================
     12. COUNTER ANIMATION
     ========================================== */
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-target')) || 0;
      const duration = 2000;
      const startTime = performance.now();
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(easeOut(progress) * target);
        el.textContent = prefix + value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

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

  /* ==========================================
     13. PARALLAX LÉGER (hero)
     ========================================== */
  const heroImg = document.querySelector('.hero img');
  if (heroImg) {
    let rafParallax = false;

    const applyParallax = () => {
      if (window.innerWidth > 768) {
        heroImg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      } else {
        heroImg.style.transform = '';
      }
      rafParallax = false;
    };

    window.addEventListener('scroll', () => {
      if (!rafParallax) {
        rafParallax = true;
        requestAnimationFrame(applyParallax);
      }
    }, { passive: true });
  }

});
