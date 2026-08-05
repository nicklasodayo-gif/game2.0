import { useEffect, useRef, useCallback } from 'react';
import { useIdleDetection } from '../hooks/useIdleDetection';
import config from '../config';

/**
 * IdleTimer - Wrapper component that detects idle state
 */
export function IdleTimer({ 
  children, 
  isActive = true, 
  onIdle,
  timeout = config.settings.idleTimeout * 1000,
}) {
  const timeoutRef = useRef(null);

  // Use the idle detection hook
  useIdleDetection({
    timeout,
    enabled: isActive,
    onIdle: () => {
      if (onIdle) onIdle();
    },
  });

  return children;
}

export default IdleTimer;
