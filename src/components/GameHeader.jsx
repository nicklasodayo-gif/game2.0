import { motion } from 'framer-motion';
import config from '../config';
import { formatTime } from '../utils/statistics';

/**
 * GameHeader - Top header component showing game info and stats
 */
export function GameHeader({ title, subtitle, moves, time, targetTime }) {
  return (
    <div className="text-center mb-6">
      {/* Title */}
      <h1 
        className="text-3xl md:text-5xl font-black font-display mb-2"
        style={{ 
          color: config.theme.text,
          fontFamily: config.fonts.display,
        }}
      >
        {title || config.game.title}
      </h1>
      
      {/* Subtitle */}
      <p 
        className="text-lg mb-6"
        style={{ 
          color: config.theme.primary,
          fontFamily: config.fonts.body,
        }}
      >
        {subtitle || config.game.subtitle}
      </p>

      {/* Stats bar */}
      <div className="flex justify-center gap-6">
        <StatBadge 
          label={config.labels.moves} 
          value={moves} 
          color={config.theme.primary}
        />
        <StatBadge 
          label={config.labels.time} 
          value={formatTime(time)} 
          color={config.theme.primary}
        />
        <StatBadge 
          label={config.labels.target} 
          value={formatTime(targetTime)} 
          color={config.theme.gold}
        />
      </div>
    </div>
  );
}

/**
 * StatBadge - Individual stat display
 */
function StatBadge({ label, value, color }) {
  return (
    <motion.div
      className="px-6 py-3 rounded-xl"
      style={{
        backgroundColor: `${color}15`,
        border: `2px solid ${color}`,
      }}
      whileHover={{ scale: 1.05 }}
    >
      <span 
        className="text-xs font-medium block mb-1"
        style={{ color: config.theme.text, opacity: 0.7 }}
      >
        {label}
      </span>
      <span 
        className="text-2xl font-bold"
        style={{ 
          color: color,
          fontFamily: config.fonts.display,
        }}
      >
        {value}
      </span>
    </motion.div>
  );
}

export default GameHeader;
