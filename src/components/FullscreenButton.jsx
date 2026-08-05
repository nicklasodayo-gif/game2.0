import { motion } from 'framer-motion';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import config from '../config';

/**
 * FullscreenButton - Toggle fullscreen mode
 */
export function FullscreenButton({ isFullscreen, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed top-4 left-4 z-50 p-3 rounded-full"
      style={{
        backgroundColor: config.theme.backgroundLight,
        opacity: 0.9,
      }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <FiMinimize2 size={24} style={{ color: config.theme.text }} />
      ) : (
        <FiMaximize2 size={24} style={{ color: config.theme.text }} />
      )}
    </motion.button>
  );
}

export default FullscreenButton;
