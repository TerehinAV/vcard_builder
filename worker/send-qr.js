const BOT_API_BASE = 'https://api.telegram.org/bot';

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.WEBAPP_URL || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return json({ ok: false, error: 'method_not_allowed' }, 405, corsHeaders);
    }

    const botToken = env.BOT_TOKEN;
    if (!botToken) {
      return json({ ok: false, error: 'server_misconfigured' }, 500, corsHeaders);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: 'invalid_json' }, 400, corsHeaders);
    }

    const { initData, image } = body;
    if (!initData || !image) {
      return json({ ok: false, error: 'missing_params' }, 400, corsHeaders);
    }

    const userId = await verifyInitData(initData, botToken);
    if (!userId) {
      return json({ ok: false, error: 'invalid_init_data' }, 401, corsHeaders);
    }

    const pngBytes = decodeBase64Png(image);
    if (!pngBytes) {
      return json({ ok: false, error: 'invalid_image' }, 400, corsHeaders);
    }

    const formData = new FormData();
    formData.append('chat_id', String(userId));
    formData.append('photo', new Blob([pngBytes], { type: 'image/png' }), 'vcard-qr.png');

    const botResponse = await fetch(`${BOT_API_BASE}${botToken}/sendPhoto`, {
      method: 'POST',
      body: formData,
    });

    const botData = await botResponse.json();

    if (!botData.ok) {
      const errorCode = botData.error_code === 403 ? 'bot_not_started' : 'bot_api_error';
      return json({ ok: false, error: errorCode, description: botData.description }, 400, corsHeaders);
    }

    return json({ ok: true }, 200, corsHeaders);
  },
};

async function verifyInitData(initData, botToken) {
  const params = new URLSearchParams(initData);
  const receivedHash = params.get('hash');
  params.delete('hash');

  if (!receivedHash) return null;

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const encoder = new TextEncoder();

  const secretKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode('WebAppData'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const secretBuffer = await crypto.subtle.sign('HMAC', secretKey, encoder.encode(botToken));
  const secret = new Uint8Array(secretBuffer);

  const hashKey = await crypto.subtle.importKey(
    'raw',
    secret,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const computedBuffer = await crypto.subtle.sign('HMAC', hashKey, encoder.encode(dataCheckString));
  const computedHex = bytesToHex(new Uint8Array(computedBuffer));

  if (computedHex !== receivedHash) return null;

  const userJson = params.get('user');
  if (!userJson) return null;

  try {
    const user = JSON.parse(userJson);
    return typeof user.id === 'number' ? user.id : null;
  } catch {
    return null;
  }
}

function decodeBase64Png(dataUrl) {
  const match = typeof dataUrl === 'string' ? dataUrl.match(/^data:image\/png;base64,(.+)$/) : null;
  const base64 = match ? match[1] : dataUrl;
  if (typeof base64 !== 'string' || base64.length === 0) return null;
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function json(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}
