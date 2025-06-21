require('dotenv').config({ path: '.env.local' });
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const port = 8888;

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
// This can be any unused port on your local machine. 8888 is common.
const redirectUri = `http://127.0.0.1:${port}/callback`;

if (!clientId || !clientSecret) {
  console.error("\nERROR: REACT_APP_SPOTIFY_CLIENT_ID and REACT_APP_SPOTIFY_CLIENT_SECRET must be set in your .env.local file before running this script.");
  process.exit(1);
}

app.get('/login', (req, res) => {
  const scope = 'user-read-currently-playing user-read-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
    }));
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
      }
    });

    const refreshToken = response.data.refresh_token;

    console.log('\n--------------------------------------------------');
    console.log('✅ Success! Here is your Refresh Token:');
    console.log(`\n${refreshToken}\n`);
    console.log('Please copy this token and add it to your .env.local file as:');
    console.log(`SPOTIFY_REFRESH_TOKEN=${refreshToken}`);
    console.log('\nThen, you can stop this script with Ctrl+C.');
    console.log('--------------------------------------------------\n');
    
    res.send('<h1>Success!</h1><p>You can close this window and check your terminal for the refresh token.</p>');
    server.close();

  } catch (error) {
    console.error('Error getting refresh token:', error.response ? error.response.data : error.message);
    res.send('<h1>Error</h1><p>Failed to get refresh token. Please check your terminal.</p>');
    server.close();
  }
});

const server = app.listen(port, () => {
  console.log(`\n### ONE-TIME REFRESH TOKEN GENERATOR ###\n`);
  console.log('IMPORTANT: Make sure you have added the following URL to your Spotify App\'s Redirect URIs in the developer dashboard:');
  console.log(`>>> ${redirectUri} <<<\n`);
  console.log(`Then, open your browser and navigate to:\nhttp://127.0.0.1:${port}/login\n`);
  console.log('After logging in with your Spotify account, your Refresh Token will be printed here.');
}); 