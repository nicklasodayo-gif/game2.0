import { motion } from 'framer-motion';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import config from '../config';

/**
 * SoundController - Mute/unmute toggle button
 */
export function SoundController({ isMuted, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 p-3 rounded-full"
      style={{
        backgroundColor: config.theme.backgroundLight,
        opacity: 0.9,
      }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      {isMuted ? (
        <FiVolumeX size={24} style={{ color: config.theme.text }} />
      ) : (
        <FiVolume2 size={24} style={{ color: config.theme.primary }} />
      )}
    </motion.button>
  );
}

export default SoundController;
