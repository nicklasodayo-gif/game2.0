import { motion } from 'framer-motion';
import config from '../config';

/**
 * LoadingScreen - Full-screen loading indicator
 */
export function LoadingScreen({ message = "Loading..." }) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{
        background: `linear-gradient(135deg, ${config.theme.background} 0%, ${config.theme.backgroundLight} 100%)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Logo */}
      <motion.div
        className="w-24 h-24 rounded-2xl flex items-center justify-center mb-8"
        style={{
          background: `linear-gradient(135deg, ${config.theme.primary} 0%, ${config.theme.primaryDark} 100%)`,
        }}
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity },
        }}
      >
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <rect x="10" y="10" width="35" height="35" rx="8" fill="white" opacity="0.9" />
          <rect x="55" y="10" width="35" height="35" rx="8" fill="white" opacity="0.7" />
          <rect x="10" y="55" width="35" height="35" rx="8" fill="white" opacity="0.6" />
          <rect x="55" y="55" width="35" height="35" rx="8" fill="white" opacity="0.3" />
        </svg>
      </motion.div>

      {/* Loading text */}
      <p 
        className="text-xl font-medium"
        style={{ color: config.theme.text }}
      >
        {message}
      </p>

      {/* Progress bar */}
      <div 
        className="w-48 h-2 rounded-full mt-4 overflow-hidden"
        style={{ backgroundColor: config.theme.surface }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: config.theme.primary }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

export default LoadingScreen;
