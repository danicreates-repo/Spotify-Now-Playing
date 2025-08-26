#!/bin/bash

# SSL Setup Script for Spotify Now Playing
# This script helps configure SSL certificates for HTTPS deployment

echo "🔧 Spotify Now Playing - SSL Setup"
echo "=================================="

# Create SSL directory if it doesn't exist
mkdir -p ssl

# Check if SSL certificates already exist
if [ -f "ssl/privkey.pem" ] && [ -f "ssl/fullchain.pem" ]; then
    echo "✅ SSL certificates already exist in ssl/ directory"
    echo "📋 Current certificates:"
    ls -la ssl/
    exit 0
fi

echo "📋 SSL Certificate Setup Options:"
echo ""
echo "1. Copy from Let's Encrypt (for domains with existing certificates)"
echo "2. Create self-signed certificates (for development/testing)"
echo "3. Manual setup (I'll provide my own certificates)"
echo "4. Skip SSL setup (HTTP-only mode)"
echo ""

read -p "Choose an option (1-4): " choice

case $choice in
    1)
        echo ""
        read -p "Enter your domain name (e.g., yourdomain.com): " domain
        
        if [ -z "$domain" ]; then
            echo "❌ Domain name is required"
            exit 1
        fi
        
        CERT_PATH="/etc/letsencrypt/live/$domain"
        
        if [ ! -d "$CERT_PATH" ]; then
            echo "❌ Let's Encrypt certificates not found for $domain"
            echo "💡 Make sure certbot has generated certificates for this domain"
            exit 1
        fi
        
        echo "📋 Copying certificates from $CERT_PATH..."
        sudo cp "$CERT_PATH/fullchain.pem" ssl/
        sudo cp "$CERT_PATH/privkey.pem" ssl/
        sudo chown $USER:$USER ssl/*.pem
        chmod 644 ssl/fullchain.pem
        chmod 600 ssl/privkey.pem
        
        echo "✅ SSL certificates copied successfully!"
        ;;
        
    2)
        echo ""
        read -p "Enter your domain/hostname (e.g., localhost or yourdomain.com): " hostname
        
        if [ -z "$hostname" ]; then
            hostname="localhost"
        fi
        
        echo "🔐 Generating self-signed certificate for $hostname..."
        
        openssl req -x509 -newkey rsa:4096 -keyout ssl/privkey.pem -out ssl/fullchain.pem -days 365 -nodes \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=$hostname"
        
        chmod 600 ssl/privkey.pem
        chmod 644 ssl/fullchain.pem
        
        echo "✅ Self-signed certificate generated!"
        echo "⚠️  Note: Browsers will show security warnings for self-signed certificates"
        ;;
        
    3)
        echo ""
        echo "📋 Manual SSL Setup:"
        echo "1. Place your SSL certificate as: ssl/fullchain.pem"
        echo "2. Place your private key as: ssl/privkey.pem"
        echo "3. Set permissions: chmod 644 ssl/fullchain.pem && chmod 600 ssl/privkey.pem"
        echo ""
        echo "When ready, run the server with SSL_ENABLED=true in your .env.local"
        ;;
        
    4)
        echo ""
        echo "📋 HTTP-Only Setup:"
        echo "Set SSL_ENABLED=false in your .env.local file"
        echo "The server will run on HTTP (not recommended for production)"
        ;;
        
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎯 Next Steps:"
echo "1. Copy env.example to .env.local and configure your settings"
echo "2. Set SSL_ENABLED=true (or false for HTTP-only) in .env.local"
echo "3. Update CORS_ORIGINS with your domain(s)"
echo "4. Start the server: npm run server (or node server.js)"
echo ""
echo "📚 See README.md for complete setup instructions"
