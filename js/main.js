/* ==========================================
   PRESTIGE CHARTER AT — Main JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------
     PAGE TRANSITION
  ------------------------------------------ */
  const transition = document.getElementById('pageTransition');
  if (transition) {
    setTimeout(() => transition.classList.remove('active'), 400);
    document.querySelectorAll('a[href]').forEach(link => {
      if (link.hostname === location.hostname && !link.hash && !link.hasAttribute('target')) {
        link.addEventListener('click', e => {
          e.preventDefault();
          const dest = link.href;
          transition.classList.add('active');
          setTimeout(() => window.location = dest, 400);
        });
      }
    });
  }

  /* ------------------------------------------
     SCROLL PROGRESS BAR
  ------------------------------------------ */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    }, { passive: true });
  }

  /* ------------------------------------------
     HEADER SCROLL (shrink + shadow)
  ------------------------------------------ */
  const header = document.getElementById('header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      // Hide/show on scroll direction
      if (currentScroll > lastScroll && currentScroll > 200) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  /* ------------------------------------------
     MOBILE MENU TOGGLE
  ------------------------------------------ */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* ------------------------------------------
     LANGUAGE TOGGLE (FR / EN)
  ------------------------------------------ */
  const langToggle = document.getElementById('langToggle');
  let currentLang = localStorage.getItem('pc-lang') || 'fr';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('pc-lang', lang);
    if (langToggle) langToggle.textContent = lang === 'fr' ? 'EN' : 'FR';
    document.querySelectorAll('[data-fr][data-en]').forEach(el => {
      const text = lang === 'fr' ? el.getAttribute('data-fr') : el.getAttribute('data-en');
      if (text) {
        // Preserve child elements (like links inside paragraphs)
        if (el.children.length === 0) {
          el.textContent = text;
        } else {
          // Only update if it's a simple text swap
          const firstText = el.childNodes[0];
          if (firstText && firstText.nodeType === 3) {
            firstText.textContent = text;
          }
        }
      }
    });
    document.documentElement.lang = lang;
  }

  // Apply saved language on load
  if (currentLang !== 'fr') applyLanguage(currentLang);

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      applyLanguage(currentLang === 'fr' ? 'en' : 'fr');
    });
  }

  /* ------------------------------------------
     FADE-IN ON SCROLL (Intersection Observer)
  ------------------------------------------ */
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    // Fallback: show everything
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  /* ------------------------------------------
     PARALLAX HERO (subtle)
  ------------------------------------------ */
  const heroSection = document.querySelector('.hero, .page-hero');
  if (heroSection && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll < window.innerHeight) {
        heroSection.style.setProperty('--parallax-y', (scroll * 0.3) + 'px');
      }
    }, { passive: true });
  }

  /* ------------------------------------------
     GALLERY LIGHTBOX (yacht.html)
  ------------------------------------------ */
  const galleryItems = document.querySelectorAll('.gallery-item img, .gallery-grid img');
  if (galleryItems.length > 0) {
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox__overlay"></div>
      <div class="lightbox__content">
        <button class="lightbox__close" aria-label="Fermer">&times;</button>
        <button class="lightbox__prev" aria-label="Précédent">&#8249;</button>
        <img class="lightbox__img" src="" alt="" />
        <button class="lightbox__next" aria-label="Suivant">&#8250;</button>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('.lightbox__img');
    const lbClose = lightbox.querySelector('.lightbox__close');
    const lbOverlay = lightbox.querySelector('.lightbox__overlay');
    const lbPrev = lightbox.querySelector('.lightbox__prev');
    const lbNext = lightbox.querySelector('.lightbox__next');
    let currentIndex = 0;
    const images = Array.from(galleryItems);

    function openLightbox(index) {
      currentIndex = index;
      lbImg.src = images[currentIndex].src;
      lbImg.alt = images[currentIndex].alt || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigate(dir) {
      currentIndex = (currentIndex + dir + images.length) % images.length;
      lbImg.src = images[currentIndex].src;
      lbImg.alt = images[currentIndex].alt || '';
    }

    images.forEach((img, i) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openLightbox(i));
    });

    lbClose.addEventListener('click', closeLightbox);
    lbOverlay.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', () => navigate(-1));
    lbNext.addEventListener('click', () => navigate(1));

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  /* ------------------------------------------
     RESERVATION FORM — Date min (today)
  ------------------------------------------ */
  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  /* ------------------------------------------
     RESERVATION FORM — Submission
  ------------------------------------------ */
  const form = document.getElementById('reservationForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      // Collect data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => data[key] = value);

      // Build WhatsApp message
      const msg = encodeURIComponent(
        `✨ Nouvelle demande de réservation — Prestige Charter\n\n` +
        `👤 Nom : ${data.name || '[non renseigné]'}\n` +
        `📧 Email : ${data.email || '[non renseigné]'}\n` +
        `📞 Téléphone : ${data.phone || '[non renseigné]'}\n` +
        `📅 Date souhaitée : ${data.date || '[non renseignée]'}\n` +
        `🛥️ Formule : ${data.experience || '[non renseignée]'}\n` +
        `👥 Passagers : ${data.guests || '[non renseigné]'}\n` +
        `💬 Message : ${data.message || 'Aucun'}`
      );

      // Redirect to WhatsApp
      window.open(`https://wa.me/33652192414?text=${msg}`, '_blank');

      // Show confirmation
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = currentLang === 'fr' ? '✓ Envoyé !' : '✓ Sent!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          form.reset();
        }, 3000);
      }
    });
  }

  /* ------------------------------------------
     CONTACT FORM — Mailto fallback
  ------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = {};
      formData.forEach((value, key) => data[key] = value);

      const subject = encodeURIComponent('Contact via prestigecharter.fr');
      const body = encodeURIComponent(
        `Nom : ${data.name || ''}\n` +
        `Email : ${data.email || ''}\n` +
        `Téléphone : ${data.phone || ''}\n\n` +
        `Message :\n${data.message || ''}`
      );

      window.location.href = `mailto:prestigecharter06@gmail.com?subject=${subject}&body=${body}`;

      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = currentLang === 'fr' ? '✓ Message prêt !' : '✓ Message ready!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 3000);
      }
    });
  }

  /* ------------------------------------------
     SMOOTH SCROLL for anchor links
  ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ------------------------------------------
     PRICING CARDS HOVER (tarifs.html)
  ------------------------------------------ */
  const pricingCards = document.querySelectorAll('.pricing-card');
  pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      pricingCards.forEach(c => c.classList.remove('pricing-card--active'));
      card.classList.add('pricing-card--active');
    });
  });

});
