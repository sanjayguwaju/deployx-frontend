import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    // Always default to Nepali initially
    lng: localStorage.getItem('i18nextLng') || 'ne',
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    }
  });

export default i18n;
