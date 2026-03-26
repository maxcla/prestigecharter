/**
 * Web Worker: parallax.worker.js
 * Calcule la transformation CSS parallax en dehors du thread principal.
 * Reçoit : { scrollY: number, factor: number }
 * Émet   : { transform: string }
 */
self.onmessage = function ({ data }) {
  const { scrollY, factor } = data;
  const translateY = (scrollY * factor).toFixed(2);
  self.postMessage({ transform: `translateY(${translateY}px)` });
};
