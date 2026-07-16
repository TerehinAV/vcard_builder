import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';
import en from './locales/en.json';

/**
 * Determine the initial language.
 * Priority:
 *   1. Telegram WebApp user.language_code
 *   2. navigator.language (first segment before "-")
 *   3. "ru" (default)
 */
function detectInitialLanguage() {
  // 1. Telegram WebApp
  try {
    const tgLang = window.Telegram?.WebApp?.initDataUnsafe?.user?.languageCode;
    if (typeof tgLang === 'string' && tgLang.length > 0) {
      const code = tgLang.toLowerCase().split(/[-_]/)[0];
      if (code === 'ru' || code === 'en') return code;
      // Unknown Telegram language -> fall back to English as a lingua franca
      return 'en';
    }
  } catch {
    // ignore access errors
  }

  // 2. Browser language
  if (typeof navigator !== 'undefined' && navigator.language) {
    const code = navigator.language.toLowerCase().split(/[-_]/)[0];
    if (code === 'ru' || code === 'en') return code;
  }

  // 3. Default
  return 'ru';
}

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: detectInitialLanguage(),
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

export default i18n;
