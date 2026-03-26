/**
 * Module: preloader.js
 * Gère l'animation de chargement initiale de la page.
 */
export function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const hidePreloader = () => {
    preloader.classList.add('hidden');
    setTimeout(() => { preloader.style.display = 'none'; }, 600);
  };

  const start = Date.now();
  const hardTimeout = setTimeout(hidePreloader, 3000);

  window.addEventListener('load', () => {
    clearTimeout(hardTimeout);
    const elapsed = Date.now() - start;
    const delay = Math.max(0, 800 - elapsed);
    setTimeout(hidePreloader, delay);
  });
}
