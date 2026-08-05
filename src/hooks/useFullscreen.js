import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useFullscreen - Custom hook for fullscreen management
 *
 * @param {Object} options
 * @param {string|HTMLElement} options.element - Element selector or HTMLElement
 * @param {boolean} options.autoEnter - Automatically enter fullscreen on first interaction
 */
export function useFullscreen({
  element = 'body',
  autoEnter = false,
} = {}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const elementRef = useRef(null);

  // Check browser support
  useEffect(() => {
    setIsSupported(
      !!(
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled
      )
    );
  }, []);

  // Resolve target element
  useEffect(() => {
    if (typeof element === 'string') {
      elementRef.current =
        document.querySelector(element) || document.documentElement;
    } else if (element instanceof HTMLElement) {
      elementRef.current = element;
    } else {
      elementRef.current = document.documentElement;
    }
  }, [element]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        )
      );
    };

    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    document.addEventListener('mozfullscreenchange', handleChange);
    document.addEventListener('MSFullscreenChange', handleChange);

    handleChange();

    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
      document.removeEventListener('mozfullscreenchange', handleChange);
      document.removeEventListener('MSFullscreenChange', handleChange);
    };
  }, []);

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
  }, []);

  // Toggle fullscreen
  const toggle = useCallback(async () => {
    if (isFullscreen) {
      return exit();
    }

    return enter();
  }, [isFullscreen, enter, exit]);

  // Auto-enter on first user interaction
  useEffect(() => {
    if (!autoEnter || !isSupported) return;

    const handleFirstInteraction = () => {
      enter();

      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, {
      once: true,
    });

    document.addEventListener('touchstart', handleFirstInteraction, {
      once: true,
    });

    document.addEventListener('keydown', handleFirstInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [autoEnter, isSupported, enter]);

  return {
    isFullscreen,
    isSupported,
    enter,
    exit,
    toggle,
  };
}

export default useFullscreen;
