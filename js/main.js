/* ============================================================
   PRESTIGE CHARTER AT — main.js
   Version complète — Janvier 2025
   ============================================================ */

/* ─── SCROLL PROGRESS BAR ─── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ─── NAV SCROLL EFFECT ─── */
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ─── NAV ACTIVE LINK (auto-détection par URL) ─── */
function initNavActive() {
  const links = document.querySelectorAll('.nav-links a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ─── BURGER MENU ─── */
function initBurger() {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fermer au clic sur un lien
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Fermer au clic extérieur
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });
}

/* ─── LANGUE FR / EN ─── */
function initLang() {
  const btn = document.getElementById('langBtn');
  if (!btn) return;

  let lang = localStorage.getItem('pc_lang') || 'fr';

  function applyLang(l) {
    document.querySelectorAll('[data-fr]').forEach(el => {
      el.textContent = l === 'fr' ? el.dataset.fr : el.dataset.en;
    });
    // Placeholders
    document.querySelectorAll('[data-fr-placeholder]').forEach(el => {
      el.placeholder = l === 'fr'
        ? el.dataset.frPlaceholder
        : el.dataset.enPlaceholder;
    });
    btn.textContent = l === 'fr' ? 'EN' : 'FR';
    document.documentElement.lang = l === 'fr' ? 'fr' : 'en';
    localStorage.setItem('pc_lang', l);
    lang = l;
  }

  btn.addEventListener('click', () => {
    applyLang(lang === 'fr' ? 'en' : 'fr');
  });

  applyLang(lang);
}

/* ─── FADE-IN AU SCROLL ─── */
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}

/* ─── TIMELINE ANIMATION ─── */
function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(el => observer.observe(el));
}

/* ─── HERO PARALLAX LÉGER ─── */
function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    heroBg.style.transform = `scale(1) translateY(${offset * 0.25}px)`;
  }, { passive: true });

  // Trigger loaded class pour animation scale
  setTimeout(() => {
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('loaded');
  }, 100);
}

/* ─── PAGE TRANSITION ─── */
function initPageTransition() {
  const overlay = document.getElementById('pageTransition');
  if (!overlay) return;

  // Entrée : fade out de l'overlay
  window.addEventListener('load', () => {
    overlay.classList.remove('active');
  });

  // Sortie : fade in avant navigation
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Ignorer liens externes, anchors, tel, mailto
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('tel') ||
      href.startsWith('mailto') ||
      href.startsWith('https') ||
      link.hasAttribute('target')
    ) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 280);
    });
  });
}

/* ─── FORM VALIDATION ─── */
function initForm() {
  const form = document.getElementById('reservationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#e05252';
        valid = false;
      }
    });

    if (!valid) {
      const firstError = form.querySelector('[required][style*="e05252"]');
      if (firstError) firstError.focus();
      return;
    }

    // Préparer données WhatsApp
    const name    = form.querySelector('#name')?.value || '';
    const date    = form.querySelector('#date')?.value || '';
    const offre   = form.querySelector('#offre')?.value || '';
    const pax     = form.querySelector('#pax')?.value || '';
    const message = form.querySelector('#message')?.value || '';

    const text = encodeURIComponent(
      `Bonjour, je souhaite réserver :\n` +
      `• Nom : ${name}\n` +
      `• Offre : ${offre}\n` +
      `• Date : ${date}\n` +
      `• Passagers : ${pax}\n` +
      (message ? `• Message : ${message}` : '')
    );

    window.open(`https://wa.me/33652192414?text=${text}`, '_blank');
  });
}

/* ─── SMOOTH SCROLL ANCHORS ─── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── INIT GLOBAL ─── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavScroll();
  initNavActive();
  initBurger();
  initLang();
  initFadeIn();
  initTimeline();
  initHeroParallax();
  initPageTransition();
  initForm();
  initSmoothScroll();
});
