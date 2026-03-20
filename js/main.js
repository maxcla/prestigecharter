document.addEventListener('DOMContentLoaded', function() {
    // Toggle de langue
    const languageToggle = document.querySelector('.language-toggle button');
    const isFrench = localStorage.getItem('language') === 'fr';

    // Appliquer la langue sauvegardée ou utiliser le français par défaut
    if (isFrench) {
        document.documentElement.lang = 'fr';
    } else {
        document.documentElement.lang = 'en';
    }

    // Mettre à jour le texte selon la langue
    updateLanguageTexts();

    // Gestion du toggle de langue
    languageToggle.addEventListener('click', function() {
        const currentLang = document.documentElement.lang;
        const newLang = currentLang === 'fr' ? 'en' : 'fr';

        document.documentElement.lang = newLang;
        localStorage.setItem('language', newLang);

        // Mettre à jour le texte du bouton
        if (newLang === 'fr') {
            languageToggle.textContent = 'FR';
        } else {
            languageToggle.textContent = 'EN';
        }

        // Mettre à jour tous les textes
        updateLanguageTexts();
    });

    // Fonction pour mettre à jour tous les textes selon la langue
    function updateLanguageTexts() {
        const currentLang = document.documentElement.lang;
        const allElements = document.querySelectorAll('[data-fr], [data-en]');

        allElements.forEach(element => {
            if (currentLang === 'fr') {
                if (element.hasAttribute('data-fr')) {
                    element.textContent = element.getAttribute('data-fr');
                }
            } else {
                if (element.hasAttribute('data-en')) {
                    element.textContent = element.getAttribute('data-en');
                }
            }
        });
    }

    // Gestion du menu mobile (si nécessaire)
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Parallax léger pour le hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = scrollPosition * 0.3 + 'px';
        });
    }

    // Animation fade-in pour les éléments
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.fade-in');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Appeler la fonction au chargement et au scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});
