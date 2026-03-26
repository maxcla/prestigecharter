# Prestige Charter AT

Site vitrine ultra-luxe statique — location de yacht à Saint-Jean-Cap-Ferrat, Côte d'Azur.

Yacht : Jeanneau Prestige 42S « Artemis » (2018, 13m, 11 passagers)
Offres : Sunset Experience 1300€, Journée en Mer 2700€, Pêche de Nuit 2600€

## Pages

- `index.html` — Page d'accueil principale
- `experiences.html` — Trois expériences détaillées
- `yacht.html` — Présentation et galerie de l'Artemis
- `yachtclub.html` — Club privé membres
- `tarifs.html` — Tableau tarifaire comparatif
- `reservation.html` — Formulaire réservation (Formspree)
- `contact.html` — Contact (Formspree)
- `histoire.html` — Histoire 3 générations de marins
- `cgv.html` — Conditions générales
- `mentionslegales.html` — Mentions légales

## Structure

- `css/style.css` — Feuille de style globale unique
- `js/main.js` — Point d'entrée `<script type="module">`
- `js/modules/` — Modules JS : preloader, nav, lang, reveal, parallax, lightbox, counter, scrollProgress, scrollTop, smoothScroll
- `images/` — Assets visuels

## Images (état après intégration complète IA — mars 2026)

### Originales (conservées) :
- `hero.jpg` — non utilisée (remplacée hero-new.png) ; toujours présente
- `yacht-1.jpg`, `yacht-2.webp`, `yacht-3.webp`, `Arrière V2.jpeg` — galerie yacht.html (partiel)
- `yacht-4.pnj` — non utilisée

### Unsplash (conservées mais remplacées dans html principal) :
- `sunset-mer.jpg`, `nuit-etoiles.jpg`, `crique-azur.jpg`, `port-breton.jpg`, `marina-luxe.jpg`, `voile-azur.jpg`, `yacht-salon.jpg`

### IA générées (PNG, ~1–2MB, toutes actives) :
- `hero-new.png` → hero index.html (vue aérienne cinématique heure dorée)
- `yacht-exterior-sunset.png` → hero experiences.html + card Sunset index.html + offre Sunset experiences.html
- `yacht-cockpit-lifestyle.png` → teaser yacht index.html + galerie yacht.html
- `seabob-action.png` → offre Journée experiences.html + galerie yacht.html (dernier slot)
- `night-fishing.png` → offre Pêche de Nuit experiences.html
- `histoire-bretagne.png` → hero histoire.html + teaser histoire index.html + timeline Gen I
- `histoire-atlantic.png` → timeline Gen II (père hauturier)
- `histoire-fondateur.png` → timeline Gen III (fondateur)
- `yachtclub-lounge.png` → hero yachtclub.html + fond concept emblème
- `instagram-1.png` → grille IG slot 1 (drone crique)
- `instagram-2.png` → grille IG slot 2 (champagne pont)
- `instagram-3.png` → grille IG slot 3 (split sous-marin)
- `instagram-4.png` → grille IG slot 4 (corde proue)

## Design

- Couleurs : Gold #C9A84C, Dark #070F1B, Darker #050B14, White #F4F0EB, Gray #9A968E
- Polices : Playfair Display (titres) + Inter (corps)
- Bilingue FR/EN : `data-fr`/`data-en` sur tous les éléments texte, géré par `js/modules/lang.js`

## Contact / Config

- WhatsApp : +33652192414
- Email : prestigecharter06@gmail.com
- Instagram : @prestigecharter06
- Formspree : https://formspree.io/f/xpzvqwdl (reservation + contact)

## Tech

- HTML/CSS/JS statique pur (pas de build)
- `http-server` port 5000 avec CORS
- Tous les `<script>` en `type="module"`
- `#scroll-progress` et `#scrollProgress` tous deux stylés (alias CSS)
