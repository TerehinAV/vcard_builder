# Worker: send-qr

Serverless endpoint for sending a generated QR PNG from the Telegram WebApp to the user's chat with the bot.

## Why this exists

Telegram WebView blocks both `navigator.clipboard.write()` for images and `<a download>` for files. There is no client-only way to deliver a generated PNG to the user. This worker takes the PNG (already generated client-side via `qrcode.toDataURL`) and forwards it to the bot chat using the Bot API `sendPhoto` method.

## Prerequisites

- A Telegram bot created via [@BotFather](https://t.me/BotFather) with its token
- A WebApp attached to the bot via `/newapp` (or `/setmenubutton`), pointing at your GitHub Pages URL
- Node.js 18+ and the [wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## Deploy

```bash
cd worker
npm install -g wrangler        # if not already installed
wrangler login

cp wrangler.toml.example wrangler.toml
wrangler secret put BOT_TOKEN   # paste your bot token from BotFather
wrangler secret put WEBAPP_URL  # paste your pages origin, e.g. https://terehinav.github.io

wrangler deploy
```

The deploy command will print a URL like `https://vcard-send-qr.<your-subdomain>.workers.dev`. Copy it.

## Configure the WebApp

In the repo root, create `.env` (or set in CI):

```
VITE_WORKER_URL=https://vcard-send-qr.<your-subdomain>.workers.dev
```

Rebuild and redeploy the WebApp (`git push origin main`). The Telegram flow now sends the PNG to chat and closes the WebApp.

If `VITE_WORKER_URL` is not set, the WebApp falls back to the long-press modal flow.

## Security

- The bot token lives only in Cloudflare secrets — it never reaches the client bundle
- `initData` is signed by Telegram with HMAC-SHA256 over the bot token; the worker validates that signature before forwarding the photo, so an attacker cannot spoof a request for another user
- CORS is locked down to `WEBAPP_URL` so only your deployed WebApp can call the endpoint

## API

### `POST /`

Request body:
```json
{
  "initData": "<Telegram.WebApp.initData>",
  "image": "data:image/png;base64,..."
}
```

Responses:
- `200 { ok: true }` — photo delivered
- `400 { ok: false, error: "missing_params" | "invalid_image" | "bot_not_started" | "bot_api_error", description?: string }`
- `401 { ok: false, error: "invalid_init_data" }`
- `405 { ok: false, error: "method_not_allowed" }`
- `500 { ok: false, error: "server_misconfigured" }` — `BOT_TOKEN` not set
