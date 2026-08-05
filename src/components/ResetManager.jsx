import { useState, useCallback } from 'react';

/**
 * ResetManager - Manages game reset state
 */
export function ResetManager({ children, initialKey = 0 }) {
  const [gameKey, setGameKey] = useState(initialKey);

  const resetGame = useCallback(() => {
    setGameKey(prev => prev + 1);
  }, []);

  return children({
    gameKey,
    resetGame,
  });
}

/**
 * useGameReset - Hook for game reset management
 */
export function useGameReset() {
  const [gameKey, setGameKey] = useState(0);

  const resetGame = useCallback(() => {
    setGameKey(prev => prev + 1);
  }, []);

  return { gameKey, resetGame };
}

export default ResetManager;
