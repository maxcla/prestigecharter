/**
 * Module: lightbox.js
 * Galerie photo avec navigation clavier et souris.
 */
export function initLightbox() {
  const galleryGrid = document.querySelector('.gallery-grid');
  const lightbox = document.querySelector('.lightbox');
  if (!galleryGrid || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img') || lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  const images = Array.from(galleryGrid.querySelectorAll('img')).map(img => ({
    src: img.src,
    alt: img.alt || ''
  }));

  let currentIndex = 0;

  const show = (index) => {
    currentIndex = (index + images.length) % images.length;
    if (lightboxImg) {
      lightboxImg.src = images[currentIndex].src;
      lightboxImg.alt = images[currentIndex].alt;
    }
  };

  const open = (index) => {
    show(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  galleryGrid.querySelectorAll('img').forEach((img, i) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => open(i));
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', () => show(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => show(currentIndex + 1));

  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
    if (e.key === 'ArrowRight') show(currentIndex + 1);
  });
}
