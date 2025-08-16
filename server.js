const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

// Ganti ini dengan URL Google Apps Script kamu
const GAS_URL = "https://script.google.com/macros/s/AKfycbw.../exec";

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.post('/proxy', async (req, res) => {
  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const result = await response.text();
    res.send(result);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server is running at http://localhost:${PORT}`);
});
