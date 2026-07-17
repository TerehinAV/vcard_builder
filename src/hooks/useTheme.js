import { useEffect } from 'react';
import { useTelegram } from './useTelegram';

/**
 * Keeps the `.dark` class on <html> in sync with the active theme.
 *
 * Priority:
 *   1. Telegram WebApp colorScheme (when running inside Telegram)
 *   2. System preference via matchMedia('(prefers-color-scheme: dark)')
 *   3. Defaults to light
 *
 * Listens for both Telegram's `themeChanged` event (via useTelegram) and
 * the browser's `change` event on the matchMedia query.
 */
export function useTheme() {
  const telegram = useTelegram();

  useEffect(() => {
    const apply = (scheme) => {
      const root = document.documentElement;
      if (scheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    let mediaListenerActive = false;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleMediaChange = (event) => {
      // Only honor the system preference when Telegram is not driving the theme.
      if (!telegram.isAvailable) {
        apply(event.matches ? 'dark' : 'light');
      }
    };

    // Determine current scheme.
    let scheme;
    if (telegram.isAvailable && telegram.colorScheme) {
      scheme = telegram.colorScheme;
    } else {
      scheme = mediaQuery.matches ? 'dark' : 'light';
    }
    apply(scheme);

    // Sync Telegram's native header (close button + context menu bar) with the app background
    // to avoid a visual seam between the OS chrome and our content.
    if (telegram.isAvailable) {
      const headerBg = scheme === 'dark' ? '#1a1816' : '#f7fafc';
      try {
        window.Telegram?.WebApp?.setHeaderColor?.(headerBg);
      } catch {}
    }

    // Subscribe to system theme changes when Telegram is not in control.
    if (!telegram.isAvailable) {
      mediaQuery.addEventListener('change', handleMediaChange);
      mediaListenerActive = true;
    }

    return () => {
      if (mediaListenerActive) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      }
    };
  }, [telegram.isAvailable, telegram.colorScheme]);
}
