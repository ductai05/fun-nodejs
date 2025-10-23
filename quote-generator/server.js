const express = require('express');
const cors = require('cors');
const path = require('path');
const quotes = require('./api/quotes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Disable automatic trailing slash redirect
app.set('strict routing', true);

// API endpoint
app.get('/api', (req, res) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  res.json({
    success: true,
    quote: randomQuote,
    totalQuotes: quotes.length
  });
});

// API endpoint with trailing slash
app.get('/api/', (req, res) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  res.json({
    success: true,
    quote: randomQuote,
    totalQuotes: quotes.length
  });
});

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve static files (for CSS, JS, etc.)
app.use(express.static('.'));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📱 Open your browser and visit: http://localhost:${PORT}`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
});
