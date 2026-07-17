import { useEffect, useState } from 'react';

/**
 * Reads the Telegram WebApp SDK safely.
 *
 * The SDK is loaded via a <script> tag in index.html from
 * https://telegram.org/js/telegram-web-app.js and exposes
 * `window.Telegram.WebApp` when the page is opened inside a Telegram client.
 *
 * Outside Telegram (e.g. opened directly in a browser) `window.Telegram`
 * is undefined and this hook returns `isAvailable: false`.
 */
export function useTelegram() {
  const [snapshot, setSnapshot] = useState(() => readTelegram());

  useEffect(() => {
    // Signal Telegram that the WebApp is ready to be displayed.
    try {
      window.Telegram?.WebApp?.ready?.();
    } catch {
      // ignore
    }

    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    const handleThemeChanged = () => {
      setSnapshot(readTelegram());
    };

    tg.onEvent?.('themeChanged', handleThemeChanged);

    return () => {
      tg.offEvent?.('themeChanged', handleThemeChanged);
    };
  }, []);

  return snapshot;
}

function readTelegram() {
  try {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) {
      return {
        isAvailable: false,
        languageCode: null,
        colorScheme: null,
        themeParams: null,
      };
    }

    const rawLang = webApp.initDataUnsafe?.user?.languageCode;
    const languageCode =
      typeof rawLang === 'string' && rawLang.length > 0
        ? rawLang.toLowerCase().split(/[-_]/)[0]
        : null;

    const colorScheme =
      webApp.colorScheme === 'dark' || webApp.colorScheme === 'light'
        ? webApp.colorScheme
        : null;

    return {
      isAvailable: true,
      languageCode,
      colorScheme,
      themeParams: webApp.themeParams || null,
      initData: webApp.initData || '',
      close: () => {
        try {
          webApp.close();
        } catch {}
      },
    };
  } catch {
    return {
      isAvailable: false,
      languageCode: null,
      colorScheme: null,
      themeParams: null,
    };
  }
}
