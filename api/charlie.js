export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    // Handle CORS preflight request
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(204).end();
  }

  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    const response = await fetch(url);

    // Dapatkan content-type dalam lowercase
    const contentType = (response.headers.get('content-type') || '').toLowerCase();

    // Set header CORS untuk semua response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (contentType.includes('application/json')) {
      try {
        const data = await response.json();
        res.status(response.status).json(data);
      } catch (error) {
        res.status(500).json({ error: 'Failed to parse JSON response' });
      }
    } else {
      // Untuk selain JSON, kirim buffer mentahnya
      const buffer = await response.arrayBuffer();
      res.status(response.status);
      res.setHeader('Content-Type', contentType);
      res.send(Buffer.from(buffer));
    }
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
}
