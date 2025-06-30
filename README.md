# Spotify Now Playing

A self-hosted, real-time display of your currently playing Spotify track. It features a dynamic background that changes based on album art and is designed to be embedded or displayed as a standalone page.

This project uses a secure client-server architecture to protect your Spotify credentials.


## Features

-   🎵 **Real-time Track Display**: Shows your currently playing track with a smooth, locally-updating progress bar.
-   🖼️ **Dynamic Album Art Background**: The page background elegantly transitions to a blurred, tinted version of the current song's album art.
-   🔐 **Secure**: Your credentials and refresh token are kept safe on the backend and are never exposed to the client.
-   🚀 **Efficient**: Reduces API calls by using a smart timer and only fetching new data when necessary.
-   🎉 **"Join the Party" Button**: Allows viewers to instantly open the currently playing track in their own Spotify app.
-   📱 **Responsive Design**: Looks great on desktop and mobile devices.

## Architecture

This project consists of two parts that run concurrently:

1.  **React Frontend** (`/src`): A modern React application that displays the "Now Playing" information. It is responsible for all UI and polls our own backend for data.
2.  **Node.js Backend** (`server.js`): A lightweight Express server that securely handles communication with the Spotify API. It uses a long-lived Refresh Token to get your "Now Playing" data without needing to re-authenticate.

## Project Setup

### 1. Initial Spotify App Setup

1.  Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create a new App.
2.  Get your **Client ID** and **Client Secret**.
3.  Add a **Redirect URI** to your Spotify App settings. For the initial setup, this must be `http://127.0.0.1:8888/callback`.

### 2. Environment Variables

In the project's root directory, create a file named `.env.local`. This file will hold all your secret keys.

Copy the following into `.env.local`, adding your own credentials:

```env
# Credentials from your Spotify App
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id_here
REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret_here

# Leave this blank for now
SPOTIFY_REFRESH_TOKEN=
```

### 3. Get Your Refresh Token

The backend needs a long-lived `Refresh Token` to access your Spotify data. We'll use a one-time script to generate this.

1.  Install the project dependencies:
    ```bash
    npm install
    ```
2.  Run the special refresh token script:
    ```bash
    node getRefreshToken.js
    ```
3.  Follow the instructions in your terminal. It will ask you to open a URL in your browser, log in to Spotify, and grant permission.
4.  Once you do, your `Refresh Token` will be printed in the terminal. **Copy it**.
5.  Open your `.env.local` file again and paste the token into the `SPOTIFY_REFRESH_TOKEN` variable.

You only need to do this once. You can now remove the `http://127.0.0.1:8888/callback` URI from your Spotify App settings if you wish.

## Running Locally

To run the project for local development, you need to run the frontend and backend in **two separate terminals**.

**Terminal 1: Start the Backend**

```bash
node server.js
```

**Terminal 2: Start the Frontend**

```bash
npm start
```

Your app will be available at `http://127.0.0.1:3000`.

## Production Deployment (Debian/Ubuntu)

These instructions outline how to deploy the application to a production Linux server using Nginx and PM2.

1.  **Prerequisites**: Ensure your server has `git`, `nodejs` (v16+), and `npm` installed.
2.  **Clone Your Project**:
    ```bash
    git clone <your_repo_url>
    cd <your_project_folder>
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Create Production Environment File**:
    Create a `.env.local` file on the server (`nano .env.local`) and paste in your three required variables (`REACT_APP_SPOTIFY_CLIENT_ID`, `REACT_APP_SPOTIFY_CLIENT_SECRET`, and the `SPOTIFY_REFRESH_TOKEN`).
5.  **Build the React App**:
    ```bash
    npm run build
    ```
6.  **Install PM2 and Nginx**:
    ```bash
    npm install -g pm2
    sudo apt install nginx
    ```
7.  **Start the Backend with PM2**:
    ```bash
    pm2 start server.js --name "nowplaying-backend"
    pm2 save
    ```
8.  **Configure Nginx**:
    Create a new Nginx config file: `sudo nano /etc/nginx/sites-available/your-domain.com`. Paste in the configuration below, making sure to replace `your-domain.com` and the `root` path.

    ```nginx
    server {
        listen 80;
        server_name your-domain.com;

        root /path/to/your/project/build;
        index index.html;

        location / {
            try_files $uri /index.html;
        }

        location /api {
            proxy_pass http://127.0.0.1:8888;
        }
    }
    ```
9.  **Enable the Site & Secure It**:
    ```bash
    # Enable the site
    sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/
    
    # Test Nginx config
    sudo nginx -t

    # Install Certbot for SSL
    sudo apt install certbot python3-certbot-nginx
    
    # Get and install a certificate
    sudo certbot --nginx -d your-domain.com

    # Reload Nginx to apply all changes
    sudo systemctl reload nginx
    ```

Your application is now live!

## Project Structure

```
.
├── /build/             # Production build of the React app
├── /node_modules/      # Dependencies
├── /public/            # Public assets for the React app
├── /src/               # React app source code
│   ├── /components/
│   │   └── NowPlaying.js
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   └── index.js
├── .env.local          # (Crucial, must be created manually) Holds all secrets
├── .gitignore
├── getRefreshToken.js  # One-time script to get your Spotify Refresh Token
├── package.json
├── README.md
└── server.js           # The backend Node.js/Express server
```

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ and React 