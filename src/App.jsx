import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import config, { getCSSVariables } from './config';

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
  return (
    <BrowserRouter>
      <CSSVariables />
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * Game Page - Main game flow
 */
function GamePage() {
  // Game states
  const [gameState, setGameState] = useState('attract'); // attract, playing, won, leadCapture
  const [gameKey, setGameKey] = useState(0);
  
  // Statistics
  const { recordWin, recordLead, recordIdle, getTopScores } = useStatistics();
  
  // Sound hook
  const { isMuted, toggleMute, loadSound, playSound } = useSound();
  
  // Fullscreen hook
  const { isFullscreen, isSupported, toggle: toggleFullscreen } = useFullscreen();
  
  // Timer
  const { time, formattedTime, isRunning, start, stop, reset } = useGameTimer({
    maxTime: config.settings.targetTime,
  });
  
  // Game reset hook
  const { gameKey: puzzleKey } = useGameReset();
  
  // Move count
  const [moves, setMoves] = useState(0);
  
  // Load sounds
  useEffect(() => {
    if (config.sounds.move) loadSound('move', config.sounds.move);
    if (config.sounds.win) loadSound('win', config.sounds.win);
  }, [loadSound]);
  
  // Start game
  const handleStart = useCallback(() => {
    if (gameState === 'attract') {
      setMoves(0);
      reset();
      setGameKey(prev => prev + 1);
      setGameState('playing');
    }
  }, [gameState, reset]);
  
  // Handle tile move
  const handleMove = useCallback((newMoves) => {
    setMoves(newMoves);
    if (!isRunning) {
      start();
    }
  }, [isRunning, start]);
  
  // Handle move count change
  const handleMoveCount = useCallback((newMoves) => {
    setMoves(newMoves);
  }, []);
  
  // Handle win
  const handleWin = useCallback((finalMoves) => {
    stop();
    setMoves(finalMoves);
    recordWin({
      moves: finalMoves,
      time,
      gridSize: config.settings.gridSize,
    });
    setGameState('won');
  }, [stop, time, recordWin]);
  
  // Play again
  const handleContinue = useCallback(() => {
    setMoves(0);
    reset();
    setGameKey(prev => prev + 1);
    setGameState('playing');
  }, [reset]);
  
  // Claim prize (show lead capture)
  const handleClaimPrize = useCallback(() => {
    setGameState('leadCapture');
  }, []);
  
  // Handle lead submission
  const handleLeadSubmit = useCallback((leadData) => {
    addLead(leadData);
    recordLead();
    
    // Return to attract after delay
    setTimeout(() => {
      setGameState('attract');
    }, 2000);
  }, [recordLead]);
  
  // Handle lead skip
  const handleLeadSkip = useCallback(() => {
    setGameState('attract');
  }, []);
  
  // Handle idle timeout
  const handleIdle = useCallback(() => {
    if (gameState !== 'attract') {
      stop();
      reset();
      recordIdle();
      setGameState('attract');
    }
  }, [gameState, stop, reset, recordIdle]);
  
  // Play sound helper
  const playSoundEffect = useCallback((soundName) => {
    if (!isMuted) {
      playSound(soundName);
    }
  }, [isMuted, playSound]);

  return (
    <div 
      className="min-h-screen overflow-hidden select-none"
      style={{
        fontFamily: config.fonts.body,
        background: `linear-gradient(135deg, ${config.theme.background} 0%, ${config.theme.backgroundLight} 100%)`,
      }}
    >
      {/* Sound controller */}
      <SoundController isMuted={isMuted} onToggle={toggleMute} />
      
      {/* Fullscreen button */}
      {isSupported && (
        <FullscreenButton 
          isFullscreen={isFullscreen} 
          onToggle={toggleFullscreen} 
        />
      )}

      {/* Idle timer */}
      <IdleTimer
        isActive={gameState !== 'attract'}
        onIdle={handleIdle}
        timeout={config.settings.idleTimeout * 1000}
      >
        <div />
      </IdleTimer>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {gameState === 'attract' && (
          <AttractMode key="attract" onStart={handleStart} />
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
              onWin={handleWin}
              onMoveCount={handleMoveCount}
              gameKey={gameKey}
              disabled={gameState === 'won'}
              sound={playSoundEffect}
            />

            <GameFooter instruction={config.game.instruction} />
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
function LeaderboardPage() {
  const navigate = useNavigate();
  const { getTopScores } = useStatistics();
  const scores = getTopScores('time', 20);

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        background: `linear-gradient(135deg, ${config.theme.background} 0%, ${config.theme.backgroundLight} 100%)`,
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
 * CSS Variables Component
 */
function CSSVariables() {
  const variables = getCSSVariables(config);
  const style = { style: variables };
  
  return <div {...style} />;
}

export default App;
