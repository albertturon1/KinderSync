import * as Localization from 'expo-localization';
import { LanguageDetectorModule } from 'i18next';

export const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  detect: () => {
    const locales = Localization.getLocales();
    const firstLanguageCode = locales[0].languageCode ?? 'en';
    return firstLanguageCode;
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cacheUserLanguage: () => {},
};
