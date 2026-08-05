import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import config from '../config';

/**
 * ConfettiEffect - Trigger confetti animations
 */
export function ConfettiEffect({ trigger, options = {} }) {
  const fireConfetti = useCallback(() => {
    const colors = options.colors || config.visuals.confettiColors;
    
    const defaults = {
      particleCount: options.particleCount || 150,
      spread: options.spread || 100,
      origin: { y: 0.6 },
      colors,
    };

    // Fire confetti
    confetti(defaults);

    // Side bursts
    if (options.sideBursts !== false) {
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
      }, options.delay || 250);

      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, (options.delay || 250) + 150);
    }
  }, [options, config.visuals.confettiColors]);

  useEffect(() => {
    if (trigger) {
      fireConfetti();
    }
  }, [trigger, fireConfetti]);

  return null;
}

/**
 * ContinuousConfetti - Background confetti effect
 */
export function ContinuousConfetti({ active }) {
  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      confetti({
        particleCount: 5,
        spread: 60,
        origin: { 
          x: Math.random(), 
          y: Math.random() * 0.5 
        },
        colors: config.visuals.particles.colors,
        ticks: 200,
        gravity: 0.5,
        scalar: 0.5,
      });
    }, 500);

    return () => clearInterval(interval);
  }, [active]);

  return null;
}

export default ConfettiEffect;
