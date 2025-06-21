require('dotenv').config({ path: '.env.local' });
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 8888;

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

app.listen(port, () => {
  console.log(`✅ Backend server listening at http://127.0.0.1:${port}`);
  console.log("This server securely connects to Spotify on your behalf.");
}); 