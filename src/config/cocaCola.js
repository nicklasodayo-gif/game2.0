/**
 * Coca-Cola Brand Configuration
 * 
 * Complete branding for Coca-Cola activation game.
 * Switch to this config by: import config from './cocaCola'
 */

const cocacolaConfig = {
  // Client identification
  client: "Coca-Cola",
  clientSlug: "cocacola",

  // Theme colors (CSS variables will be generated)
  theme: {
    primary: "#E41E26",
    primaryDark: "#B8001C",
    secondary: "#FFFFFF",
    accent: "#F40009",
    background: "#1A1A1A",
    backgroundLight: "#2D2D2D",
    surface: "#3A3A3A",
    text: "#FFFFFF",
    textDark: "#1A1A1A",
    success: "#00C853",
    gold: "#FFD700",
    error: "#FF5252",
  },

  // Typography
  fonts: {
    display: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },

  // Logo paths
  logo: "/logos/coca-cola-logo.svg",
  logoWhite: "/logos/coca-cola-logo-white.svg",
  logoAlt: "/logos/coca-cola-logo-alt.svg",

  // Game UI text
  game: {
    title: "Coca-Cola Puzzle Challenge",
    subtitle: "Arrangement is Everything",
    instruction: "Tap tiles to slide them into the correct order",
    instructionAlt: "Complete the puzzle before time runs out!",
    prize: "Win Coca-Cola Merchandise!",
    prizeDetails: "Complete the puzzle to enter our prize draw",
    howToPlay: "Swipe tiles to arrange them in order",
  },

  // Button text
  buttons: {
    play: "PLAY NOW",
    retry: "TRY AGAIN",
    claim: "CLAIM YOUR PRIZE",
    continue: "CONTINUE",
    skip: "Skip for now",
    submit: "SUBMIT",
  },

  // Attract mode
  attract: {
    title: "TAP TO PLAY",
    subtitle: "Can you solve the puzzle?",
    instruction: "Touch anywhere to start",
    tagline: "Open Happiness",
  },

  // Win screen
  win: {
    title: "CONGRATULATIONS!",
    subtitle: "You solved the puzzle!",
    message: "You're entered into our prize draw",
    perfectTime: "Amazing! Under target time!",
    messageAlt: "Great job!",
  },

  // Lead capture
  lead: {
    title: "Enter Your Details",
    subtitle: "to claim your prize",
    consentText: "Your details will be used for prize communication only. By submitting, you agree to our terms and conditions.",
    namePlaceholder: "Your Full Name",
    phonePlaceholder: "Phone Number",
    emailPlaceholder: "Email Address (optional)",
    companyPlaceholder: "Company (optional)",
    consentLabel: "I agree to the terms and conditions",
    successTitle: "Entry Submitted!",
    successMessage: "Good luck! We'll contact you if you win.",
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
    gridSize: 3,           // 3 for 3x3, 4 for 4x4
    targetTime: 60,        // Target completion time in seconds
    maxTime: 180,          // Maximum time allowed
    idleTimeout: 25,        // Seconds before attract mode
    shuffleMoves: 50,       // Number of shuffle moves
  },

  // Difficulty settings
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
    win: "/sounds/coke-win.mp3",
    click: "/sounds/click.mp3",
    attract: "/sounds/coke-attract.mp3",
    countdown: "/sounds/countdown.mp3",
  },

  // Visual settings
  visuals: {
    backgroundPattern: "gradient",
    particles: {
      enabled: true,
      colors: ["#E41E26", "#FFFFFF", "#F40009", "#FFD700"],
    },
    confettiColors: ["#E41E26", "#FFFFFF", "#F40009", "#FFD700", "#00C853"],
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
    shareText: "I just completed the Coca-Cola Puzzle Challenge! 🎉",
    shareUrl: "https://coke.com/puzzle",
    hashtag: "#CokePuzzle",
  },
};

export default cocacolaConfig;
