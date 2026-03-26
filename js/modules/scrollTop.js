/**
 * Module: scrollTop.js
 * Bouton retour en haut de page — apparaît après 500px de scroll.
 */
export function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  btn.style.opacity = '0';
  btn.style.pointerEvents = 'none';
  btn.style.transition = 'opacity .3s';

  window.addEventListener('scroll', () => {
    const visible = window.scrollY > 500;
    btn.style.opacity = visible ? '1' : '0';
    btn.style.pointerEvents = visible ? 'auto' : 'none';
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
