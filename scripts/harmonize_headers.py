from pathlib import Path
import re

root = Path(__file__).resolve().parent.parent
nav_links = [
    ('index.html', 'Accueil', 'Home'),
    ('yacht.html', 'Le Yacht', 'The Yacht'),
    ('experiences.html', 'Expériences', 'Experiences'),
    ('histoire.html', 'Notre Histoire', 'Our Story'),
    ('yachtclub.html', 'Yacht Club', 'Yacht Club'),
    ('tarifs.html', 'Tarifs', 'Rates'),
    ('reservation.html', 'Réservation', 'Booking'),
    ('contact.html', 'Contact', 'Contact'),
]


def build_links(active_href, link_class):
    lines = []
    for href, fr, en in nav_links:
        cls = link_class
        if href == active_href:
            cls += ' active'
        lines.append(f'        <a href="{href}" class="{cls}" data-fr="{fr}" data-en="{en}">{fr}</a>')
    return '\n'.join(lines)


template = '''  <!-- HEADER -->
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
'''

pattern = re.compile(r'<!-- HEADER -->.*?(?=(?:\n\s*<main|\n\s*<section|\n\s*<!--))', re.S)

for file in sorted(root.glob('*.html')):
    if file.name == 'README.md':
        continue
    text = file.read_text(encoding='utf-8')
    desktop_links = build_links(file.name, 'nav-link')
    mobile_links = build_links(file.name, 'mobile-link')
    replacement = template.format(desktop_links=desktop_links, mobile_links=mobile_links)
    new_text, count = pattern.subn(replacement, text, count=1)
    if count != 1:
        print(f'WARNING: header block not replaced in {file.name} (count={count})')
    else:
        file.write_text(new_text, encoding='utf-8')
        print(f'Updated {file.name}')
