export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    // Handle preflight CORS requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(204).end();
  }

  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(targetUrl).host
      },
      body: ['POST', 'PUT'].includes(req.method) ? JSON.stringify(req.body) : undefined,
    });

    // Copy headers from upstream response
    response.headers.forEach((value, name) => {
      res.setHeader(name, value);
    });

    const buffer = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
}
