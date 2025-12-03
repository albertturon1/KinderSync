import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../translation/en.json';

const resources = { en: { translation: en } };
const fallbackLng = 'en';

i18n
  .use(initReactI18next)
  // .use(languageDetector)
  .init({
    resources,
    fallbackLng,
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  })
  // eslint-disable-next-line no-console
  .catch(console.error);

export default i18n;
