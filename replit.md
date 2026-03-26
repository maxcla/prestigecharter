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

## Images (état après audit mars 2026)

Originales : hero.jpg (1.6MB), yacht-1.jpg, yacht-2.webp, yacht-3.webp, Arrière V2.jpeg, yacht-4.pnj

Nouvelles (téléchargées Unsplash) :
- `sunset-mer.jpg` (287K) — Sunset Experience, hero experiences, cards
- `nuit-etoiles.jpg` (181K) — Pêche de Nuit
- `crique-azur.jpg` (124K) — Journée en Mer
- `port-breton.jpg` (138K) — Histoire Gen I (héritage breton)
- `marina-luxe.jpg` (841K) — Yacht Club concept, Histoire Gen II
- `voile-azur.jpg` (130K) — Hero yacht.html
- `yacht-salon.jpg` (261K) — Galerie yacht (6e image)

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
