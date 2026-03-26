/**
 * Module: lang.js
 * Gestion du basculement de langue FR / EN.
 * Utilise localStorage pour mémoriser la préférence.
 */
export function initLang() {
  const toggles = document.querySelectorAll('.lang-toggle');
  if (!toggles.length) return;

  let current = localStorage.getItem('lang') || 'fr';

  const apply = (lang) => {
    document.querySelectorAll('[data-fr][data-en]').forEach(el => {
      el.textContent = lang === 'fr'
        ? el.getAttribute('data-fr')
        : el.getAttribute('data-en');
    });
    toggles.forEach(btn => { btn.textContent = lang === 'fr' ? 'EN' : 'FR'; });
    current = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  };

  apply(current);

  toggles.forEach(btn => {
    btn.addEventListener('click', () => apply(current === 'fr' ? 'en' : 'fr'));
  });
}
