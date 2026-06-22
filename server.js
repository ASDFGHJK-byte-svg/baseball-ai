const express = require('express');
const path = require('path');

const app = express();
const root = path.join(__dirname, '.');

app.use(express.json());
app.use(express.static(root));

// POST /api/analyze - proxy to external API (replicates api/analyze.js behavior)
app.post('/api/analyze', async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt } = req.body || {};

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
