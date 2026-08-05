import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Tile from './Tile';
import { generateSolvablePuzzle, isSolved, getValidMoves } from '../utils/shuffle';
import config from '../config';

/**
 * PuzzleBoard - Main puzzle game component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onMove - Callback when tile is moved
 * @param {Function} props.onWin - Callback when puzzle is solved
 * @param {Function} props.onMoveCount - Callback with move count
 * @param {number} props.gridSize - Size of the grid (3 or 4)
 * @param {string} props.gameKey - Key to trigger new game
 * @param {boolean} props.disabled - Whether board is disabled
 * @param {Function} props.sound - Sound play function
 */
export function PuzzleBoard({ 
  onMove, 
  onWin, 
  onMoveCount,
  gridSize = 3,
  gameKey,
  disabled = false,
  sound,
}) {
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const hasWonRef = useRef(false);

  // Initialize the board
  const initializeBoard = useCallback(() => {
    const newTiles = generateSolvablePuzzle(gridSize, config.settings.shuffleMoves);
    setTiles(newTiles);
    setMoves(0);
    setIsShuffled(false);
    hasWonRef.current = false;
  }, [gridSize]);

  // Shuffle after initial render
  useEffect(() => {
    initializeBoard();
  }, [gameKey, initializeBoard]);

  // Auto-shuffle after initialization
  useEffect(() => {
    if (tiles.length > 0 && !isShuffled) {
      const timer = setTimeout(() => {
        setIsShuffled(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [tiles, isShuffled]);

  // Check for win condition
  useEffect(() => {
    if (isShuffled && tiles.length > 0 && !hasWonRef.current) {
      if (isSolved(tiles)) {
        hasWonRef.current = true;
        if (sound) sound('win');
        if (onWin) onWin(moves);
      }
    }
  }, [tiles, isShuffled, moves, onWin, sound]);

  // Get empty position
  const getEmptyIndex = useCallback(() => {
    return tiles.indexOf(gridSize * gridSize);
  }, [tiles, gridSize]);

  // Check if tile can move
  const canMoveTile = useCallback((index) => {
    const emptyIndex = getEmptyIndex();
    if (emptyIndex === -1) return false;
    const validMoves = getValidMoves(emptyIndex, gridSize);
    return validMoves.includes(index);
  }, [getEmptyIndex, gridSize]);

  // Move a tile
  const moveTile = useCallback((index) => {
    if (disabled || !canMoveTile(index)) return false;
    
    const emptyIndex = getEmptyIndex();
    const newTiles = [...tiles];
    
    // Swap tiles
    [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
    setTiles(newTiles);
    
    // Update moves
    const newMoves = moves + 1;
    setMoves(newMoves);
    
    // Play sound
    if (sound) sound('move');
    
    // Callbacks
    if (onMove) onMove(newMoves);
    if (onMoveCount) onMoveCount(newMoves);
    
    return true;
  }, [tiles, moves, disabled, canMoveTile, getEmptyIndex, sound, onMove, onMoveCount]);

  // Handle tile click
  const handleTileClick = (index) => {
    moveTile(index);
  };

  // Calculate board dimensions
  const boardStyle = {
    width: 'min(400px, 85vw)',
    height: 'min(400px, 85vw)',
    padding: '8px',
  };

  return (
    <motion.div
      className="relative rounded-3xl p-2 shadow-2xl"
      style={{
        ...boardStyle,
        backgroundColor: config.theme.backgroundLight,
        boxShadow: `0 0 60px ${config.theme.primary}30`,
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Grid container */}
      <div 
        className="relative w-full h-full bg-gray-800/30 rounded-2xl"
        style={{ padding: '4px' }}
      >
        {tiles.map((tile, index) => (
          <Tile
            key={`${gameKey}-${tile}-${index}`}
            value={tile}
            position={index}
            gridSize={gridSize}
            onClick={() => handleTileClick(index)}
            isEmpty={tile === gridSize * gridSize}
            canMove={canMoveTile(index) && !disabled}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default PuzzleBoard;
