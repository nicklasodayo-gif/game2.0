# Deployment Guide

## Prerequisites

- Node.js 18+
- npm 9+
- Git

## Build for Production

```bash
# Install dependencies
npm install

# Build
npm run build

# Preview production build
npm run preview
```

Output will be in `dist/` folder.

## Environment Variables

Create `.env.production`:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Deployment Options

### Vercel

1. Connect GitHub repository
2. Vercel auto-detects Vite configuration
3. Set environment variables
4. Deploy

```bash
# Using CLI
npm i -g vercel
vercel --prod
```

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables
5. Deploy

### Static Hosting (Apache/Nginx)

Copy `dist/` contents to web root:

```bash
# Apache
cp -r dist/* /var/www/html/

# Nginx
cp -r dist/* /usr/share/nginx/html/
```

### Docker

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
```

Build and run:

```bash
docker build -t activation-game .
docker run -p 80:80 activation-game
```

## Kiosk Mode Setup

For dedicated kiosk displays:

1. Build the app
2. Use kiosk browser (Chrome Kiosk mode)
3. Configure autostart and fullscreen

### Chrome Kiosk

```bash
# Windows
chrome.exe --kiosk http://your-domain.com

# Linux
google-chrome --kiosk http://your-domain.com

# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk http://your-domain.com
```

### Raspberry Pi Kiosk

```bash
# Install dependencies
sudo apt update
sudo apt install -y chromium-browser unclutter

# Edit autostart
sudo nano /etc/xdg/autostart/kiosk.desktop

[Desktop Entry]
Type=Application
Name=Kiosk
Exec=chromium-browser --kiosk --noerrdialogs --disable-infobars http://your-domain.com
```

## SSL Configuration

For HTTPS (required for some features):

### Let's Encrypt (Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Self-Signed (Development Only)

```bash
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
```

## Performance Optimization

### CDN

Use a CDN for static assets:

1. Upload `dist/` to CDN
2. Update asset paths
3. Configure caching headers

### Caching

Configure cache headers:

```
Cache-Control: public, max-age=31536000, immutable
```

## Monitoring

### Error Tracking

Integrate Sentry:

```bash
npm install @sentry/browser
```

### Analytics

Google Analytics 4:

```html
<!-- Add to index.html head -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Troubleshooting

### Blank Screen

1. Check browser console for errors
2. Verify all assets loaded
3. Check router configuration

### Touch Not Working

1. Verify touch-action: manipulation in CSS
2. Check for pointer-events issues
3. Test on actual device

### Offline Not Working

1. Verify service worker registration
2. Check cache configuration
3. Test in Incognito mode
