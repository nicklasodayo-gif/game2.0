import { motion } from 'framer-motion';
import config from '../config';
import { formatTime } from '../utils/statistics';

/**
 * Leaderboard - Display top scores
 */
export function Leaderboard({ scores = [], title = "Leaderboard", onClose }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: `${config.theme.background}ee` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div 
        className="w-full max-w-md rounded-3xl p-6"
        style={{ backgroundColor: config.theme.backgroundLight }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 
            className="text-2xl font-bold"
            style={{ color: config.theme.text, fontFamily: config.fonts.display }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full"
            style={{ backgroundColor: config.theme.surface }}
          >
            ✕
          </button>
        </div>

        {/* Scores list */}
        {scores.length === 0 ? (
          <p 
            className="text-center py-8"
            style={{ color: config.theme.text, opacity: 0.6 }}
          >
            No scores yet. Be the first!
          </p>
        ) : (
          <div className="space-y-3">
            {scores.map((score, index) => (
              <motion.div
                key={score.id || index}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  backgroundColor: index < 3 ? `${config.theme.gold}15` : config.theme.surface,
                  border: index < 3 ? `2px solid ${config.theme.gold}` : 'none',
                }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Rank */}
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                  style={{
                    backgroundColor: index === 0 ? config.theme.gold : 
                                    index === 1 ? '#C0C0C0' : 
                                    index === 2 ? '#CD7F32' : config.theme.primary,
                    color: index < 3 ? config.theme.textDark : config.theme.text,
                  }}
                >
                  {index + 1}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <p 
                    className="font-semibold"
                    style={{ color: config.theme.text }}
                  >
                    {score.name || 'Anonymous'}
                  </p>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <p 
                    className="font-bold"
                    style={{ color: config.theme.primary }}
                  >
                    {formatTime(score.time)}
                  </p>
                  <p 
                    className="text-sm"
                    style={{ color: config.theme.text, opacity: 0.7 }}
                  >
                    {score.moves} moves
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Leaderboard;
