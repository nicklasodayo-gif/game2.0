import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * useFullscreen - Custom hook for fullscreen mode management
 * 
 * @param {Object} options - Fullscreen options
 * @param {string} options.element - CSS selector for element to fullscreen
 * @param {boolean} options.autoEnter - Automatically enter fullscreen on first interaction
 * @returns {Object} Fullscreen state and controls
 */
export function useFullscreen({ element = 'body', autoEnter = false } = {}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const elementRef = useRef(null);

  // Check support on mount
  useEffect(() => {
    setIsSupported(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  }, []);

  // Get element reference
  useEffect(() => {
    if (typeof element === 'string') {
      elementRef.current = document.querySelector(element);
    } else if (element instanceof HTMLElement) {
      elementRef.current = element;
    } else {
      elementRef.current = document.documentElement;
    }
  }, [element]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Auto-enter fullscreen on first interaction
  useEffect(() => {
    if (!autoEnter || !isSupported) return;

    const enterFullscreen = () => {
      enter();
      document.removeEventListener('click', enterFullscreen);
      document.removeEventListener('touchstart', enterFullscreen);
    };

    document.addEventListener('click', enterFullscreen);
    document.addEventListener('touchstart', enterFullscreen);

    return () => {
      document.removeEventListener('click', enterFullscreen);
      document.removeEventListener('touchstart', enterFullscreen);
    };
  }, [autoEnter, isSupported, enter]);

  // Enter fullscreen
  const enter = useCallback(async () => {
    const el = elementRef.current;
    if (!el || !isSupported) return false;

    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        await el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        await el.msRequestFullscreen();
      }
      return true;
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      return false;
    }
  }, [isSupported]);

  // Exit fullscreen
  const exit = useCallback(async () => {
    if (!isFullscreen) return;

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      return true;
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
      return false;
    }
  }, [isFullscreen]);

  // Toggle fullscreen
  const toggle = useCallback(async () => {
    if (isFullscreen) {
      return exit();
    } else {
      return enter();
    }
  }, [isFullscreen, enter, exit]);

  return {
    isFullscreen,
    isSupported,
    enter,
    exit,
    toggle,
    element: elementRef.current,
  };
}

export default useFullscreen;
