export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Missing or empty prompt' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('GROQ_API_KEY not set');
    return res.status(500).json({ error: 'Server misconfiguration: GROQ_API_KEY not set' });
  }

  // Ensure `fetch` is available (serverless runtimes usually have it,
  // but for local Node.js testing we can try to use undici)
  let fetchFn = global.fetch;
  try {
    if (!fetchFn) fetchFn = require('undici').fetch;
  } catch (e) {
    // undici not installed; hope runtime provides fetch
  }

  try {
    const response = await (fetchFn || fetch)('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const contentType = response.headers.get('content-type') || '';
    if (response.ok) {
      const data = await response.json();
      return res.status(200).json(data);
    } else {
      if (contentType.includes('application/json')) {
        const data = await response.json();
        console.error('Upstream API error', response.status, data);
        return res.status(502).json({ error: 'Upstream API error', details: data, status: response.status });
      } else {
        const text = await response.text();
        console.error('Upstream API error', response.status, text);
        return res.status(502).json({ error: 'Upstream API error', details: text, status: response.status });
      }
    }

  } catch (err) {
    console.error('Request failed', err);
    return res.status(500).json({ error: 'Request failed', message: err.message });
  }
}