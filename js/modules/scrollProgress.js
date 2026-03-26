/**
 * Module: scrollProgress.js
 * Barre de progression de défilement en haut de page.
 * Compatible avec les IDs : #scroll-progress et #scrollProgress
 */
export function initScrollProgress() {
  const bar = document.getElementById('scroll-progress') || document.getElementById('scrollProgress');
  if (!bar) return;

  let rafPending = false;

  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
    rafPending = false;
  };

  window.addEventListener('scroll', () => {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
}
