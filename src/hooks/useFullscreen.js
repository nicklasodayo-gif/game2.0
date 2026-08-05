import { useState, useCallback, useEffect, useRef } from "react";

export function useFullscreen({ element = "body", autoEnter = false } = {}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const elementRef = useRef(null);

  // Check browser support
  useEffect(() => {
    setIsSupported(
      !!(
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.msFullscreenEnabled
      )
    );
  }, []);

  // Resolve target element
  useEffect(() => {
    if (typeof element === "string") {
      elementRef.current =
        document.querySelector(element) || document.documentElement;
    } else {
      elementRef.current = element || document.documentElement;
    }
  }, [element]);

  // Track fullscreen changes
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
        )
      );
    };

    document.addEventListener("fullscreenchange", handleChange);
    document.addEventListener("webkitfullscreenchange", handleChange);
    document.addEventListener("MSFullscreenChange", handleChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      document.removeEventListener("webkitfullscreenchange", handleChange);
      document.removeEventListener("MSFullscreenChange", handleChange);
    };
  }, []);

  const enter = useCallback(async () => {
    const el = elementRef.current;

    if (!el || !isSupported) return false;

    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        await el.msRequestFullscreen();
      }

      return true;
    } catch (err) {
      console.error("Failed to enter fullscreen:", err);
      return false;
    }
  }, [isSupported]);

  const exit = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }

      return true;
    } catch (err) {
      console.error("Failed to exit fullscreen:", err);
      return false;
    }
  }, []);

  const toggle = useCallback(() => {
    if (isFullscreen) {
      return exit();
    }

    return enter();
  }, [isFullscreen, enter, exit]);

  useEffect(() => {
    if (!autoEnter || !isSupported) return;

    const handleFirstInteraction = () => {
      enter();

      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [autoEnter, isSupported, enter]);

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