/* eslint-disable import/no-named-as-default-member */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import { en } from './locales/en';
import { tr } from './locales/tr';

const LANGUAGES = {
  en: 'English',
  tr: 'Türkçe',
} as const;

const LANG_CODES = Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[];

const LANGUAGE_DETECTOR = {
  type: 'languageDetector' as const,
  async: true,
  init: () => {},
  detect: async (): Promise<string> => {
    try {
      const savedLanguage = await AsyncStorage.getItem('user-language');
      if (savedLanguage && LANG_CODES.includes(savedLanguage as keyof typeof LANGUAGES)) {
        return savedLanguage;
      }
    } catch (error) {
      console.error('Error reading language from storage:', error);
    }
    const deviceLanguage = Localization.getLocales()[0].languageCode as keyof typeof LANGUAGES;
    return LANG_CODES.includes(deviceLanguage) ? deviceLanguage : 'tr';
  },
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem('user-language', lng);
    } catch (error) {
      console.error('Error saving language to storage:', error);
    }
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      tr: { translation: tr },
    },
    fallbackLng: 'tr',
    compatibilityJSON: 'v4',
    detection: LANGUAGE_DETECTOR,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
export { LANG_CODES, LANGUAGES };
