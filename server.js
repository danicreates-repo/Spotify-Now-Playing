require('dotenv').config({ path: '.env.local' });
const express = require('express');
const https = require('https');
const fs = require('fs');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8888;

// CORS Middleware - configurable origins
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: corsOrigins,
  methods: ['GET'],
  credentials: true
}));

// Environment variables
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

// We need a way to get the access token from the refresh token
const getAccessToken = async () => {
  const response = await axios.post(TOKEN_ENDPOINT, 
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }), {
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data.access_token;
};

// The main endpoint for the frontend to call
app.get('/api/now-playing', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204 || response.status > 400) {
      return res.status(200).json({ is_playing: false });
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching from Spotify API:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch from Spotify' });
  }
});

// Server startup - supports both HTTP and HTTPS based on configuration
const sslEnabled = process.env.SSL_ENABLED === 'true';

if (sslEnabled) {
  // HTTPS Configuration
  const sslCertPath = process.env.SSL_CERT_PATH || './ssl/fullchain.pem';
  const sslKeyPath = process.env.SSL_KEY_PATH || './ssl/privkey.pem';
  
  try {
    const sslOptions = {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath)
    };
    
    https.createServer(sslOptions, app).listen(port, '0.0.0.0', () => {
      console.log(`✅ HTTPS Backend server listening at https://0.0.0.0:${port}`);
      console.log(`🔒 SSL enabled with certificates from ${sslCertPath}`);
      console.log(`🌐 CORS origins: ${corsOrigins.join(', ')}`);
      console.log("This server securely connects to Spotify on your behalf with HTTPS + HTTP/2.");
    });
  } catch (error) {
    console.error('❌ SSL Certificate Error:', error.message);
    console.error('💡 Check your SSL_CERT_PATH and SSL_KEY_PATH in .env.local');
    console.error('💡 Or set SSL_ENABLED=false for HTTP-only mode');
    process.exit(1);
  }
} else {
  // HTTP Configuration (development/testing)
  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ HTTP Backend server listening at http://0.0.0.0:${port}`);
    console.log(`⚠️  SSL disabled - using HTTP only`);
    console.log(`🌐 CORS origins: ${corsOrigins.join(', ')}`);
    console.log("This server connects to Spotify on your behalf.");
  });
} 