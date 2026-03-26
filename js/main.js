/**
 * ============================================================
 * PRESTIGE CHARTER — main.js
 * Point d'entrée ES6 Module — importe et initialise tous les modules
 * ============================================================
 *
 * Architecture modulaire :
 *  js/modules/preloader.js    → Animation de chargement
 *  js/modules/nav.js          → Menu hamburger mobile
 *  js/modules/scrollProgress.js → Barre de progression de défilement
 *  js/modules/reveal.js       → Animations au défilement (IntersectionObserver)
 *  js/modules/lang.js         → Bascule de langue FR / EN
 *  js/modules/lightbox.js     → Galerie photo interactive
 *  js/modules/counter.js      → Compteurs animés
 *  js/modules/parallax.js     → Parallax hero (via Web Worker)
 *  js/modules/scrollTop.js    → Bouton retour en haut
 *  js/modules/smoothScroll.js → Défilement doux vers ancres
 *  js/workers/parallax.worker.js → Web Worker (calcul parallax hors main thread)
 */

import { initPreloader }    from './modules/preloader.js';
import { initNav }          from './modules/nav.js';
import { initScrollProgress } from './modules/scrollProgress.js';
import { initReveal }       from './modules/reveal.js';
import { initLang }         from './modules/lang.js';
import { initLightbox }     from './modules/lightbox.js';
import { initCounters }     from './modules/counter.js';
import { initParallax }     from './modules/parallax.js';
import { initScrollTop }    from './modules/scrollTop.js';
import { initSmoothScroll } from './modules/smoothScroll.js';

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNav();
  initScrollProgress();
  initReveal();
  initLang();
  initLightbox();
  initCounters();
  initParallax();
  initScrollTop();
  initSmoothScroll();
});
