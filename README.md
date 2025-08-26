# Spotify Now Playing

A beautiful React web application that displays your currently playing Spotify track in real-time. Perfect for sharing what you're listening to with friends or displaying on your website.

## Features

- 🎵 **Real-time Track Display**: Shows currently playing track with live progress updates
- 🖼️ **Album Art**: Displays high-quality album cover art
- ⏱️ **Progress Bar**: Visual progress indicator with current time and duration
- 🎉 **Join the Party**: One-click button to open the track in your local Spotify app
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🔐 **Secure Authentication**: OAuth 2.0 flow with automatic token refresh
- 🎨 **Beautiful UI**: Modern, glassmorphism design with smooth animations

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Spotify account
- Spotify Developer account

## Setup

### 1. Spotify App Configuration

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add the following redirect URIs:
   - `http://127.0.0.1:3000/callback` (for local development)
   - `https://yourdomain.com/callback` (for production)
4. Copy your Client ID and Client Secret

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id_here
REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret_here
REACT_APP_REDIRECT_URI=http://127.0.0.1:3000/callback
```

### 3. Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://127.0.0.1:3000`

## Usage

1. Click "Connect to Spotify" to authenticate
2. Grant the required permissions
3. Start playing music on Spotify
4. Your currently playing track will appear with live updates
5. Click "Join the Party" to open the track in your Spotify app

## API Scopes

The app requests the following Spotify API scopes:
- `user-read-currently-playing`: Read currently playing track
- `user-read-playback-state`: Read playback state
- `user-read-recently-played`: Read recently played tracks

## Deployment

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd nowplaying
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your Spotify credentials and configuration
   ```

3. **Choose Deployment Mode**

### Option A: Local Development (HTTP)
```bash
# In .env.local, set:
SSL_ENABLED=false
CORS_ORIGINS=http://localhost:3000

# Start both client and server
npm run dev
```

### Option B: Production with HTTPS

1. **SSL Certificate Setup**
   ```bash
   npm run setup-ssl
   # Follow the interactive prompts to configure SSL
   ```

2. **Configure Environment**
   ```env
   # In .env.local
   SSL_ENABLED=true
   SSL_CERT_PATH=./ssl/fullchain.pem
   SSL_KEY_PATH=./ssl/privkey.pem
   CORS_ORIGINS=https://yourdomain.com,https://api.yourdomain.com
   PORT=8888
   ```

3. **Build and Deploy**
   ```bash
   # Build the React app
   npm run build
   
   # Start the API server
   npm run server
   ```

4. **Firewall Configuration**
   ```bash
   # Open the port (replace 8888 with your PORT if different)
   sudo ufw allow 8888/tcp
   ```

### Option C: External API Usage

If you want to use this API from another website:

1. **Add your domain to CORS_ORIGINS**
   ```env
   CORS_ORIGINS=https://yoursite.com,https://yourdomain.com:8888
   ```

2. **Configure client to use external API**
   ```env
   # In your external site's environment
   REACT_APP_API_BASE_URL=https://yourdomain.com:8888
   ```

### Environment Variables Reference

Create `.env.local` file (copy from `env.example`):

```env
# Required: Spotify API credentials
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id_here
REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here

# Server configuration
PORT=8888
NODE_ENV=production

# SSL Configuration
SSL_ENABLED=true                    # Set to false for HTTP-only
SSL_CERT_PATH=./ssl/fullchain.pem   # Path to SSL certificate
SSL_KEY_PATH=./ssl/privkey.pem      # Path to SSL private key

# CORS origins (comma-separated)
CORS_ORIGINS=https://yourdomain.com,http://localhost:3000

# Optional: Override API URL for client
REACT_APP_API_BASE_URL=https://yourdomain.com:8888
```

## Project Structure

```
src/
├── components/
│   ├── NowPlaying.js      # Main track display component
│   ├── NowPlaying.css     # Component styles
│   └── Callback.js        # OAuth callback handler
├── services/
│   └── spotifyService.js  # Spotify API integration
├── App.js                 # Main app component
├── App.css               # App styles
├── index.js              # React entry point
└── index.css             # Global styles
```

## Security Notes

- Client secret is stored in environment variables
- Tokens are stored in localStorage (consider using httpOnly cookies for production)
- All API calls are made server-side to protect credentials
- OAuth state parameter prevents CSRF attacks

## Future Enhancements

- 🎨 Three.js music visualization
- 🎤 Desktop audio capture
- 📊 Queue sharing functionality
- 🎵 Animated cover art support
- 🌐 WebSocket real-time updates

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**: Ensure your redirect URI exactly matches what's configured in Spotify Dashboard
2. **"No valid token available"**: Try logging out and re-authenticating  
3. **"Nothing currently playing"**: Make sure you have an active Spotify session with music playing
4. **"SSL Certificate Error"**: Check your SSL certificate paths in `.env.local` or set `SSL_ENABLED=false` for HTTP
5. **"CORS Error"**: Add your domain to `CORS_ORIGINS` in `.env.local`
6. **"Connection Timeout"**: Ensure firewall port is open and server is binding to `0.0.0.0`
7. **"Permission denied" on SSL files**: Run `chmod 600 ssl/privkey.pem && chmod 644 ssl/fullchain.pem`

### Development vs Production

- **Development**: Use `SSL_ENABLED=false` and `npm run dev` for local testing
- **Production**: Use `SSL_ENABLED=true` with valid certificates and `npm run server`
- **External API**: Set appropriate `CORS_ORIGINS` and `REACT_APP_API_BASE_URL`

### Development Tips

- Use browser dev tools to monitor network requests
- Check console for detailed error messages
- Verify environment variables are loaded correctly

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---
