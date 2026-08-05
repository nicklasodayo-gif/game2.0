import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { getConfig, getCSSVariables } from './config';

// Components
import {
  AttractMode,
  PuzzleBoard,
  WinScreen,
  LeadCapture,
  GameHeader,
  GameFooter,
  SoundController,
  FullscreenButton,
  IdleTimer,
  useGameReset,
  Leaderboard,
} from './components';

// Hooks
import { useGameTimer } from './hooks/useGameTimer';
import { useSound } from './hooks/useSound';
import { useFullscreen } from './hooks/useFullscreen';
import { useStatistics } from './hooks/useStatistics';

// Services
import { addLead } from './services/localStorage';

// Styles
import './styles/index.css';

/**
 * Main App Component
 */
function App() {
  // Read active brand from URL
  const params = new URLSearchParams(window.location.search);
  const brand = params.get('brand') || 'redgiant';

  // Load active brand configuration
  const config = getConfig(brand);

  return (
    <BrowserRouter>
      <CSSVariables config={config} />

      <Routes>
        <Route
          path="/"
          element={<GamePage config={config} />}
        />

        <Route
          path="/leaderboard"
          element={<LeaderboardPage config={config} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * Game Page
 */
function GamePage({ config }) {
  const [gameState, setGameState] = useState('attract');
  const [gameKey, setGameKey] = useState(0);
  const [moves, setMoves] = useState(0);

  const { recordWin, recordLead, recordIdle } = useStatistics();

  const {
    isMuted,
    toggleMute,
    loadSound,
    playSound,
  } = useSound();

  const {
    isFullscreen,
    isSupported,
    toggle: toggleFullscreen,
  } = useFullscreen();

  const {
    time,
    isRunning,
    start,
    stop,
    reset,
  } = useGameTimer({
    maxTime: config.settings.targetTime,
  });

  useGameReset();

  useEffect(() => {
    if (config.sounds.move) loadSound('move', config.sounds.move);
    if (config.sounds.win) loadSound('win', config.sounds.win);
  }, [config, loadSound]);

  const handleStart = useCallback(() => {
    setMoves(0);
    reset();
    setGameKey((prev) => prev + 1);
    setGameState('playing');
  }, [reset]);

  const handleMove = useCallback(
    (newMoves) => {
      setMoves(newMoves);

      if (!isRunning) {
        start();
      }
    },
    [isRunning, start]
  );

  const handleMoveCount = useCallback((count) => {
    setMoves(count);
  }, []);

  const handleWin = useCallback(
    (finalMoves) => {
      stop();

      recordWin({
        moves: finalMoves,
        time,
        gridSize: config.settings.gridSize,
      });

      setMoves(finalMoves);
      setGameState('won');
    },
    [config, stop, time, recordWin]
  );

  const handleContinue = useCallback(() => {
    setMoves(0);
    reset();
    setGameKey((prev) => prev + 1);
    setGameState('playing');
  }, [reset]);

  const handleClaimPrize = useCallback(() => {
    setGameState('leadCapture');
  }, []);

  const handleLeadSubmit = useCallback(
    (lead) => {
      addLead(lead);
      recordLead();

      setTimeout(() => {
        setGameState('attract');
      }, 2000);
    },
    [recordLead]
  );

  const handleLeadSkip = useCallback(() => {
    setGameState('attract');
  }, []);

  const handleIdle = useCallback(() => {
    stop();
    reset();
    recordIdle();
    setGameState('attract');
  }, [stop, reset, recordIdle]);

  const playSoundEffect = useCallback(
    (name) => {
      if (!isMuted) {
        playSound(name);
      }
    },
    [isMuted, playSound]
  );

  return (
    <div
      className="min-h-screen overflow-hidden select-none"
      style={{
        fontFamily: config.fonts.body,
        background: `linear-gradient(
          135deg,
          ${config.theme.background},
          ${config.theme.backgroundLight}
        )`,
      }}
    >
      <SoundController
        isMuted={isMuted}
        onToggle={toggleMute}
      />

      {isSupported && (
        <FullscreenButton
          isFullscreen={isFullscreen}
          onToggle={toggleFullscreen}
        />
      )}

      <IdleTimer
        isActive={gameState !== 'attract'}
        onIdle={handleIdle}
        timeout={config.settings.idleTimeout * 1000}
      >
        <div />
      </IdleTimer>

      <AnimatePresence mode="wait">
        {gameState === 'attract' && (
          <AttractMode
            key="attract"
            onStart={handleStart}
          />
        )}

        {(gameState === 'playing' || gameState === 'won') && (
          <div
            key="game"
            className="min-h-screen flex flex-col items-center justify-center p-4"
          >
            <GameHeader
              title={config.game.title}
              moves={moves}
              time={time}
              targetTime={config.settings.targetTime}
            />

            <PuzzleBoard
              key={gameKey}
              gridSize={config.settings.gridSize}
              onMove={handleMove}
              onMoveCount={handleMoveCount}
              onWin={handleWin}
              gameKey={gameKey}
              disabled={gameState === 'won'}
              sound={playSoundEffect}
            />

            <GameFooter
              instruction={config.game.instruction}
            />
          </div>
        )}

        {gameState === 'won' && (
          <WinScreen
            key="win"
            moves={moves}
            time={time}
            targetTime={config.settings.targetTime}
            onContinue={handleContinue}
            onClaimPrize={handleClaimPrize}
          />
        )}

        {gameState === 'leadCapture' && (
          <LeadCapture
            key="leadCapture"
            onSubmit={handleLeadSubmit}
            onSkip={handleLeadSkip}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Leaderboard Page
 */
function LeaderboardPage({ config }) {
  const navigate = useNavigate();

  const { getTopScores } = useStatistics();

  const scores = getTopScores('time', 20);

  return (
    <div
      className="min-h-screen p-4"
      style={{
        background: `linear-gradient(
          135deg,
          ${config.theme.background},
          ${config.theme.backgroundLight}
        )`,
      }}
    >
      <Leaderboard
        scores={scores}
        title="🏆 Top Scores"
        onClose={() => navigate('/')}
      />
    </div>
  );
}

/**
 * CSS Variables
 */
function CSSVariables({ config }) {
  const variables = getCSSVariables(config);

  return <div style={variables} />;
}

export default App;