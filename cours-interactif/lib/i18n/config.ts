import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { supportedLocales } from './locales';
import { defaultLocale } from './types';

i18n
  .use(initReactI18next)
  .use(resourcesToBackend((language: string) => import(`./locales/${language}.json`)))
  .init({
    lng: defaultLocale,
    // Repli vers le français pour toute clé non traduite dans la locale active.
    fallbackLng: 'fr-FR',
    supportedLngs: supportedLocales.map((l) => l.code),
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
