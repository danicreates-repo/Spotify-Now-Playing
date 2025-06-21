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

### Local Testing (Windows)
```bash
npm start
```

### Production (Debian Linux)
```bash
npm run build
```

Serve the `build` folder with your web server (nginx, Apache, etc.)

### Environment Variables for Production
Update your `.env.local` file:
```env
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id_here
REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret_here
REACT_APP_REDIRECT_URI=https://yourdomain.com/callback
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

Built with ❤️ and React 