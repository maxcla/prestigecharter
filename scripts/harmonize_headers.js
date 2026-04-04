const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const navLinks = [
  ['index.html', 'Accueil', 'Home'],
  ['yacht.html', 'Le Yacht', 'The Yacht'],
  ['experiences.html', 'Expériences', 'Experiences'],
  ['histoire.html', 'Notre Histoire', 'Our Story'],
  ['yachtclub.html', 'Yacht Club', 'Yacht Club'],
  ['tarifs.html', 'Tarifs', 'Rates'],
  ['reservation.html', 'Réservation', 'Booking'],
  ['contact.html', 'Contact', 'Contact'],
];

function buildLinks(activeHref, linkClass) {
  return navLinks
    .map(([href, fr, en]) => {
      const cls = href === activeHref ? `${linkClass} active` : linkClass;
      return `        <a href="${href}" class="${cls}" data-fr="${fr}" data-en="${en}">${fr}</a>`;
    })
    .join('\n');
}

const template = `  <!-- HEADER -->
  <header id="header" class="header">
    <div class="header-inner container">
      <a href="index.html" class="logo" aria-label="Prestige Charter - Accueil">
        <svg class="logo-anchor" width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="4" r="2.5" stroke="#C9A84C" stroke-width="1.3"/>
          <line x1="11" y1="6.5" x2="11" y2="21" stroke="#C9A84C" stroke-width="1.3"/>
          <line x1="2" y1="10" x2="20" y2="10" stroke="#C9A84C" stroke-width="1.3" stroke-linecap="round"/>
          <path d="M3 19 Q3 25 11 25 Q19 25 19 19" stroke="#C9A84C" stroke-width="1.3" fill="none" stroke-linecap="round"/>
          <line x1="3" y1="16" x2="3" y2="19" stroke="#C9A84C" stroke-width="1.3" stroke-linecap="round"/>
          <line x1="19" y1="16" x2="19" y2="19" stroke="#C9A84C" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <div class="logo-text">
          <span class="logo-prestige">PRESTIGE</span>
          <span class="logo-charter">CHARTER</span>
        </div>
      </a>
      <nav class="main-nav" aria-label="Navigation principale">
{desktop_links}
      </nav>
      <div class="header-actions">
        <button id="lang-toggle" class="lang-toggle" aria-label="Toggle language">EN</button>
        <button id="nav-burger" class="nav-burger" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <!-- MOBILE MENU -->
  <div id="mobile-menu" class="mobile-menu" aria-hidden="true">
    <div class="mobile-menu-inner">
      <nav class="mobile-menu-nav">
{mobile_links}
      </nav>
      <div class="mobile-menu-footer">
        <a href="tel:+33652192414" class="mobile-phone">+33 6 52 19 24 14</a>
        <a href="https://wa.me/33652192414" class="btn btn-primary" data-fr="WhatsApp" data-en="WhatsApp">WhatsApp</a>
      </div>
    </div>
  </div>
`;

const pattern = /<!-- HEADER -->[\s\S]*?(?=\n\s*<main|\n\s*<section|\n\s*<!--)/;

fs.readdirSync(root)
  .filter(name => name.endsWith('.html'))
  .sort()
  .forEach(fileName => {
    const filePath = path.join(root, fileName);
    let text = fs.readFileSync(filePath, 'utf8');
    const desktopLinks = buildLinks(fileName, 'nav-link');
    const mobileLinks = buildLinks(fileName, 'mobile-link');
    const replacement = template
      .replace('{desktop_links}', desktopLinks)
      .replace('{mobile_links}', mobileLinks);
    const newText = text.replace(pattern, replacement);
    if (newText === text) {
      console.warn(`WARNING: header block not replaced in ${fileName}`);
    } else {
      fs.writeFileSync(filePath, newText, 'utf8');
      console.log(`Updated ${fileName}`);
    }
  });
