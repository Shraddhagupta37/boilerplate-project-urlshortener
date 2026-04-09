require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { URL } = require('url');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// In-memory storage
let urlDatabase = {};
let urlCounter = 1;

// Home route
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Test endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// ✅ URL Shortener Endpoint (FIXED)
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  let hostname;

  try {
    const parsedUrl = new URL(originalUrl);

    // Check protocol
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return res.json({ error: 'invalid url' });
    }

    hostname = parsedUrl.hostname;

  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

  // ✅ DNS lookup (THIS FIXES FCC TEST #3)
  dns.lookup(hostname, (err, address) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const shortUrl = urlCounter++;
    urlDatabase[shortUrl] = originalUrl;

    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    });
  });
});

// Redirect endpoint
app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

// Start server
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});