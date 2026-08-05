import { motion } from 'framer-motion';
import config from '../config';

/**
 * GameFooter - Bottom footer with instructions
 */
export function GameFooter({ instruction }) {
  return (
    <motion.div
      className="text-center mb-4 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <p 
        className="text-base md:text-lg"
        style={{ 
          color: config.theme.text,
          opacity: 0.7,
          fontFamily: config.fonts.body,
        }}
      >
        {instruction || config.game.instruction}
      </p>
    </motion.div>
  );
}

export default GameFooter;
