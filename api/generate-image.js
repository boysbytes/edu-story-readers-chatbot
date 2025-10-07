// Vercel Serverless Function - proxies image generation requests to the
// external Imagen API so the API key stays server-side (not exposed to clients).
// Export as ESM default to match repository "type": "module".
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Vercel usually provides parsed body on req.body, but be defensive and
    // attempt to parse the raw body if needed.
    let body = req.body;
    if (!body || Object.keys(body).length === 0) {
      try {
        body = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(data ? JSON.parse(data) : {}));
          req.on('error', reject);
        });
      } catch (e) {
        // fall through; body may remain empty
      }
    }

    const prompt = body && body.prompt;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    // Diagnostic shortcut: POST { prompt: "__status_check__" } to get a safe
    // boolean report about whether server-side env vars are configured.
    if (prompt === '__status_check__') {
      return res.status(200).json({
        ok: true,
        hasGenerativeKey: Boolean(process.env.GENERATIVE_API_KEY),
        hasViteKey: Boolean(process.env.VITE_IMG_API_KEY),
      });
    }

    // Prefer a server-side key named GENERATIVE_API_KEY (set this in Vercel).
    // For backward compatibility, we also accept VITE_IMG_API_KEY if present.
    const apiKey = process.env.GENERATIVE_API_KEY || process.env.VITE_IMG_API_KEY || '';
    if (!apiKey) return res.status(500).json({ error: 'No API key configured on server' });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

    const payload = { instances: { prompt }, parameters: { sampleCount: 1 } };

    let response;
    try {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (fetchErr) {
      console.error('generate-image fetch failed:', fetchErr && fetchErr.message ? fetchErr.message : fetchErr);
      return res.status(502).json({ error: 'Upstream fetch failed', message: String(fetchErr && fetchErr.message ? fetchErr.message : fetchErr) });
    }

    if (!response.ok) {
      // Try to read body safely; limit length to avoid huge outputs
      let text = '';
      try {
        const full = await response.text();
        text = full ? full.substring(0, 2000) : '';
      } catch (e) {
        console.error('Failed to read upstream response body:', e);
      }
      console.error('generate-image upstream error', { status: response.status, bodySnippet: text });
      return res.status(502).json({ error: 'Upstream API error', status: response.status, bodySnippet: text });
    }

    const json = await response.json();
    // Return the upstream JSON directly so the client can reuse existing logic.
    return res.status(200).json(json);
  } catch (err) {
    console.error('generate-image fn error:', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
