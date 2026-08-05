import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useGameTimer - Custom hook for game timing
 * 
 * @param {Object} options - Timer options
 * @param {number} options.initialTime - Starting time in seconds
 * @param {number} options.maxTime - Maximum time (optional)
 * @param {Function} options.onTick - Callback on each tick
 * @param {Function} options.onComplete - Callback when timer completes
 * @returns {Object} Timer state and controls
 */
export function useGameTimer({ initialTime = 0, maxTime, onTick, onComplete } = {}) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const maxTimeRef = useRef(maxTime);

  // Update maxTime ref when it changes
  useEffect(() => {
    maxTimeRef.current = maxTime;
  }, [maxTime]);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Start the timer
  const start = useCallback(() => {
    if (intervalRef.current) return;
    
    setIsRunning(true);
    setIsPaused(false);
    
    intervalRef.current = setInterval(() => {
      setTime(prev => {
        const newTime = prev + 1;
        
        // Call tick callback
        if (onTick) {
          onTick(newTime);
        }
        
        // Check max time
        if (maxTimeRef.current && newTime >= maxTimeRef.current) {
          if (onComplete) {
            onComplete(newTime);
          }
          return maxTimeRef.current;
        }
        
        return newTime;
      });
    }, 1000);
  }, [onTick, onComplete]);

  // Stop the timer
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  // Pause the timer
  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
  }, []);

  // Resume the timer
  const resume = useCallback(() => {
    if (!isRunning || isPaused) {
      setIsPaused(false);
      setIsRunning(true);
      
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          
          if (onTick) {
            onTimeUpdate(newTime);
          }
          
          if (maxTimeRef.current && newTime >= maxTimeRef.current) {
            if (onComplete) {
              onComplete(newTime);
            }
            return maxTimeRef.current;
          }
          
          return newTime;
        });
      }, 1000);
    }
  }, [isRunning, isPaused, onTick, onComplete]);

  // Reset the timer
  const reset = useCallback(() => {
    stop();
    setTime(initialTime);
  }, [stop, initialTime]);

  // Set time directly
  const setTimeValue = useCallback((value) => {
    setTime(value);
  }, []);

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    time,
    formattedTime: formatTime(time),
    isRunning,
    isPaused,
    start,
    stop,
    pause,
    resume,
    reset,
    setTime: setTimeValue,
    formatTime,
  };
}

export default useGameTimer;
