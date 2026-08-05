import { motion } from 'framer-motion';
import config from '../config';

/**
 * MoveCounter - Display move count
 */
export function MoveCounter({ moves }) {
  return (
    <motion.div
      className="px-6 py-3 rounded-xl"
      style={{
        backgroundColor: `${config.theme.primary}15`,
        border: `2px solid ${config.theme.primary}`,
      }}
      key={moves}
      animate={moves > 0 ? { scale: [1, 1.1, 1] } : {}}
    >
      <span 
        className="text-xs font-medium block mb-1"
        style={{ color: config.theme.text, opacity: 0.7 }}
      >
        {config.labels.moves}
      </span>
      <span 
        className="text-3xl font-bold"
        style={{ 
          color: config.theme.primary,
          fontFamily: config.fonts.display,
        }}
      >
        {moves}
      </span>
    </motion.div>
  );
}

export default MoveCounter;
