/**
 * Module: parallax.js
 * Effet parallax sur l'image hero via un Web Worker dédié.
 * Le calcul mathématique est délégué au Worker (thread séparé)
 * pour ne pas bloquer le thread principal.
 */
export function initParallax() {
  const heroImg = document.querySelector('.hero img');
  if (!heroImg || window.innerWidth <= 768) return;

  let worker = null;
  let rafPending = false;

  try {
    worker = new Worker(new URL('../workers/parallax.worker.js', import.meta.url));
    worker.onmessage = ({ data: { transform } }) => {
      heroImg.style.transform = transform;
    };
  } catch (e) {
    // Fallback si le Worker n'est pas disponible
    console.warn('[Parallax] Web Worker non disponible, fallback inline.', e);
  }

  const applyParallax = () => {
    if (window.innerWidth <= 768) {
      heroImg.style.transform = '';
      rafPending = false;
      return;
    }

    if (worker) {
      worker.postMessage({ scrollY: window.scrollY, factor: 0.3 });
    } else {
      heroImg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }

    rafPending = false;
  };

  window.addEventListener('scroll', () => {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(applyParallax);
    }
  }, { passive: true });
}
