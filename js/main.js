// js/main.js — Prestige Charter

(function () {
  'use strict';

  /* ========== PRELOADER ========== */
  const preloader = document.getElementById('preloader');
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 600);
  }
  window.addEventListener('load', () => setTimeout(hidePreloader, 800));
  setTimeout(hidePreloader, 2000); // fallback

  /* ========== HEADER SCROLL ========== */
  const header = document.getElementById('header');
  let lastScroll = 0;
  function onScroll() {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 60);
    }
    lastScroll = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ========== MOBILE NAV ========== */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

  function toggleMobile() {
    if (!mobileNav) return;
    const open = mobileNav.classList.toggle('open');
    burger && burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger && burger.addEventListener('click', toggleMobile);
  mobileLinks.forEach(link => link.addEventListener('click', () => {
    if (mobileNav.classList.contains('open')) toggleMobile();
  }));

  /* ========== LANGUAGE TOGGLE ========== */
  const langBtn = document.getElementById('lang-toggle');
  const langBtnMobile = document.getElementById('lang-toggle-mobile');

  function setLang(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('pc-lang', lang);
    document.querySelectorAll('[data-fr]').forEach(el => {
      el.textContent = lang === 'fr' ? el.getAttribute('data-fr') : el.getAttribute('data-en');
    });
    document.querySelectorAll('[data-fr-html]').forEach(el => {
      el.innerHTML = lang === 'fr' ? el.getAttribute('data-fr-html') : el.getAttribute('data-en-html');
    });
    [langBtn, langBtnMobile].forEach(b => { if (b) b.textContent = lang === 'fr' ? 'EN' : 'FR'; });
  }

  function toggleLang() {
    setLang(document.documentElement.lang === 'fr' ? 'en' : 'fr');
  }
  langBtn && langBtn.addEventListener('click', toggleLang);
  langBtnMobile && langBtnMobile.addEventListener('click', toggleLang);

  // Init lang
  const savedLang = localStorage.getItem('pc-lang') || 'fr';
  setLang(savedLang);

  /* ========== SCROLL REVEAL ========== */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ========== PARALLAX HERO ========== */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        hero.style.setProperty('--parallax-y', (y * 0.3) + 'px');
      }
    }, { passive: true });
  }

  /* ========== LIGHTBOX GALLERY ========== */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCounter = document.getElementById('lb-counter');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  let galleryItems = [];
  let lbIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !galleryItems.length) return;
    lbIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    if (!lbImg) return;
    lbImg.src = galleryItems[lbIndex].src;
    lbImg.alt = galleryItems[lbIndex].alt || '';
    if (lbCounter) lbCounter.textContent = (lbIndex + 1) + ' / ' + galleryItems.length;
  }

  function lbNavigate(dir) {
    lbIndex = (lbIndex + dir + galleryItems.length) % galleryItems.length;
    updateLightbox();
  }

  // Init gallery
  document.querySelectorAll('.gallery-grid img, .gallery-item img').forEach((img, i) => {
    galleryItems.push({ src: img.getAttribute('data-full') || img.src, alt: img.alt });
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLightbox(i));
  });

  lbClose && lbClose.addEventListener('click', closeLightbox);
  lbPrev && lbPrev.addEventListener('click', () => lbNavigate(-1));
  lbNext && lbNext.addEventListener('click', () => lbNavigate(1));
  lightbox && lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbNavigate(-1);
    if (e.key === 'ArrowRight') lbNavigate(1);
  });

  /* ========== TIMELINE ANIMATION ========== */
  const timelineLine = document.querySelector('.timeline-line-fill');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (timelineLine && timelineItems.length) {
    const timelineSection = document.querySelector('.timeline');
    window.addEventListener('scroll', () => {
      if (!timelineSection) return;
      const rect = timelineSection.getBoundingClientRect();
      const sectionH = timelineSection.offsetHeight;
      const visible = Math.min(Math.max(-rect.top / (sectionH - window.innerHeight), 0), 1);
      timelineLine.style.height = (visible * 100) + '%';
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      const tObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            tObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      timelineItems.forEach(el => tObs.observe(el));
    }
  }

  /* ========== COUNT-UP ANIMATION ========== */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1500;
        const start = performance.now();
        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));
  }

  /* ========== SMOOTH SCROLL ========== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ========== RESERVATION FORM ========== */
  const resoForm = document.getElementById('reso-form');
  if (resoForm) {
    const paxInput = resoForm.querySelector('[name="passengers"]');
    if (paxInput) {
      paxInput.addEventListener('change', () => {
        if (parseInt(paxInput.value) > 11) paxInput.value = 11;
        if (parseInt(paxInput.value) < 1) paxInput.value = 1;
      });
    }

    // WhatsApp button
    const waBtn = document.getElementById('wa-send');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        const name = resoForm.querySelector('[name="name"]')?.value || '';
        const date = resoForm.querySelector('[name="date"]')?.value || '';
        const offer = resoForm.querySelector('[name="offer"]')?.value || '';
        const pax = resoForm.querySelector('[name="passengers"]')?.value || '';
        const msg = resoForm.querySelector('[name="message"]')?.value || '';
        const text = encodeURIComponent(
          `Bonjour Prestige Charter,\n\nJe souhaite réserver :\n` +
          `• Offre : ${offer}\n• Date : ${date}\n• Passagers : ${pax}\n• Nom : ${name}\n` +
          (msg ? `• Message : ${msg}\n` : '') +
          `\nMerci !`
        );
        window.open('https://wa.me/33652192414?text=' + text, '_blank');
      });
    }
  }

  /* ========== CONTACT FORM (Formspree) ========== */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Envoi…';
    });
  }

})();
