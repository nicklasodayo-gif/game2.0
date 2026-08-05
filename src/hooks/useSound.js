import { useState, useRef, useCallback, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/localStorage';

/**
 * useSound - Custom hook for sound effects management
 * 
 * @param {Object} options - Sound options
 * @param {boolean} options.enabled - Whether sound is enabled
 * @param {number} options.volume - Volume level (0-1)
 * @returns {Object} Sound state and controls
 */
export function useSound({ enabled: initialEnabled = true, volume: initialVolume = 0.7 } = {}) {
  const [isMuted, setIsMuted] = useState(!initialEnabled);
  const [volume, setVolumeState] = useState(initialVolume);
  const audioRefs = useRef({});

  // Load saved settings on mount
  useEffect(() => {
    const settings = getSettings();
    setIsMuted(!settings.soundEnabled);
    setVolumeState(settings.soundVolume);
  }, []);

  // Update settings when state changes
  useEffect(() => {
    updateSettings({
      soundEnabled: !isMuted,
      soundVolume: volume,
    });
  }, [isMuted, volume]);

  /**
   * Load a sound file
   * @param {string} name - Sound identifier
   * @param {string} src - Sound file URL
   */
  const loadSound = useCallback((name, src) => {
    if (!src) return;
    
    const audio = new Audio(src);
    audio.preload = 'auto';
    audioRefs.current[name] = audio;
  }, []);

  /**
   * Play a sound
   * @param {string} name - Sound identifier
   * @param {Object} options - Play options
   */
  const playSound = useCallback((name, options = {}) => {
    if (isMuted) return;
    
    const audio = audioRefs.current[name];
    if (!audio) return;

    // Clone audio for overlapping playback
    const clone = audio.cloneNode();
    clone.volume = (options.volume ?? volume);
    clone.playbackRate = options.playbackRate || 1;
    
    clone.play().catch(() => {
      // Ignore autoplay restrictions
    });

    // Clean up after playing
    clone.addEventListener('ended', () => {
      clone.remove();
    });

    // Fallback cleanup
    setTimeout(() => {
      clone.remove();
    }, 10000);
  }, [isMuted, volume]);

  /**
   * Stop a sound
   * @param {string} name - Sound identifier
   */
  const stopSound = useCallback((name) => {
    const audio = audioRefs.current[name];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  /**
   * Toggle mute
   */
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  /**
   * Set volume
   * @param {number} value - Volume level (0-1)
   */
  const setVolume = useCallback((value) => {
    setVolumeState(Math.max(0, Math.min(1, value)));
  }, []);

  /**
   * Unload all sounds
   */
  const unloadAll = useCallback(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    audioRefs.current = {};
  }, []);

  return {
    isMuted,
    volume,
    loadSound,
    playSound,
    stopSound,
    toggleMute,
    setVolume,
    unloadAll,
  };
}

export default useSound;
