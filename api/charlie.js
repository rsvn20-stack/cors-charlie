export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing "url" query parameter' });
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(targetUrl).host,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    const contentType = response.headers.get('content-type') || '';

    // Forward CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (contentType.includes('application/json')) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      // Jika bukan JSON, misal image atau file, kirim buffer mentah
      const buffer = await response.arrayBuffer();
      res.status(response.status);
      res.setHeader('Content-Type', contentType);
      res.send(Buffer.from(buffer));
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
