// Vercel Serverless Function - proxies image generation requests to the
// external Imagen API so the API key stays server-side (not exposed to clients).
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    // Prefer a server-side key named GENERATIVE_API_KEY (set this in Vercel).
    // For backward compatibility, we also accept VITE_IMG_API_KEY if present.
    const apiKey = process.env.GENERATIVE_API_KEY || process.env.VITE_IMG_API_KEY || '';
    if (!apiKey) return res.status(500).json({ error: 'No API key configured on server' });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

    const payload = { instances: { prompt }, parameters: { sampleCount: 1 } };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ error: 'Upstream API error', status: response.status, details: text });
    }

    const json = await response.json();
    // Return the upstream JSON directly so the client can reuse existing logic.
    return res.status(200).json(json);
  } catch (err) {
    console.error('generate-image fn error:', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
};
