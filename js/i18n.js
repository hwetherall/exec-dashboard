/**
 * Internationalization (i18n) Module
 * Handles language switching and translation
 */

const I18n = (function() {
    const STORAGE_KEY = 'kajima_language';
    
    // Default state
    let state = {
        currentLanguage: localStorage.getItem(STORAGE_KEY) || 'en',
        listeners: []
    };

    /**
     * Get current language
     */
    function getLanguage() {
        return state.currentLanguage;
    }

    /**
     * Set language and trigger updates
     */
    function setLanguage(lang) {
        if (lang !== 'en' && lang !== 'ja') return;
        
        state.currentLanguage = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Notify listeners
        notifyListeners();
    }

    /**
     * Get translated string
     * @param {string} key - The translation key (e.g., 'nav.overview')
     * @param {object} params - Optional parameters to interpolate
     */
    function t(key, params = {}) {
        const lang = state.currentLanguage;
        
        // Access translation dictionary globally
        if (!window.TRANSLATIONS) {
            console.warn('Translations not loaded');
            return key;
        }
        
        const dict = window.TRANSLATIONS[lang];
        let text = dict?.[key] || key;
        
        // Fallback to English if missing in target language
        if (text === key && lang !== 'en') {
            text = window.TRANSLATIONS['en']?.[key] || key;
        }

        // Interpolate parameters (e.g., {name})
        Object.entries(params).forEach(([param, value]) => {
            text = text.replace(`{${param}}`, value);
        });

        return text;
    }

    /**
     * Toggle between available languages
     */
    function toggleLanguage() {
        const newLang = state.currentLanguage === 'en' ? 'ja' : 'en';
        setLanguage(newLang);
        return newLang;
    }

    /**
     * Add listener for language changes
     */
    function onLanguageChange(callback) {
        state.listeners.push(callback);
    }

    /**
     * Notify all listeners
     */
    function notifyListeners() {
        state.listeners.forEach(callback => callback(state.currentLanguage));
    }

    // Initialize
    document.documentElement.lang = state.currentLanguage;

    return {
        getLanguage,
        setLanguage,
        toggleLanguage,
        t,
        onLanguageChange
    };
})();

