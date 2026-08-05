# Branding Guide

## Overview

The activation platform uses a config-based branding system. Each client gets their own configuration file that completely changes the look and feel without touching any code.

## Creating a New Brand

### 1. Create Config File

Create `src/config/yourBrand.js`:

```javascript
const yourBrandConfig = {
  client: "Your Brand Name",
  clientSlug: "yourbrand",

  // Theme colors
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
    error: "#EF4444",
  },

  // Typography
  fonts: {
    display: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },

  // Logo paths
  logo: "/logos/your-brand-logo.svg",
  logoWhite: "/logos/your-brand-logo-white.svg",

  // Game text
  game: {
    title: "Your Challenge Title",
    subtitle: "Your tagline",
    instruction: "How to play",
    prize: "Win Exciting Prizes!",
  },

  // Attract mode
  attract: {
    title: "TAP TO PLAY",
    subtitle: "Can you solve it?",
    instruction: "Touch to start",
    tagline: "Your brand tagline",
  },

  // Win screen
  win: {
    title: "CONGRATULATIONS!",
    subtitle: "Puzzle Complete!",
    message: "You're entered to win",
    perfectTime: "Amazing speed!",
  },

  // Lead capture
  lead: {
    title: "Enter Your Details",
    subtitle: "Claim your prize",
    consentText: "Your information will be used for...",
    namePlaceholder: "Full Name",
    phonePlaceholder: "Phone Number",
    consentLabel: "I agree to the terms",
    successTitle: "Entry Submitted!",
    successMessage: "Good luck!",
  },

  // Timer labels
  labels: {
    moves: "MOVES",
    time: "TIME",
    best: "BEST",
    target: "TARGET",
    score: "SCORE",
  },

  // Game settings
  settings: {
    gridSize: 3,
    targetTime: 60,
    maxTime: 180,
    idleTimeout: 25,
    shuffleMoves: 50,
  },

  // Difficulty options
  difficulty: {
    easy: { gridSize: 3, targetTime: 90 },
    normal: { gridSize: 3, targetTime: 60 },
    hard: { gridSize: 4, targetTime: 120 },
  },

  // Sound settings
  sounds: {
    enabled: true,
    volume: 0.7,
    move: "/sounds/tile-move.mp3",
    win: "/sounds/win.mp3",
    attract: "/sounds/attract.mp3",
  },

  // Visual effects
  visuals: {
    backgroundPattern: "gradient",
    particles: {
      enabled: true,
      colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
    },
    confettiColors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#FFFFFF"],
    animations: {
      tileMove: 150,
      screenTransition: 300,
      attractFloat: 3000,
    },
  },

  // Touch feedback
  touch: {
    scale: 0.95,
    opacity: 0.8,
    duration: 100,
  },

  // Social sharing
  social: {
    shareText: "I just completed the puzzle challenge!",
    shareUrl: "https://yourbrand.com/challenge",
    hashtag: "#YourBrandChallenge",
  },
};

export default yourBrandConfig;
```

### 2. Add to Config Index

Update `src/config/index.js`:

```javascript
import yourBrandConfig from './yourBrand';

export const configs = {
  cocacola: cocacolaConfig,
  redgiant: redGiantConfig,
  demo: demoConfig,
  yourbrand: yourBrandConfig,  // Add here
};
```

### 3. Update Default Export

Change the default export in `src/config/index.js`:

```javascript
import yourBrandConfig from './yourBrand';
export default yourBrandConfig;
```

### 4. Add Logo Assets

Add logo files to `public/logos/`:
- `your-brand-logo.svg`
- `your-brand-logo-white.svg`

### 5. Add Sound Effects (Optional)

Add sound files to `public/sounds/`:
- `tile-move.mp3`
- `win.mp3`
- `attract.mp3`

## Color Guidelines

### Primary Color

The main brand color used for:
- Action buttons
- Active states
- Key UI elements

### Secondary Color

Usually white or light color for:
- Text on dark backgrounds
- Secondary buttons
- Card backgrounds

### Accent Color

Highlights and special elements:
- Badges
- Notifications
- Hover states

### Background

Dark backgrounds work best for:
- Attract mode
- Game area
- Modals

### Success

Used for:
- Win states
- Completion
- Positive feedback

### Gold

Premium/highlight color:
- Prize badges
- Leaderboard
- Achievements

## Typography

### Display Font

For headings and large text:
- Game titles
- Win messages
- Prize announcements

### Body Font

For readable content:
- Instructions
- Form labels
- Stats

## Logo Guidelines

### Format

SVG format preferred for:
- Scalability
- Small file size
- Easy editing

### Sizes

- Main logo: 200x80px minimum
- Favicon: 32x32px
- Social share: 1200x630px

### Variations

Prepare light and dark versions for different backgrounds.

## Sound Guidelines

### File Format

MP3 format for best compatibility:
- Bitrate: 64-128kbps
- Sample rate: 44.1kHz

### Duration

- Tile move: < 0.5s
- Win: 2-5s
- Attract: Loopable ambient

### Volume

Set appropriate volume in config:
```javascript
sounds: {
  volume: 0.7, // 70% volume
}
```

## Testing Your Brand

1. Start development server:
   ```bash
   npm run dev
   ```

2. Verify all screens:
   - Attract mode
   - Game play
   - Win screen
   - Lead capture
   - Thank you message

3. Test responsive:
   - Desktop
   - Tablet
   - Mobile

4. Test offline:
   - Disconnect network
   - Verify game still works

5. Test fullscreen:
   - Enter fullscreen
   - Verify no UI issues

## Checklist

Before deployment:

- [ ] Config file created
- [ ] Config exported in index.js
- [ ] Default config updated
- [ ] Logo files added
- [ ] Colors tested
- [ ] Text verified
- [ ] Sound files added (optional)
- [ ] Touch targets sized correctly
- [ ] Contrast ratios meet WCAG
- [ ] Offline mode tested
