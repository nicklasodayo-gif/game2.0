import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * useIdleDetection - Custom hook for detecting user idle state
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Idle timeout in milliseconds
 * @param {Function} options.onIdle - Callback when user becomes idle
 * @param {Function} options.onActive - Callback when user becomes active
 * @param {boolean} options.enabled - Whether detection is enabled
 * @returns {Object} Idle state and controls
 */
export function useIdleDetection({
  timeout = 30000,
  onIdle,
  onActive,
  enabled = true,
} = {}) {
  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const timeoutRef = useRef(null);
  const isIdleRef = useRef(false);

  // Reset the idle timer
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If was idle, trigger active callback
    if (isIdleRef.current) {
      isIdleRef.current = false;
      setIsIdle(false);
      setLastActivity(Date.now());
      if (onActive) onActive();
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      isIdleRef.current = true;
      setIsIdle(true);
      if (onIdle) onIdle();
    }, timeout);
  }, [timeout, onIdle, onActive]);

  // Handle user activity
  const handleActivity = useCallback(() => {
    if (enabled) {
      resetTimer();
    }
  }, [enabled, resetTimer]);

  // Setup event listeners
  useEffect(() => {
    if (!enabled) return;

    // Start the timer
    resetTimer();

    // Activity events (passive for performance)
    const events = [
      'touchstart',
      'touchmove',
      'touchend',
      'click',
      'mousemove',
      'mousedown',
      'mouseup',
      'keypress',
      'keydown',
      'scroll',
      'wheel',
    ];

    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, handleActivity, resetTimer]);

  // Return controls
  return {
    isIdle,
    lastActivity,
    resetTimer,
    timeSinceLastActivity: Date.now() - lastActivity,
  };
}

export default useIdleDetection;
