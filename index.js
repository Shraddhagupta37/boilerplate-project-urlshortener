require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const url = require('url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// Store URL mappings
if (!global.urlDatabase) {
  global.urlDatabase = {};
  global.urlCounter = 1;
}

// Add body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

  // Validate and store URL
  app.post('/api/shorturl', function(req, res) {
    const originalUrl = req.body.url;
    
    try {
      const parsedUrl = new url.URL(originalUrl);
      dns.lookup(parsedUrl.hostname, (err) => {
        if (err) {
          return res.json({ error: 'invalid url' });
        }
        
        const shortUrl = global.urlCounter++;
        global.urlDatabase[String(shortUrl)] = originalUrl;
        res.json({ original_url: originalUrl, short_url: shortUrl });
      });
    } catch (e) {
      res.json({ error: 'invalid url' });
    }
  });

  app.get('/api/shorturl/:short_url', function(req, res) {
    const shortUrl = req.params.short_url;
    const originalUrl = global.urlDatabase[shortUrl];
    
    if (originalUrl) {
      res.redirect(originalUrl);
    } else {
      res.json({ error: 'No short URL found for the given input' });
    }
  });

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
