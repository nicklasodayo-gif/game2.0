import { motion } from 'framer-motion';
import config from '../config';

/**
 * Tile - Individual puzzle tile component
 * 
 * @param {number} value - Tile number (1-8 for 3x3, 1-15 for 4x4)
 * @param {number} position - Current position in the grid
 * @param {number} gridSize - Size of the grid
 * @param {Function} onClick - Click handler
 * @param {boolean} isEmpty - Whether this is the empty tile
 * @param {boolean} canMove - Whether this tile can move
 */
export function Tile({ value, position, gridSize, onClick, isEmpty, canMove }) {
  if (isEmpty) {
    return (
      <div 
        className="absolute rounded-2xl"
        style={{
          width: `calc(${(100 - 2) / gridSize}% - ${(gridSize - 1) * 4}px)`,
          height: `calc(${(100 - 2) / gridSize}% - ${(gridSize - 1) * 4}px)`,
          left: `${(position % gridSize) * (100 / gridSize)}%`,
          top: `${Math.floor(position / gridSize) * (100 / gridSize)}%`,
          margin: '1%',
        }}
      />
    );
  }

  const tileSize = `calc(${(100 - 2) / gridSize}% - ${(gridSize - 1) * 4}px)`;
  const gap = '1%';

  return (
    <motion.button
      onClick={onClick}
      disabled={!canMove}
      className={`
        absolute rounded-2xl flex items-center justify-center
        font-bold text-white shadow-lg cursor-pointer select-none
        touch-manipulation transition-shadow
        ${canMove ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
      `}
      style={{
        width: tileSize,
        height: tileSize,
        left: `calc(${(position % gridSize) * (100 / gridSize)}% + ${gap})`,
        top: `calc(${Math.floor(position / gridSize) * (100 / gridSize)}% + ${gap})`,
        background: `linear-gradient(135deg, ${config.theme.primary} 0%, ${config.theme.primaryDark} 100%)`,
        fontSize: `${Math.max(1.5, 3 - gridSize * 0.3)}rem`,
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: canMove 
          ? `0 8px 20px ${config.theme.primary}40, 0 4px 10px ${config.theme.primary}20`
          : `0 4px 10px rgba(0,0,0,0.3)`,
      }}
      whileTap={canMove ? { 
        scale: config.touch.scale,
        opacity: config.touch.opacity 
      } : {}}
      transition={{ duration: config.touch.duration / 1000 }}
      animate={canMove ? {
        boxShadow: [
          `0 8px 20px ${config.theme.primary}40`,
          `0 4px 10px ${config.theme.primary}20`,
        ],
      } : {}}
    >
      {/* Tile number */}
      <span className="font-display font-black drop-shadow-lg relative z-10">
        {value}
      </span>
      
      {/* Shine effect */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)',
        }}
      />
      
      {/* Border glow */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: `3px solid ${config.theme.accent}`,
          opacity: canMove ? 0.6 : 0.3,
        }}
      />
    </motion.button>
  );
}

export default Tile;
