# Red Giant Interactive Activation Platform

A production-ready, touchscreen-first interactive game platform for marketing activations. Built with React 19, Vite, and TailwindCSS.

## 🎯 Features

- **Sliding Tile Puzzle** - 3×3 and 4×4 grid options
- **Config-Based Branding** - Switch brands by changing one import
- **Touchscreen First** - Optimized for kiosk, tablet, and TV displays
- **Offline Support** - Works without internet using localStorage
- **Lead Capture** - Ethical data collection with consent
- **Auto Reset** - Returns to attract mode automatically
- **Statistics Dashboard** - Track players, wins, and leads
- **Sound Effects** - Immersive audio feedback
- **Kiosk Mode** - Fullscreen, no browser UI
- **Future-Ready** - Architecture supports additional games

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Switching Brands

Update the import in `src/App.jsx`:

```jsx
// Coca-Cola
import config from './config/cocaCola';

// Red Giant
import config from './config/redGiant';

// Demo
import config from './config/demoBrand';
```

## 📁 Project Structure

```
activation-platform/
├── src/
│   ├── components/          # React components
│   │   ├── AttractMode.jsx  # Idle/attract screen
│   │   ├── PuzzleBoard.jsx  # Main puzzle game
│   │   ├── Tile.jsx         # Individual tile
│   │   ├── WinScreen.jsx    # Victory screen
│   │   ├── LeadCapture.jsx  # Lead collection
│   │   ├── Leaderboard.jsx  # Score leaderboard
│   │   ├── GameHeader.jsx   # Game header
│   │   ├── GameFooter.jsx   # Instructions
│   │   ├── GameTimer.jsx    # Timer display
│   │   ├── MoveCounter.jsx  # Move counter
│   │   ├── SoundController.jsx # Mute button
│   │   ├── FullscreenButton.jsx # Fullscreen toggle
│   │   ├── ConfettiEffect.jsx # Celebration effects
│   │   ├── LoadingScreen.jsx # Loading state
│   │   ├── IdleTimer.jsx    # Auto-reset
│   │   ├── ResetManager.jsx # Game reset
│   │   └── index.js         # Export all
│   ├── config/              # Brand configurations
│   │   ├── cocacola.js      # Coca-Cola theme
│   │   ├── redGiant.js      # Red Giant theme
│   │   ├── demoBrand.js     # Template
│   │   └── index.js         # Config utilities
│   ├── hooks/                # Custom React hooks
│   │   ├── useGameTimer.js  # Timer logic
│   │   ├── useIdleDetection.js # Idle detection
│   │   ├── useSound.js      # Sound management
│   │   ├── useFullscreen.js # Fullscreen API
│   │   ├── useStatistics.js # Stats management
│   │   └── index.js
│   ├── services/             # Data services
│   │   ├── localStorage.js   # Offline storage
│   │   ├── supabase.js      # Cloud sync (optional)
│   │   └── syncService.js   # Data synchronization
│   ├── utils/               # Utilities
│   │   ├── shuffle.js       # Puzzle algorithms
│   │   ├── validation.js    # Form validation
│   │   └── statistics.js    # Stats calculations
│   ├── styles/
│   │   └── index.css        # Global styles
│   ├── App.jsx              # Main app
│   └── main.jsx             # Entry point
├── public/
│   ├── logos/               # Brand logos
│   ├── sounds/              # Sound effects
│   └── tile-images/         # Puzzle images
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Brand Configuration

Create a new config file in `src/config/`:

```javascript
// src/config/yourBrand.js
export default {
  client: "Your Brand",
  
  theme: {
    primary: "#3B82F6",
    primaryDark: "#2563EB",
    secondary: "#FFFFFF",
    accent: "#10B981",
    background: "#0F172A",
    backgroundLight: "#1E293B",
    surface: "#334155",
    text: "#F8FAFC",
    textDark: "#0F172A",
    success: "#22C55E",
    gold: "#FBBF24",
  },
  
  fonts: {
    display: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },
  
  game: {
    title: "Your Challenge",
    subtitle: "Tagline here",
    instruction: "Tap tiles to slide",
    prize: "Win Prizes!",
  },
  
  settings: {
    gridSize: 3,
    targetTime: 60,
    idleTimeout: 25,
    shuffleMoves: 50,
  },
  
  // ... see demoBrand.js for all options
};
```

## 📊 API Reference

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `client` | string | - | Brand name |
| `theme.primary` | hex | #3B82F6 | Primary color |
| `settings.gridSize` | number | 3 | Puzzle size |
| `settings.targetTime` | number | 60 | Target completion |
| `settings.idleTimeout` | number | 25 | Idle timeout (sec) |
| `sounds.enabled` | boolean | true | Enable sounds |

### localStorage Keys

| Key | Description |
|-----|-------------|
| `activation_games` | Player scores |
| `activation_leads` | Captured leads |
| `activation_stats` | Statistics |
| `activation_settings` | User settings |

### Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | GamePage | Main game |
| `/leaderboard` | LeaderboardPage | Top scores |

## 🔧 Development

### Adding New Games

The platform is designed to support multiple games. To add a new game:

1. Create game component in `src/components/games/`
2. Add route in `App.jsx`
3. Update navigation

### Supabase Integration

Set environment variables:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Required tables will be created automatically.

### Sound Effects

Add audio files to `public/sounds/`:
- `tile-move.mp3` - Tile movement
- `win.mp3` - Victory sound
- `attract.mp3` - Attract mode loop

## 📱 Deployment

### Static Hosting

```bash
npm run build
# Serve dist/ folder
```

### Vercel

```bash
npm i -g vercel
vercel --prod
```

### Netlify

Connect GitHub repo in Netlify dashboard.

### Docker

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
```

## 🧪 Testing

```bash
# Run tests
npm test

# Build test
npm run build
```

## 📋 Requirements

- Node.js 18+
- npm 9+

## 🔒 Security

- All form inputs are validated client and server-side
- Consent required for lead capture
- Data stored locally by default
- Supabase integration for optional cloud storage

## 📄 License

Proprietary - Red Giant Ltd

## 🆘 Support

- Email: tech@redgiant.co.ke
- Documentation: https://docs.redgiant.co.ke
