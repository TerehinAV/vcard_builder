# Telegram WebApp integration

The Telegram WebApp ships from the same static bundle as the browser version. Two environment variables control its behavior. Neither is required for the app to run; they only unlock Telegram-specific delivery flows.

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_WORKER_URL` | no | URL of a Cloudflare Worker (or any serverless function) that delivers the generated QR PNG to the user's bot chat via Bot API `sendPhoto`. When unset, the Telegram flow falls back to the long-press modal (which works in Telegram's built-in browser but not in WebApp bot mode). |

## Why a worker is needed

Telegram WebView in WebApp bot mode blocks both `navigator.clipboard.write()` for images and `<a download>` for files. Long-press on `<img>` also does not surface the OS save menu. The only way to deliver a generated PNG to the user is to send it through the Bot API from a server that holds the bot token.

Worker responsibilities:

1. Verify the `Telegram.WebApp.initData` HMAC signature against the bot token (so attackers cannot send requests on behalf of other users).
2. Decode the base64 PNG posted by the WebApp.
3. Call `sendPhoto` with `chat_id` extracted from the verified `initData`.
4. Return `{ ok: true }`. The WebApp then calls `Telegram.WebApp.close()`.

The bot token lives only in the worker's secret store — it never reaches the client bundle.

## Deploy the worker

See [`worker/README.md`](./worker/README.md) for full instructions. Summary:

```bash
cd worker
npm install -g wrangler
wrangler login
cp wrangler.toml.example wrangler.toml
wrangler secret put BOT_TOKEN
wrangler secret put WEBAPP_URL   # e.g. https://terehinav.github.io
wrangler deploy
```

The deploy command prints a URL like `https://vcard-send-qr.<account>.workers.dev`.

## Point the WebApp at the worker

Create `.env` in the project root:

```
VITE_WORKER_URL=https://vcard-send-qr.<account>.workers.dev
```

Then rebuild and redeploy the WebApp. In GitHub Actions, add `VITE_WORKER_URL` as a repository secret (Settings → Secrets and variables → Actions) and update `.github/workflows/deploy.yml` to expose it:

```yaml
- run: npm run build
  env:
    VITE_WORKER_URL: \${{ secrets.VITE_WORKER_URL }}
```

## Final-step behavior matrix

| Context | `VITE_WORKER_URL` set | `VITE_WORKER_URL` unset |
| --- | --- | --- |
| **Telegram WebApp (bot mode)** | Click "Send to chat" → photo appears in bot chat → WebApp closes | Modal with long-press instructions (long-press does NOT work in WebApp bot mode) |
| **Telegram built-in browser** | n/a (uses browser flow) | Modal works — long-press saves image |
| **Regular browser (outside Telegram)** | n/a (uses browser flow) | Native `clipboard.write` + `<a download>` work directly |
