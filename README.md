# QR vCard Builder

QR vCard Generator is a browser-based React application for creating a QR code that contains contact information in vCard format. The application supports vCard 2.1, 3.0, and 4.0, and keeps all entered data in the browser for the current session.

The user interface is currently in Russian.

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

## Technology Stack

- React 18
- React DOM 18
- Vite 5
- Tailwind CSS 4
- PostCSS and Autoprefixer
- `qrcode.react` for the displayed SVG QR code
- `qrcode` for canvas-based PNG generation
- `html2canvas` for capturing the displayed QR container

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
    ├── index.css
    ├── components/
    │   ├── FinalStep.jsx
    │   ├── NavigationFooter.jsx
    │   ├── NavigationHeader.jsx
    │   ├── QRForm.jsx
    │   ├── VersionSelector.jsx
    │   ├── WelcomeStep.jsx
    │   └── WizardForm.jsx
    └── utils/
        └── qrUtils.js
```

Key responsibilities:

- `src/main.jsx` mounts the React application.
- `src/QRVCardApp.jsx` renders the wizard.
- `src/components/WizardForm.jsx` owns the current step, selected version, and final QR value.
- `src/components/VersionSelector.jsx` defines the supported versions and their form fields.
- `src/components/QRForm.jsx` validates input and builds the vCard text.
- `src/components/FinalStep.jsx` renders the result and exposes copy, download, and restart actions.
- `src/utils/qrUtils.js` implements image clipboard and PNG download operations.
- `src/index.css` contains Tailwind imports and the application styles.

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

- The UI is available only in Russian.
- Data is held only in React state. Refreshing the page or restarting the wizard clears it.
- There is no backend, account system, authentication, or data synchronization.
- QR generation occurs only after the form is submitted; there is no live QR preview.
- Clipboard access depends on browser support, permissions, and a secure context such as HTTPS or localhost. Image clipboard support is more limited than text clipboard support.
- PNG download behavior depends on the browser's client-side download support.
- vCard values are inserted without escaping reserved characters or folding long lines, which may affect complex input or strict consumers.
- GPS values are checked for numeric shape but not for geographic latitude or longitude ranges.
