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

    const data = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
