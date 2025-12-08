document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle (only if elements exist)
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }

    // Language Switcher
    const langBtns = document.querySelectorAll('.lang-btn');
    
    // Get language from localStorage or default to 'de'
    let currentLang = localStorage.getItem('preferredLanguage') || 'de';
    let translations = {};

    // Load translations asynchronously
    async function loadTranslations() {
        try {
            const response = await fetch('translations.json?v=1.4');
            translations = await response.json();
            // Initial content update after loading translations
            updateContent(currentLang);
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    function updateContent(lang) {
        if (!translations[lang]) return;

        // Save preference
        localStorage.setItem('preferredLanguage', lang);
        currentLang = lang;
        document.documentElement.lang = lang;

        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                // Handle fade effect
                element.style.opacity = '0';
                setTimeout(() => {
                    element.innerHTML = translations[lang][key];
                    element.style.opacity = '1';
                }, 200);
            }
        });

        // Update active button state
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Initialize
    loadTranslations().then(() => {
        langBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                if (lang !== currentLang) {
                    updateContent(lang);
                }
            });
        });
    });
});