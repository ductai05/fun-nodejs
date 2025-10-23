const quotes = require('./quotes.js');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Get a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    res.status(200).json({
      success: true,
      quote: randomQuote,
      totalQuotes: quotes.length
    });
  } else if (req.method === 'POST') {
    // Handle POST request (for future features)
    res.status(200).json({
      success: true,
      message: 'POST request received'
    });
  } else {
    res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
};

