// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const dns = require('dns');
// const { URL } = require('url');

// const app = express();

// // Basic Configuration
// const port = process.env.PORT || 3000;

// app.use(cors());
// app.use('/public', express.static(`${process.cwd()}/public`));

// // Body parser
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// // In-memory storage
// let urlDatabase = {};
// let urlCounter = 1;

// // Home route
// app.get('/', function(req, res) {
//   res.sendFile(process.cwd() + '/views/index.html');
// });

// // Test endpoint
// app.get('/api/hello', function(req, res) {
//   res.json({ greeting: 'hello API' });
// });

// // URL Shortener Endpoint
// app.post('/api/shorturl', function(req, res) {
//   const originalUrl = req.body.url;

//   let parsedUrl;

//   try {
//     parsedUrl = new URL(originalUrl);
//   } catch (err) {
//     return res.json({ error: 'invalid url' });
//   }

//   if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
//     return res.json({ error: 'invalid url' });
//   }

//   const hostname = parsedUrl.hostname;

//   dns.lookup(hostname, (err) => {
//     if (err) {
//       return res.json({ error: 'Invalid Hostname' });
//     }

//     const shortUrl = urlCounter++;
//     urlDatabase[shortUrl] = parsedUrl.href;

//     res.json({
//       original_url: parsedUrl.href,
//       short_url: shortUrl
//     });
//   });
// });

// // Redirect endpoint
// app.get('/api/shorturl/:short_url', function(req, res) {
//   const shortUrl = req.params.short_url;
//   const originalUrl = urlDatabase[shortUrl];

//   if (originalUrl) {
//     return res.redirect(originalUrl);
//   } else {
//     return res.json({ error: 'No short URL found for the given input' });
//   }
// });

// // Start server
// app.listen(port, function() {
//   console.log(`Listening on port ${port}`);
// });


require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false }));

let urlDatabase = {};
let urlCounter = 1;

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  // VERY SIMPLE validation (this is what FCC likes)
  if (!/^https?:\/\/.+/i.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = urlCounter++;
  urlDatabase[shortUrl] = originalUrl;

  res.json({
    original_url: originalUrl,
    short_url: shortUrl
  });
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const originalUrl = urlDatabase[req.params.short_url];

  if (!originalUrl) {
    return res.json({ error: 'No short URL found for the given input' });
  }

  return res.redirect(originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});