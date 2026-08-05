/**
 * Shuffle utility functions for puzzle game
 */

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Check if a puzzle configuration is solvable
 * @param {number[]} tiles - Array of tile positions
 * @param {number} gridSize - Size of the grid (3 or 4)
 * @returns {boolean} True if solvable
 */
export function isSolvable(tiles, gridSize) {
  let inversions = 0;
  const tilesWithoutEmpty = tiles.filter(t => t !== gridSize * gridSize);
  
  for (let i = 0; i < tilesWithoutEmpty.length; i++) {
    for (let j = i + 1; j < tilesWithoutEmpty.length; j++) {
      if (tilesWithoutEmpty[i] > tilesWithoutEmpty[j]) {
        inversions++;
      }
    }
  }
  
  // For odd grid sizes: solvable if inversions is even
  // For even grid sizes: depends on empty tile row
  if (gridSize % 2 === 1) {
    return inversions % 2 === 0;
  } else {
    const emptyIndex = tiles.indexOf(gridSize * gridSize);
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const fromBottom = gridSize - emptyRow;
    return (inversions + fromBottom) % 2 === 1;
  }
}

/**
 * Generate a solvable shuffled puzzle
 * @param {number} gridSize - Size of the grid (3 or 4)
 * @param {number} shuffleMoves - Number of random moves to make (higher = more shuffled)
 * @returns {number[]} Array of tile positions
 */
export function generateSolvablePuzzle(gridSize, shuffleMoves = 50) {
  const totalTiles = gridSize * gridSize;
  let tiles = Array.from({ length: totalTiles }, (_, i) => i + 1);
  
  // Start from solved state and make random valid moves
  for (let i = 0; i < shuffleMoves; i++) {
    const emptyIndex = tiles.indexOf(totalTiles);
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;
    
    const validMoves = [];
    
    // Check adjacent positions
    if (emptyRow > 0) validMoves.push(emptyIndex - gridSize); // up
    if (emptyRow < gridSize - 1) validMoves.push(emptyIndex + gridSize); // down
    if (emptyCol > 0) validMoves.push(emptyIndex - 1); // left
    if (emptyCol < gridSize - 1) validMoves.push(emptyIndex + 1); // right
    
    const moveIndex = validMoves[Math.floor(Math.random() * validMoves.length)];
    [tiles[emptyIndex], tiles[moveIndex]] = [tiles[moveIndex], tiles[emptyIndex]];
  }
  
  return tiles;
}

/**
 * Check if puzzle is solved
 * @param {number[]} tiles - Array of tile positions
 * @returns {boolean} True if solved
 */
export function isSolved(tiles) {
  return tiles.every((tile, index) => tile === index + 1);
}

/**
 * Get valid moves for empty tile
 * @param {number} emptyIndex - Index of empty tile
 * @param {number} gridSize - Size of the grid
 * @returns {number[]} Array of valid move indices
 */
export function getValidMoves(emptyIndex, gridSize) {
  const moves = [];
  const row = Math.floor(emptyIndex / gridSize);
  const col = emptyIndex % gridSize;
  
  if (row > 0) moves.push(emptyIndex - gridSize); // up
  if (row < gridSize - 1) moves.push(emptyIndex + gridSize); // down
  if (col > 0) moves.push(emptyIndex - 1); // left
  if (col < gridSize - 1) moves.push(emptyIndex + 1); // right
  
  return moves;
}
