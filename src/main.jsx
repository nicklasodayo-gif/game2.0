import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Prevent unwanted browser behaviors
document.addEventListener('DOMContentLoaded', () => {
  // Prevent pinch zoom
  document.addEventListener('touchmove', (e) => {
    if (e.scale !== 1) {
      e.preventDefault();
    }
  }, { passive: false });

  // Prevent context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Prevent double-tap zoom
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Request fullscreen on first interaction (kiosk mode)
  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  };
  
  // Uncomment for auto fullscreen:
  // document.addEventListener('click', requestFullscreen, { once: true });
  // document.addEventListener('touchstart', requestFullscreen, { once: true });
});

// Service worker registration (for PWA support)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed
    });
  });
}

// Render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
