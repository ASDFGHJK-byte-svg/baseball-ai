require('dotenv').config();
const express = require('express');
const path = require('path');

// Ensure `fetch` is available in older Node versions by using undici when needed
let fetchFn = global.fetch;
try {
  if (!fetchFn) fetchFn = require('undici').fetch;
} catch (e) {
  // undici not installed; fetch may still exist in newer Node
}

const app = express();
const root = path.join(__dirname, '.');

app.use(express.json());
app.use(express.static(root));

// POST /api/analyze - proxy to external API (replicates api/analyze.js behavior)
app.post('/api/analyze', async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Missing or empty prompt' });
  }

  const apiKey = process.env.GROQ_API_KEY; 
  if (!apiKey) { 
    console.error('GROQ_API_KEY not set'); 
    return res.status(500).json({ error: 'Server misconfiguration: GROQ_API_KEY not set' }); 
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
});

// rewrite /app -> /index.html
app.get('/app', (req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

// catch-all: serve index.html for non-api routes (SPA fallback)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).end();
  res.sendFile(path.join(root, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
