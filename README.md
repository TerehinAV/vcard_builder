# QR vCard Builder

QR vCard Generator is a browser-based React application for creating a QR code that contains contact information in vCard format. The application supports vCard 2.1, 3.0, and 4.0, and keeps all entered data in the browser for the current session.

The user interface is available in Russian and English, with automatic language and color-scheme detection when the app is opened inside a Telegram WebApp.

## Features

- Four-step wizard for creating a QR vCard.
- Choice of vCard 2.1, 3.0, or 4.0.
- Version-specific contact fields.
- Required-name, email-format, and phone-character validation.
- QR code generation from the completed vCard text.
- QR image copying through the browser clipboard API.
- Automatic fallback to copying the vCard text when image copying is unavailable or fails.
- QR code download as a PNG file named `qr-vcard.png`.
- A separate action for copying the generated vCard text.
- Responsive styling for desktop and mobile layouts.
- Client-side processing with no server submission.
- Bilingual UI (Russian and English) with Telegram-aware language detection.
- Light/dark theme that follows the Telegram client or the system preference.

## Localization

The UI ships in two locales: `ru` (default) and `en`. Translations live in `src/locales/{ru,en}.json` and are consumed via `react-i18next`.

Language is resolved at startup in the following order:

1. `window.Telegram.WebApp.initDataUnsafe.user.languageCode` (when opened inside Telegram)
2. `navigator.language` (first segment before `-`)
3. `ru` (fallback)

Unknown Telegram language codes fall back to English. There is no manual language switcher; the language is always driven by the host environment.

## Dark Theme

Theme tokens are defined as CSS custom properties in `src/index.css` under `:root` (light) and overridden under a `.dark` class on the `<html>` element. Tailwind v4 class-based dark mode is enabled via the `@custom-variant dark (&:where(.dark, .dark *));` directive, so `dark:` utilities work as expected.

The active theme is resolved by `src/hooks/useTheme.js` in the following priority:

1. `window.Telegram.WebApp.colorScheme` (when opened inside Telegram), kept in sync via the `themeChanged` event
2. `window.matchMedia('(prefers-color-scheme: dark)')` (outside Telegram), kept in sync via the `change` event
3. Light theme (fallback)

The QR code canvas itself always renders on a white background — this is intentional and required for reliable scanning.

## Application Flow

1. **Welcome**: introduces the application and starts the creation process.
2. **Version selection**: offers vCard 2.1, 3.0, and 4.0.
3. **Contact form**: displays the fields available for the selected version and validates the name, email, and phone values. The QR code is not generated or previewed while the form is being edited; generation happens after a valid form is submitted.
4. **Result**: displays the generated QR code and provides actions to copy the QR image, download a PNG, copy the vCard text, or restart the wizard.

## Supported vCard Formats

Only the name is required. All other fields are optional.

### vCard 2.1

| Form field | Generated property |
| --- | --- |
| Name | `N` |
| Phone | `TEL` |
| Email | `EMAIL` |
| Company/organization | `ORG` |
| Note | `NOTE` |

### vCard 3.0

| Form field | Generated property |
| --- | --- |
| Name | `N` |
| Phone | `TEL` |
| Email | `EMAIL` |
| Company/organization | `ORG` |
| Note | `NOTE` |

### vCard 4.0

| Form field | Generated property | Input behavior |
| --- | --- | --- |
| Name | `FN` | Required |
| Phone | `TEL;TYPE=cell` | Optional |
| Email | `EMAIL` | Optional |
| Company/organization | `ORG` | Optional |
| Note | `NOTE` | Optional |
| Social profiles | `SOCIALPROFILE` | Comma-separated values become separate properties |
| GPS coordinates | `GEO:geo:` | Split on one comma and added when JavaScript `isNaN` treats both parts as numeric |
| Messengers | `IMPP` | Comma-separated values become separate properties |

Every generated value is wrapped in the standard structure:

```text
BEGIN:VCARD
VERSION:X.X
...
END:VCARD
```

The current implementation joins lines with line-feed characters (`\n`). It does not perform vCard escaping or line folding.

## Validation

- **Name** must contain at least one non-whitespace character.
- **Email** may be empty; otherwise it must match a basic `name@domain.tld` shape.
- **Phone** may be empty; otherwise it may contain digits, spaces, `+`, `-`, and parentheses.
- **GPS coordinates** are split on commas and added to a vCard 4.0 result when there are exactly two parts and JavaScript `isNaN` reports both as numeric. Empty parts can pass this check because `isNaN("")` is `false`; other rejected GPS input does not block submission and is omitted.
- Social-profile and messenger values are split on commas, trimmed, and emitted only when non-empty.

## QR Output and Clipboard Behavior

The result screen renders the QR code as SVG with `qrcode.react`.

When copying the QR code as an image, the application first uses `html2canvas` to capture the displayed QR container with a white background. The plain PNG canvas branch using `qrcode` is reached only when the displayed element is missing or the primary `ClipboardItem` branch is skipped. Failures during `html2canvas` loading or rendering, blob creation, or clipboard writing go directly to the result screen's vCard text-copy fallback.

PNG downloads are generated with `qrcode` in the browser. The separate **vCard text** action writes the raw generated vCard content to the clipboard.

### Telegram WebApp

When the app is opened inside a Telegram WebApp, the WebView sandbox blocks both `navigator.clipboard.write()` for images and the `<a download>` attribute for files. Long-press on `<img>` also fails in WebApp bot mode (it works in Telegram's built-in browser, but not when launched as a bot WebApp).

To deliver the QR image to the user, an optional Cloudflare Worker (`worker/`) sends the generated PNG to the bot chat via Bot API `sendPhoto`. The WebApp detects the worker URL via the `VITE_WORKER_URL` environment variable:

- **`VITE_WORKER_URL` set:** the "Send to chat" button POSTs the PNG and the signed `Telegram.WebApp.initData` to the worker, which forwards it as a photo to the user's chat with the bot. The WebApp then calls `Telegram.WebApp.close()` and the user sees the photo arrive in the chat.
- **`VITE_WORKER_URL` unset:** the Telegram flow falls back to a modal showing a large PNG with long-press instructions. This works in Telegram's built-in browser but is non-functional in WebApp bot mode.

The vCard-text copy action continues to work inside Telegram, because `navigator.clipboard.writeText()` is permitted by the WebView sandbox.

Full worker setup and architecture: [`TELEGRAM.md`](./TELEGRAM.md) and [`worker/README.md`](./worker/README.md).

## Technology Stack

- React 18
- React DOM 18
- Vite 5
- Tailwind CSS 4
- PostCSS and Autoprefixer
- `react-i18next` and `i18next` for localization
- `qrcode.react` for the displayed SVG QR code
- `qrcode` for canvas-based PNG generation
- `html2canvas` for capturing the displayed QR container
- Telegram WebApp SDK (loaded via CDN script in `index.html`) for language and theme detection

## Project Structure

```text
vcard_builder/
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── public/
└── src/
    ├── main.jsx
    ├── QRVCardApp.jsx
    ├── i18n.js
    ├── index.css
    ├── components/
    │   ├── FinalStep.jsx
    │   ├── NavigationFooter.jsx
    │   ├── NavigationHeader.jsx
    │   ├── QRForm.jsx
    │   ├── VersionSelector.jsx
    │   ├── WelcomeStep.jsx
    │   └── WizardForm.jsx
    ├── hooks/
    │   ├── useTelegram.js
    │   └── useTheme.js
    ├── locales/
    │   ├── en.json
    │   └── ru.json
    └── utils/
        └── qrUtils.js
```

Key responsibilities:

- `src/main.jsx` mounts the React application and initializes i18n.
- `src/QRVCardApp.jsx` renders the wizard and activates the theme hook.
- `src/i18n.js` configures `react-i18next` and resolves the initial language.
- `src/components/WizardForm.jsx` owns the current step, selected version, and final QR value.
- `src/components/VersionSelector.jsx` defines the supported versions and their form fields.
- `src/components/QRForm.jsx` validates input and builds the vCard text.
- `src/components/FinalStep.jsx` renders the result and exposes copy, download, and restart actions.
- `src/hooks/useTelegram.js` reads language and color scheme from the Telegram WebApp SDK safely.
- `src/hooks/useTheme.js` toggles the `.dark` class on `<html>` based on Telegram or system preference.
- `src/locales/{ru,en}.json` hold the translation resources.
- `src/utils/qrUtils.js` implements image clipboard and PNG download operations.
- `src/index.css` contains Tailwind imports, the `@custom-variant dark` directive, and the design-token CSS variables for both themes.

Generated directories such as `node_modules/` and `dist/` are not part of the source structure above.

## Setup and Development

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Limitations

- Data is held only in React state. Refreshing the page or restarting the wizard clears it.
- There is no backend, account system, authentication, or data synchronization.
- QR generation occurs only after the form is submitted; there is no live QR preview.
- Clipboard access depends on browser support, permissions, and a secure context such as HTTPS or localhost. Image clipboard support is more limited than text clipboard support.
- PNG download behavior depends on the browser's client-side download support.
- vCard values are inserted without escaping reserved characters or folding long lines, which may affect complex input or strict consumers.
- GPS values are checked for numeric shape but not for geographic latitude or longitude ranges.
