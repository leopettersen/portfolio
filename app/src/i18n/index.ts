import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { pt } from './locales/pt';
import { en } from './locales/en';
import { localeMap } from './localeMap';

i18n.on('languageChanged', () => {
  document.documentElement.lang = localeMap[i18n.resolvedLanguage === 'en' ? 'en' : 'pt'];
  document.title = i18n.t('site.title');
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en }
    },
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en'],
    detection: {
      order: ['localStorage'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;